import React from 'react';

const StatsBar = () => (
  <div className="flex gap-6 bg-white rounded-lg shadow p-4 border border-neutral">
    <div>
      <div className="text-primary text-xl font-bold">2</div>
      <div className="text-xs text-gray-500">Projects</div>
    </div>
    <div>
      <div className="text-accent text-xl font-bold">1,500</div>
      <div className="text-xs text-gray-500">Credits Available</div>
    </div>
    <div>
      <div className="text-primary text-xl font-bold">$13.25</div>
      <div className="text-xs text-gray-500">Avg Price</div>
    </div>
  </div>
);

export default StatsBar; 