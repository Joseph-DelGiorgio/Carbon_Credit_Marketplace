import React from 'react';

const FiltersSidebar = () => (
  <aside className="w-64 bg-white rounded-lg shadow p-4 border border-neutral h-fit">
    <h2 className="text-lg font-bold mb-4 text-primary">Filters</h2>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Type</label>
      <select className="w-full border rounded p-2">
        <option>All</option>
        <option>Reforestation</option>
        <option>Renewable Energy</option>
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Price Range</label>
      <input type="range" min="0" max="50" className="w-full" />
    </div>
    <button className="w-full bg-secondary text-white py-2 rounded hover:bg-secondary-dark transition">Apply</button>
  </aside>
);

export default FiltersSidebar; 