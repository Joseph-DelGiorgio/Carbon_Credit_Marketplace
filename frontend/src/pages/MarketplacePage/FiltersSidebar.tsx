import React from 'react';

export const FiltersSidebar: React.FC = () => {
  return (
    <aside className="w-64 p-6 bg-white border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Project Type</label>
        <select className="w-full border rounded p-2">
          <option>All</option>
          <option>Reforestation</option>
          <option>Renewable Energy</option>
          <option>Waste-to-Energy</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        <input className="w-full border rounded p-2" placeholder="e.g. Brazil" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Verification Status</label>
        <select className="w-full border rounded p-2">
          <option>All</option>
          <option>Verified</option>
          <option>Unverified</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Price Range</label>
        <input className="w-full border rounded p-2" placeholder="Min" type="number" />
        <input className="w-full border rounded p-2 mt-2" placeholder="Max" type="number" />
      </div>
    </aside>
  );
}; 