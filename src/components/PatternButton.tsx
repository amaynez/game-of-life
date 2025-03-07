
import React from 'react';
import { Button } from '@/components/ui/button';

interface PatternButtonProps {
  name: string;
  description: string;
  pattern: boolean[][];
  onSelect: (pattern: boolean[][]) => void;
}

const PatternButton: React.FC<PatternButtonProps> = ({
  name,
  description,
  pattern,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(pattern);
  };

  // Create mini preview of the pattern
  const renderPreview = () => {
    const size = 4; // Size of preview cells
    const maxPreviewSize = 10; // Maximum cells to display
    
    const rows = Math.min(pattern.length, maxPreviewSize);
    const cols = Math.min(pattern[0].length, maxPreviewSize);
    
    return (
      <div className="grid gap-[1px]" style={{ 
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`
      }}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          Array.from({ length: cols }).map((_, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`${pattern[rowIndex][colIndex] ? 'bg-primary' : 'bg-transparent border border-primary/10'} rounded-[1px]`}
              style={{ width: size, height: size }}
            />
          ))
        ))}
      </div>
    );
  };

  return (
    <Button
      variant="outline"
      className="flex items-center p-4 h-auto space-y-2 hover-scale button-hover-effect w-full"
      onClick={handleClick}
    >
      <div className="flex flex-col items-start w-full gap-2">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-left">{name}</span>
          <div className="ml-2">{renderPreview()}</div>
        </div>
        <p className="text-xs text-muted-foreground text-left">{description}</p>
      </div>
    </Button>
  );
};

export default PatternButton;
