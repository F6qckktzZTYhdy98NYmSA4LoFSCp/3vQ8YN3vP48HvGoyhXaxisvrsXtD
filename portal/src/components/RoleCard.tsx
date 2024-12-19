import { cn } from '../lib/utils';
import { Role } from '../data/roles';

interface RoleCardProps extends Role {
  selected: boolean;
  onClick: () => void;
}

export function RoleCard({ 
  name, 
  title, 
  image,
  description,
  responsibilities,
  securityFocus,
  selected, 
  onClick 
}: RoleCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 h-full w-full',
        'hover:shadow-md hover:scale-102',
        selected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-100'
      )}
    >
      <div className="flex items-start gap-2">
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm flex-shrink-0">
          <img 
            src={image} 
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow min-w-0 pt-1">
          <h3 className="font-semibold text-base text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-600 truncate">{name}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="mt-2 space-y-2 text-left">

        <div className="grid grid-cols-2 gap-2">
          {/* Responsibilities */}
          <div className="text-left">
            <h4 className="text-xs font-medium text-gray-900 mb-1">Responsibilities</h4>
            <ul className="space-y-0.5 list-disc ml-3 text-xs text-gray-600">
              {responsibilities.slice(0, 3).map((item, index) => (
                <li key={index} className="text-left line-clamp-1">{item}</li>
              ))}
            </ul>
          </div>

          {/* Security Focus */}
          <div className="text-left">
            <h4 className="text-xs font-medium text-gray-900 mb-1">Security Focus</h4>
            <ul className="space-y-0.5 list-disc ml-3 text-xs text-gray-600">
              {securityFocus.slice(0, 3).map((item, index) => (
                <li key={index} className="text-left line-clamp-1">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
