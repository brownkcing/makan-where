"use client";

interface QuickFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export default function QuickFilters({
  activeFilters,
  onFilterChange,
}: QuickFiltersProps) {
  const filters = [
    { id: "nearby", label: "Nearby", icon: "📍" },
    { id: "open", label: "Open Now", icon: "⏰" },
    { id: "noqueue", label: "No Queue", icon: "👥" },
    { id: "halal", label: "Halal", icon: "🥘" },
    { id: "vegetarian", label: "Vegetarian", icon: "🥬" },
  ];

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter((id) => id !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => toggleFilter(filter.id)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${
              activeFilters.includes(filter.id)
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          <span>{filter.icon}</span>
          <span className="font-medium">{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
