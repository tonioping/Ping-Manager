
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    colorClass: string;
    onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, icon: Icon, colorClass, onClick }) => {
  const textColor = colorClass.split(' ')[0].replace('bg-', 'text-');
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
    >
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon size={28} className={textColor} />
      </div>
    </div>
  );
});
