import { Button } from '@/shared/ui/kit/button';
import { ArrowUpRight, CornerUpRight, Redo, Square, Squircle } from 'lucide-react';
import type { ViewModel } from '../view-model/view-model-type';
import { Slider } from '@/shared/ui/kit/slider';
import {
  DEFAULT_ELEMENT_BACKGROUND_PICKS,
  DEFAULT_ELEMENT_STROKE_PICKS,
} from '@/shared/common/colors';
import { ColorPicker } from './color-picker';
import { RadioSelection } from '@/shared/ui/radio-selection';
import type { Edge, StrokeStyle } from '../domain/types';
import { STROKE_WIDTH } from '@/shared/common/contants';

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

  const { stroke, background, edge, strokeWidth, strokeStyle } =
    selectedNodesConfiguration;

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg flex flex-col gap-3">
      {type === 'arrow' && (
        <fieldset className="space-y-1">
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

      <fieldset className="space-y-1">
        <legend className="text-sm">Stroke style</legend>
        <div className="flex gap-1.5">
          <RadioSelection
            group="strokeStyle"
            onChange={(value) => actions.setStrokeStyle(value)}
            options={[
              {
                icon: Square,
                text: 'solid',
                value: 'solid',
              },
              {
                icon: Squircle,
                text: 'dashed',
                value: 'dashed',
              },
              {
                icon: Squircle,
                text: 'dotted',
                value: 'dotted',
              },
            ]}
            value={strokeStyle}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="text-sm">Stroke width</legend>
        <div className="flex gap-1.5">
          <RadioSelection
            group="strokeWidth"
            onChange={(value) => actions.setStrokeWidth(value)}
            options={[
              {
                icon: Square,
                text: 'thin',
                value: STROKE_WIDTH.thin,
              },
              {
                icon: Squircle,
                text: 'bold',
                value: STROKE_WIDTH.bold,
              },
              {
                icon: Squircle,
                text: 'extraBold',
                value: STROKE_WIDTH.extraBold,
              },
            ]}
            value={strokeWidth}
          />
        </div>
      </fieldset>

      {(type === 'rectangle' || type === 'diamond') && (
        <fieldset className="space-y-1">
          <legend className="text-sm">Edges</legend>
          <div className="flex gap-1.5">
            <RadioSelection<Edge>
              group="edges"
              onChange={(value) => actions.setEdges(value)}
              options={[
                {
                  icon: Square,
                  text: 'sharp',
                  value: 'sharp',
                },
                {
                  icon: Squircle,
                  text: 'round',
                  value: 'round',
                },
              ]}
              value={edge}
            />
          </div>
        </fieldset>
      )}

      <fieldset className="space-y-1">
        <legend className="text-sm">Opacity</legend>
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
