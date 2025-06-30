import React from 'react';

const FiltersSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select className="w-full border rounded px-2 py-1">
          <option>All</option>
          <option>Afforestation</option>
          <option>Biochar</option>
          <option>Reforestation</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Location</label>
        <select className="w-full border rounded px-2 py-1">
          <option>All</option>
          <option>Kenya</option>
          <option>India</option>
          <option>Indonesia</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Co-benefits</label>
        <div className="flex flex-wrap gap-2">
          <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Biodiversity</button>
          <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Community</button>
          <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Soil Health</button>
          <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Women Empowerment</button>
          <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Coastal Protection</button>
          <button className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Fisheries</button>
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar; 