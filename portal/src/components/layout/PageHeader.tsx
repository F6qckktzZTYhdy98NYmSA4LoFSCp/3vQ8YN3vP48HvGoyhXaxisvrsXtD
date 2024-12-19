import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, subtitle, children, className }: PageHeaderProps) => {
  return (
    <div className={`flex justify-between items-start mb-2 bg-transparent flex-shrink-0 sticky top-0 py-4 -mt-4 -mx-8 px-8 z-10 text-[#243c4b] ${className || ''}`}>
      <div>
        <h2 className="text-4xl font-bold">{title}</h2>
        {subtitle && <p className="text-xl italic">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
