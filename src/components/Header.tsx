
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-4 px-6 flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-medium tracking-tight">Conway's Game</span>
      </div>
      <nav>
        <ul className="flex items-center space-x-6">
          <li>
            <a href="#about" className="story-link text-sm font-medium">
              About
            </a>
          </li>
          <li>
            <a href="#patterns" className="story-link text-sm font-medium">
              Patterns
            </a>
          </li>
          <li>
            <a href="#rules" className="story-link text-sm font-medium">
              Rules
            </a>
          </li>
          <li>
            <Button variant="ghost" size="icon" className="hover-scale">
              <a href="https://github.com/conwaylife/conwaylife.com" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
