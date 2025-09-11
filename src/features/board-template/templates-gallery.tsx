import { ScrollArea } from '@/shared/ui/kit/scroll-area';
import { TemplateCard } from './template-card';
import { cn } from '@/shared/lib/css';

const templates = [
  {
    id: '1',
    name: 'Template 1',
    description: 'Template 1 description',
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Template 2',
    description: 'Template 2 description',
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Template 3',
    description: 'Template 3 description',
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    name: 'Template 4',
    description: 'Template 4 description',
    thumbnail: 'https://via.placeholder.com/150',
  },
];

export function TemplatesGallery({ className }: { className?: string }) {
  return (
    <ScrollArea className="w-full">
      <div className={cn('flex gap-4', [className])}>
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} onSelect={() => {}} />
        ))}
      </div>
    </ScrollArea>
  );
}
