import React from 'react';
import { Credit } from './CreditList';

export const CreditCard: React.FC<{
  credit: Credit;
  onClick: () => void;
}> = ({ credit, onClick }) => {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col justify-between hover:ring-2 ring-green-400 transition cursor-pointer" onClick={onClick}>
      <div>
        <h3 className="text-lg font-bold mb-1">{credit.projectName}</h3>
        <div className="text-sm text-gray-500 mb-2">{credit.location}</div>
        <div className="mb-2">
          <span className="font-semibold">CO₂:</span> {credit.co2_kg} kg
        </div>
        <div className="mb-2">
          <span className="font-semibold">Price:</span> ${credit.price.toFixed(2)}
        </div>
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${credit.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{credit.verified ? 'Verified' : 'Unverified'}</span>
        </div>
      </div>
      <button className="mt-4 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700" onClick={onClick}>
        View Details
      </button>
    </div>
  );
}; 