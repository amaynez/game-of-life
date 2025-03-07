
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2, Shuffle, Zap } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  onClear: () => void;
  onRandom: () => void;
  onSpeedChange: (value: number) => void;
  speed: number;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onToggleRunning,
  onClear,
  onRandom,
  onSpeedChange,
  speed,
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl shadow-lg flex flex-col gap-6 animate-fade-in">
      <h2 className="text-lg font-medium">Controls</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onToggleRunning}
          variant="outline"
          className="flex items-center justify-center gap-2 hover-scale button-hover-effect h-12"
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          onClick={onClear}
          variant="outline"
          className="flex items-center justify-center gap-2 hover-scale button-hover-effect h-12"
        >
          <Trash2 size={18} />
          Clear
        </Button>
        
        <Button
          onClick={onRandom}
          variant="outline"
          className="flex items-center justify-center gap-2 hover-scale button-hover-effect h-12"
        >
          <Shuffle size={18} />
          Random
        </Button>
        
        <Button
          onClick={() => {}}
          variant="outline"
          className="flex items-center justify-center gap-2 hover-scale button-hover-effect h-12"
        >
          <Zap size={18} />
          Step
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Speed</span>
          <span className="text-xs text-muted-foreground">{speed}ms</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
