import { Button } from '@/shared/ui/kit/button';
import { ArrowUpRight, CornerUpRight, Redo } from 'lucide-react';
import type { ViewModel } from '../view-model/view-model-type';

export const Configurator = ({
  configuratorType,
}: {
  configuratorType: ViewModel['configurator'];
}) => {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow flex flex-col gap-3">
      {configuratorType?.type === 'arrow' && (
        <fieldset className="flex flex-col gap-1">
          <legend>Stroke</legend>
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

      <fieldset className="flex flex-col gap-1">
        <legend>Stroke style</legend>
        <div className="flex gap-1.5">
          <Button
            onClick={() => configuratorType?.actions.setStrokeStyle?.('solid')}
            variant={'outline'}
            size={'icon'}
          >
            Solid
          </Button>
          <Button
            onClick={() => configuratorType?.actions.setStrokeStyle?.('dashed')}
            variant={'outline'}
            size={'icon'}
          >
            Dashed
          </Button>
          <Button
            onClick={() => configuratorType?.actions.setStrokeStyle?.('dotted')}
            variant={'outline'}
            size={'icon'}
          >
            Dotted
          </Button>
        </div>
      </fieldset>
    </div>
  );
};
