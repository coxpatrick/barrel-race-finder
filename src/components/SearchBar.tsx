import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  large?: boolean;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search races, cities, arenas…',
  large = false,
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-dust-400 pointer-events-none
          ${large ? 'w-5 h-5' : 'w-4 h-4'}`}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field pl-11 pr-10
          ${large
            ? 'py-4 text-base rounded-2xl shadow-md'
            : 'py-3 text-sm'
          }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dust-400
                     hover:text-dust-600 transition-colors rounded-full hover:bg-dust-100"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
