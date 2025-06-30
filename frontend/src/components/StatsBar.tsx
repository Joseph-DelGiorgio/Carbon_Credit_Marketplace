import React from 'react';

const StatsBar: React.FC = () => {
  return (
    <div className="flex gap-6 mb-8">
      <div className="bg-white rounded shadow px-6 py-4 flex-1 text-center">
        <div className="text-2xl font-bold">2,500</div>
        <div className="text-gray-500 text-sm">Total Credits</div>
      </div>
      <div className="bg-white rounded shadow px-6 py-4 flex-1 text-center">
        <div className="text-2xl font-bold">$25,000</div>
        <div className="text-gray-500 text-sm">Total Volume</div>
      </div>
      <div className="bg-white rounded shadow px-6 py-4 flex-1 text-center">
        <div className="text-2xl font-bold">3</div>
        <div className="text-gray-500 text-sm">Projects</div>
      </div>
    </div>
  );
};

export default StatsBar; 