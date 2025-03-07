
import React from 'react';

interface HeroProps {
  children: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ children }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20 pointer-events-none" />
      
      <div className="text-center mb-10 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Conway's Game of Life</h1>
        <p className="text-xl text-muted-foreground">
          A cellular automaton where simple rules create complex emergent behavior
        </p>
      </div>
      
      <div className="z-10 w-full max-w-5xl">
        {children}
      </div>
    </section>
  );
};

export default Hero;
