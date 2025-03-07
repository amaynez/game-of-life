
import React from 'react';

interface InfoCardProps {
  title: string;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content, icon, id }) => {
  return (
    <div id={id} className="glass-panel p-6 rounded-2xl shadow-lg animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-primary">{icon}</div>}
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {content}
      </div>
    </div>
  );
};

export default InfoCard;
