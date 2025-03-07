
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} • Designed with precision
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
