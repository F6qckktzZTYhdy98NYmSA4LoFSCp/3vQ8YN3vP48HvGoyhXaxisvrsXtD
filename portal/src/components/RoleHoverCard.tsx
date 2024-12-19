import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import { Role } from '../data/roles';

interface RoleHoverCardProps {
  role: Role;
  children: React.ReactNode;
}

export function RoleHoverCard({ role, children }: RoleHoverCardProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-[320px] p-0" 
        side="right"
        align="start"
        sideOffset={12}
        avoidCollisions={true}
        collisionPadding={20}
      >
        <div className="flex flex-col">
          {/* Header with image and basic info */}
          <div className="flex items-start gap-3 p-3 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm flex-shrink-0">
              <img 
                src={role.image} 
                alt={`${role.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow pt-1">
              <h3 className="font-semibold text-gray-900">{role.name}</h3>
              <p className="text-sm text-gray-600">{role.title}</p>
              <p className="text-xs text-gray-500">{role.department}</p>
            </div>
          </div>

          {/* Description and details */}
          <div className="p-3 space-y-3 text-left">
            <p className="text-sm text-gray-600">{role.description}</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Responsibilities */}
              <div className="text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Responsibilities</h4>
                <ul className="space-y-1 list-disc ml-4 text-xs text-gray-600">
                  {role.responsibilities.map((item, index) => (
                    <li key={index} className="text-left">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Security Focus */}
              <div className="text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Security Focus</h4>
                <ul className="space-y-1 list-disc ml-4 text-xs text-gray-600">
                  {role.securityFocus.map((item, index) => (
                    <li key={index} className="text-left">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
