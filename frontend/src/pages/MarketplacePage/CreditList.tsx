import React from 'react';
import { CreditCard } from './CreditCard';

export type Credit = {
  id: string;
  projectName: string;
  location: string;
  co2_kg: number;
  price: number;
  verified: boolean;
  retired: boolean;
  metadata: string;
};

export const CreditList: React.FC<{
  credits: Credit[];
  onSelect: (credit: Credit) => void;
}> = ({ credits, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {credits.map((credit) => (
        <CreditCard key={credit.id} credit={credit} onClick={() => onSelect(credit)} />
      ))}
    </div>
  );
}; 