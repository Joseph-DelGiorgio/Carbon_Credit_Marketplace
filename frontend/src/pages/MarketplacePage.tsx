import React from 'react';
import FiltersSidebar from '../components/FiltersSidebar';
import StatsBar from '../components/StatsBar';
import ProjectCard from '../components/ProjectCard';

// Mock data for projects
const projects = [
  {
    id: '1',
    name: 'Shamba Agroforestry',
    location: 'Kenya',
    type: 'Afforestation',
    coBenefits: ['Biodiversity', 'Community'],
    price: 8.5,
    creditsAvailable: 1200,
    description: 'Empowering smallholder farmers with dMRV and direct funding.',
  },
  {
    id: '2',
    name: 'Biochar for Soil Health',
    location: 'India',
    type: 'Biochar',
    coBenefits: ['Soil Health', 'Women Empowerment'],
    price: 12.0,
    creditsAvailable: 500,
    description: 'Turning agri-waste into carbon-negative biochar.',
  },
  {
    id: '3',
    name: 'Mangrove Restoration',
    location: 'Indonesia',
    type: 'Reforestation',
    coBenefits: ['Coastal Protection', 'Fisheries'],
    price: 10.0,
    creditsAvailable: 800,
    description: 'Restoring mangroves for carbon and community resilience.',
  },
];

const MarketplacePage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <FiltersSidebar />
      <main className="flex-1 p-8">
        <StatsBar />
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage; 