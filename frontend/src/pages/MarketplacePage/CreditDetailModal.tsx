import React from 'react';
import { Credit } from './CreditList';

export const CreditDetailModal: React.FC<{
  credit: Credit | null;
  onClose: () => void;
}> = ({ credit, onClose }) => {
  if (!credit) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2">{credit.projectName}</h2>
        <div className="text-gray-600 mb-2">{credit.location}</div>
        <div className="mb-2"><span className="font-semibold">CO₂:</span> {credit.co2_kg} kg</div>
        <div className="mb-2"><span className="font-semibold">Price:</span> ${credit.price.toFixed(2)}</div>
        <div className="mb-2"><span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${credit.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{credit.verified ? 'Verified' : 'Unverified'}</span></div>
        <div className="mb-4 text-gray-700">{credit.metadata}</div>
        {/* TODO: Add Buy, Retire, Transfer buttons here */}
        <div className="flex gap-2 mt-4">
          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Buy</button>
          <button className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700">Transfer</button>
          <button className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700">Retire</button>
        </div>
      </div>
    </div>
  );
}; 