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
    { id: "open", label: "Open Now" },
    { id: "nearby", label: "Nearby" },
    { id: "halal", label: "Halal" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "cheap", label: "$ Only" },
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
          {filter.label}
        </button>
      ))}
    </div>
  );
}
