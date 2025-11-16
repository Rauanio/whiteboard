import { Button } from '@/shared/ui/kit/button';
import { ArrowUpRight, CornerUpRight, Redo } from 'lucide-react';
import type { ViewModel } from '../view-model/view-model-type';
import { Slider } from '@/shared/ui/kit/slider';
import {
  DEFAULT_ELEMENT_BACKGROUND_PICKS,
  DEFAULT_ELEMENT_STROKE_PICKS,
} from '@/shared/common/colors';
import { ColorPicker } from './color-picker';

export const Configurator = ({
  configurator,
}: {
  configurator: ViewModel['configurator'];
}) => {
  if (!configurator) return null;

  const { type, actions, selectedNodesConfiguration } = configurator;

  if (!selectedNodesConfiguration) {
    return null;
  }

  const { stroke, background } = selectedNodesConfiguration;

  console.log(DEFAULT_ELEMENT_STROKE_PICKS);

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg flex flex-col gap-3">
      {type === 'arrow' && (
        <fieldset className="flex flex-col gap-1">
          <legend>Arrow type</legend>
          <div className="flex gap-1.5">
            <Button variant={'outline'} size={'icon'}>
              <ArrowUpRight />
            </Button>
            <Button variant={'outline'} size={'icon'}>
              <CornerUpRight />
            </Button>
            <Button variant={'outline'} size={'icon'}>
              <Redo />
            </Button>
          </div>
        </fieldset>
      )}

      <fieldset className="space-y-1">
        <legend className="text-sm">Stroke</legend>
        <ColorPicker
          topPicks={DEFAULT_ELEMENT_STROKE_PICKS}
          activeColor={stroke}
          onChange={(color) => actions.setStroke(color)}
        />
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="text-sm">Background</legend>
        <ColorPicker
          topPicks={DEFAULT_ELEMENT_BACKGROUND_PICKS}
          activeColor={background}
          onChange={(color) => actions.setBackground(color)}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <legend>Stroke style</legend>
        <div className="flex gap-1.5">
          <Button
            onClick={() => actions.setStrokeStyle('solid')}
            variant={'outline'}
            size={'icon'}
          >
            Solid
          </Button>
          <Button
            onClick={() => actions.setStrokeStyle('dashed')}
            variant={'outline'}
            size={'icon'}
          >
            Dashed
          </Button>
          <Button
            onClick={() => actions.setStrokeStyle('dotted')}
            variant={'outline'}
            size={'icon'}
          >
            Dotted
          </Button>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <legend>Stroke width</legend>
        <div className="flex gap-1.5">
          <Button
            onClick={() => actions.setStrokeWidth(1)}
            variant={'outline'}
            size={'icon'}
          >
            Thin
          </Button>
          <Button
            onClick={() => actions.setStrokeWidth(3)}
            variant={'outline'}
            size={'icon'}
          >
            Bold
          </Button>
          <Button
            onClick={() => actions.setStrokeWidth(5)}
            variant={'outline'}
            size={'icon'}
          >
            Extra bold
          </Button>
        </div>
      </fieldset>

      {(type === 'rectangle' || type === 'diamond') && (
        <fieldset className="flex flex-col gap-1">
          <legend>Edges</legend>
          <div className="flex gap-1.5">
            <Button
              onClick={() => actions.setEdges('sharp')}
              variant={'outline'}
              size={'icon'}
            >
              Sharp
            </Button>
            <Button
              onClick={() => actions.setEdges('round')}
              variant={'outline'}
              size={'icon'}
            >
              Round
            </Button>
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-1">
        <legend>Opacity</legend>
        <Slider
          defaultValue={selectedNodesConfiguration.opacity}
          max={100}
          step={1}
          onValueChange={(value) => actions.setOpacity(value)}
        />
      </fieldset>
    </div>
  );
};
