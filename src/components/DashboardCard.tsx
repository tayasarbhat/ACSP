import React from 'react';
import { Car as Card } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

export function DashboardCard({ title, value, color, icon }: DashboardCardProps) {
  return (
    <div className={`p-6 rounded-xl shadow-lg ${color} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="text-white/80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}