
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const Header: React.FC = () => {
  // Function to handle smooth scrolling with offset
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Get header height to use as offset
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      
      // Calculate position with offset
      let offsetPosition;
      
      // For patterns section, add extra offset for the subheading
      if (targetId === "patterns") {
        const extraOffset = 30; // Additional offset for the subheading
        const elementPosition = targetElement.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20 - extraOffset;
      } else {
        // Standard offset for other sections
        const elementPosition = targetElement.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
      }
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-4 px-6 flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-medium tracking-tight">Conway's Game</span>
      </div>
      <nav>
        <ul className="flex items-center space-x-6">
          <li>
            <a 
              href="#about" 
              className="story-link text-sm font-medium"
              onClick={(e) => handleAnchorClick(e, "about")}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#patterns" 
              className="story-link text-sm font-medium"
              onClick={(e) => handleAnchorClick(e, "patterns")}
            >
              Patterns
            </a>
          </li>
          <li>
            <a 
              href="#rules" 
              className="story-link text-sm font-medium"
              onClick={(e) => handleAnchorClick(e, "rules")}
            >
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
