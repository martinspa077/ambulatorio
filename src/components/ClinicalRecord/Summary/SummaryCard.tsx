'use client';

import React from 'react';

interface SummaryCardProps {
    title: string;
    icon: React.ReactNode;
    iconClassName?: string; // For background color of the icon box
    children: React.ReactNode;
    className?: string; // For additional card styling
}

export default function SummaryCard({ title, icon, iconClassName = 'bg-cyan-600', children, className = '' }: SummaryCardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            <div className="flex items-stretch h-12">
                {/* Icon Box */}
                <div className={`w-12 flex items-center justify-center text-white ${iconClassName}`}>
                    {icon}
                </div>
                {/* Title Box */}
                <div className="flex-1 bg-[#005F61] flex items-center px-4">
                    <h3 className="text-white font-medium text-sm uppercase tracking-wide">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1">
                {children}
            </div>
        </div>
    );
}
