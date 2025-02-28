import React, { useState } from 'react';

interface FilterValues {
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
}

interface FilterFormProps {
  onFilter: (filters: FilterValues) => void;
}

const TransactionFilter: React.FC<FilterFormProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="mb-6 p-6 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="mt-0 mb-4 text-lg text-gray-700">Filter Transactions</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 text-sm text-gray-600">
            Client Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search by client name"
            className="p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-2 text-sm text-gray-600">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="mb-2 text-sm text-gray-600">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4 md:col-span-3">
          <button
            type="button"
            onClick={handleReset}
            className="py-3 px-6 bg-gray-100 text-gray-700 border-none rounded text-sm cursor-pointer transition-colors duration-300 hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-3 px-6 bg-blue-400 text-white border-none rounded text-sm cursor-pointer transition-colors duration-300 hover:bg-blue-400"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionFilter;