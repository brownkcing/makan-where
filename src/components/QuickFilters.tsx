'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const QuickFilters = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filters = [
    { id: 'nearby', label: 'Nearby', icon: '📍' },
    { id: 'open', label: 'Open Now', icon: '⏰' },
    { id: 'noqueue', label: 'No Queue', icon: '👥' },
    { id: 'halal', label: 'Halal', icon: '🥘' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters(current =>
      current.includes(filterId)
        ? current.filter(id => id !== filterId)
        : [...current, filterId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFilter(filter.id)}
            className={`
              px-4 py-2 rounded-full flex items-center gap-2 transition-colors
              ${activeFilters.includes(filter.id)
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <span>{filter.icon}</span>
            <span className="font-medium">{filter.label}</span>
          </motion.button>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} applied
          </p>
          <button
            onClick={() => setActiveFilters([])}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};