import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/kit/tabs';
import { Grid2X2, ListIcon } from 'lucide-react';

export type ViewMode = 'list' | 'grid';

export const ViewModeToggle = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: ViewMode) => void;
}) => {
  return (
    <Tabs defaultValue={value} onValueChange={(e) => onChange(e as ViewMode)}>
      <TabsList>
        <TabsTrigger className="cursor-pointer" value="list">
          <ListIcon />
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="grid">
          <Grid2X2 />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
