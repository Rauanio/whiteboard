import { Button } from '@/shared/ui/kit/button';
import {
  ArrowDownToLine,
  ArrowUpRight,
  ArrowUpToLine,
  Copy,
  CornerUpRight,
  Redo,
  SquareRoundCorner,
  Trash2,
} from 'lucide-react';
import type { ViewModel } from '../view-model/view-model-type';
import { Slider } from '@/shared/ui/kit/slider';
import {
  DEFAULT_ELEMENT_BACKGROUND_PICKS,
  DEFAULT_ELEMENT_STROKE_PICKS,
} from '@/shared/common/colors';
import { ColorPicker } from './color-picker';
import { RadioSelection } from '@/shared/ui/radio-selection';
import type { Edge, StrokeStyle, StrokeWidth } from '../domain/types';
import {
  SquareSharpCorner,
  StrokeStyleDashed,
  StrokeStyleDotted,
  StrokeStyleSolid,
  StrokeWidthBold,
  StrokeWidthExtraBold,
  StrokeWidthThin,
} from '@/shared/icons';

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

      {type !== 'sticker' && (
        <fieldset className="space-y-1">
          <legend className="text-sm">Stroke</legend>
          <ColorPicker
            topPicks={DEFAULT_ELEMENT_STROKE_PICKS}
            activeColor={stroke}
            onChange={(color) => actions.setStroke(color)}
          />
        </fieldset>
      )}

      {type !== 'free-hand' && (
        <fieldset className="space-y-1">
          <legend className="text-sm">Background</legend>
          <ColorPicker
            topPicks={DEFAULT_ELEMENT_BACKGROUND_PICKS}
            activeColor={background}
            onChange={(color) => actions.setBackground(color)}
          />
        </fieldset>
      )}

      {!(type === 'sticker' || type === 'free-hand') && (
        <fieldset className="space-y-1">
          <legend className="text-sm">Stroke style</legend>
          <div className="flex gap-1.5">
            <RadioSelection<StrokeStyle>
              group="strokeStyle"
              onChange={(value) => actions.setStrokeStyle(value)}
              options={[
                {
                  icon: StrokeStyleSolid,
                  text: 'solid',
                  value: 'solid',
                },
                {
                  icon: StrokeStyleDashed,
                  text: 'dashed',
                  value: 'dashed',
                },
                {
                  icon: StrokeStyleDotted,
                  text: 'dotted',
                  value: 'dotted',
                },
              ]}
              value={strokeStyle}
            />
          </div>
        </fieldset>
      )}

      {type !== 'sticker' && (
        <fieldset className="space-y-1">
          <legend className="text-sm">Stroke width</legend>
          <div className="flex gap-1.5">
            <RadioSelection<StrokeWidth>
              group="strokeWidth"
              onChange={(value) => actions.setStrokeWidth(value)}
              options={[
                {
                  icon: StrokeWidthThin,
                  text: 'thin',
                  value: 'thin',
                },
                {
                  icon: StrokeWidthBold,
                  text: 'bold',
                  value: 'bold',
                },
                {
                  icon: StrokeWidthExtraBold,
                  text: 'extraBold',
                  value: 'extra-bold',
                },
              ]}
              value={strokeWidth}
            />
          </div>
        </fieldset>
      )}

      {type === 'rectangle' && (
        <fieldset className="space-y-1">
          <legend className="text-sm">Edges</legend>
          <div className="flex gap-1.5">
            <RadioSelection<Edge>
              group="edges"
              onChange={(value) => actions.setEdges(value)}
              options={[
                {
                  icon: SquareSharpCorner,
                  text: 'sharp',
                  value: 'sharp',
                },
                {
                  icon: SquareRoundCorner,
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

      <fieldset className="space-y-1">
        <legend className="text-sm">Layers</legend>
        <div className="flex gap-1.5">
          <Button
            onClick={() => actions.setLayer('back')}
            title="Send to back"
            variant={'outline'}
            size={'icon-sm'}
          >
            <ArrowDownToLine />
          </Button>
          <Button
            onClick={() => actions.setLayer('front')}
            title="Bring to front"
            variant={'outline'}
            size={'icon-sm'}
          >
            <ArrowUpToLine />
          </Button>
        </div>
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="text-sm">Actions</legend>
        <div className="flex gap-1.5">
          <Button
            onClick={() => actions.duplicateNode()}
            title="Send to back"
            variant={'outline'}
            size={'icon-sm'}
          >
            <Copy />
          </Button>
          <Button
            onClick={() => actions.deleteNode()}
            title="Bring to front"
            variant={'outline'}
            size={'icon-sm'}
          >
            <Trash2 />
          </Button>
        </div>
      </fieldset>
    </div>
  );
};
