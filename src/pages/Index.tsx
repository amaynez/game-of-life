
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Info, BookOpen, Grid, Lightbulb } from 'lucide-react';

import Header from '@/components/Header';
import GameOfLife from '@/components/GameOfLife';
import Controls from '@/components/Controls';
import Hero from '@/components/Hero';
import InfoCard from '@/components/InfoCard';
import PatternButton from '@/components/PatternButton';
import Footer from '@/components/Footer';

// Predefined patterns
const patterns = {
  glider: [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],
  blinker: [
    [false, false, false],
    [true, true, true],
    [false, false, false]
  ],
  pulsar: [
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, true, false, false, false, true, true, true, false, false]
  ],
  gosperGliderGun: [
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
    [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
    [true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [true, true, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  ]
};

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [currentPattern, setCurrentPattern] = useState<boolean[][] | undefined>(undefined);
  const [gridSize, setGridSize] = useState(50);
  const [cellSize, setCellSize] = useState(12);
  
  useEffect(() => {
    toast("Welcome to Conway's Game of Life", {
      description: "Click on the grid to add cells or use the patterns below.",
      duration: 5000,
    });
  }, []);
  
  const handleToggleRunning = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);
  
  const handleClear = useCallback(() => {
    setCurrentPattern(undefined);
    setIsRunning(false);
    
    // Create empty grid
    const emptyGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(false)
    );
    setCurrentPattern(emptyGrid);
    
    toast("Grid cleared", {
      description: "All cells have been removed.",
    });
  }, [gridSize]);
  
  const handleRandom = useCallback(() => {
    const randomGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(false).map(() => Math.random() > 0.85)
    );
    setCurrentPattern(randomGrid);
    
    toast("Random pattern generated", {
      description: "A new random pattern has been created.",
    });
  }, [gridSize]);
  
  const handleSelectPattern = useCallback((pattern: boolean[][]) => {
    setCurrentPattern(pattern);
    setIsRunning(false);
    
    toast("Pattern applied", {
      description: "Click play to see it evolve!",
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Hero>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GameOfLife 
              gridSize={gridSize}
              cellSize={cellSize}
              initialPattern={currentPattern}
              speed={speed}
              isRunning={isRunning}
            />
          </div>
          
          <div className="space-y-6">
            <Controls 
              isRunning={isRunning}
              onToggleRunning={handleToggleRunning}
              onClear={handleClear}
              onRandom={handleRandom}
              onSpeedChange={setSpeed}
              speed={speed}
            />
            
            <div className="glass-panel p-6 rounded-2xl animate-fade-in">
              <h2 className="text-lg font-medium mb-4">Patterns</h2>
              <div className="space-y-3" id="patterns">
                <PatternButton 
                  name="Glider" 
                  description="A pattern that travels diagonally across the grid"
                  pattern={patterns.glider}
                  onSelect={handleSelectPattern}
                />
                <PatternButton 
                  name="Blinker" 
                  description="A simple oscillator that alternates between two states"
                  pattern={patterns.blinker}
                  onSelect={handleSelectPattern}
                />
                <PatternButton 
                  name="Pulsar" 
                  description="A complex oscillator with a period of 3"
                  pattern={patterns.pulsar}
                  onSelect={handleSelectPattern}
                />
                <PatternButton 
                  name="Gosper Glider Gun" 
                  description="Creates an infinite stream of gliders"
                  pattern={patterns.gosperGliderGun}
                  onSelect={handleSelectPattern}
                />
              </div>
            </div>
          </div>
        </div>
      </Hero>
      
      <div className="container mx-auto px-6 py-16 space-y-16">
        <div id="about" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="About The Game of Life"
            icon={<Info size={20} />}
            content={
              <>
                <p className="mb-3">
                  Conway's Game of Life is a cellular automaton devised by mathematician John Conway in 1970. 
                  It's a zero-player game, meaning its evolution is determined by its initial state, with no 
                  further input from humans.
                </p>
                <p>
                  Despite its simple rules, the Game of Life can create incredibly complex patterns and behaviors, 
                  making it a fascinating subject in the fields of computer science, mathematics, and philosophy.
                </p>
              </>
            }
          />
          
          <InfoCard
            id="rules"
            title="The Rules"
            icon={<BookOpen size={20} />}
            content={
              <ol className="list-decimal list-inside space-y-2">
                <li>Any live cell with fewer than two live neighbors dies (underpopulation)</li>
                <li>Any live cell with two or three live neighbors survives</li>
                <li>Any live cell with more than three live neighbors dies (overpopulation)</li>
                <li>Any dead cell with exactly three live neighbors becomes alive (reproduction)</li>
              </ol>
            }
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="Patterns & Behaviors"
            icon={<Grid size={20} />}
            content={
              <>
                <p className="mb-3">
                  The Game of Life produces various types of patterns:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Still lifes:</strong> Patterns that don't change</li>
                  <li><strong>Oscillators:</strong> Patterns that repeat in cycles</li>
                  <li><strong>Spaceships:</strong> Patterns that travel across the grid</li>
                  <li><strong>Methuselahs:</strong> Patterns that evolve for many generations</li>
                </ul>
              </>
            }
          />
          
          <InfoCard
            title="Interesting Facts"
            icon={<Lightbulb size={20} />}
            content={
              <>
                <p className="mb-3">
                  The Game of Life is Turing complete, meaning it can simulate any computer algorithm. 
                  This makes it theoretically possible to build a working computer within the game itself.
                </p>
                <p>
                  The longest-lived methuselah found to date, called "Rabbits," evolves for 17,331 generations 
                  before stabilizing into still lifes and oscillators.
                </p>
              </>
            }
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
