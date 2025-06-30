import React, { useState } from 'react';
import { FiltersSidebar } from './FiltersSidebar';
import { CreditList, Credit } from './CreditList';
import { CreditDetailModal } from './CreditDetailModal';

// Temporary mock data
const mockCredits: Credit[] = [
  {
    id: '1',
    projectName: 'Rainforest Restoration',
    location: 'Amazon, Brazil',
    co2_kg: 1000,
    price: 12.5,
    verified: true,
    retired: false,
    metadata: 'Protecting biodiversity and local communities.'
  },
  {
    id: '2',
    projectName: 'Mangrove Planting',
    location: 'Sumatra, Indonesia',
    co2_kg: 500,
    price: 8.0,
    verified: false,
    retired: false,
    metadata: 'Restoring coastal ecosystems.'
  }
];

export const Marketplace: React.FC = () => {
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FiltersSidebar />
      <main className="flex-1 p-8">
        <CreditList credits={mockCredits} onSelect={setSelectedCredit} />
      </main>
      <CreditDetailModal credit={selectedCredit} onClose={() => setSelectedCredit(null)} />
    </div>
  );
}; 