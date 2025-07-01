import React from 'react';
import FiltersSidebar from '../components/FiltersSidebar';
import StatsBar from '../components/StatsBar';
import ProjectCard from '../components/ProjectCard';
import { WalletStatus } from '../components/WalletStatus';
import { DeveloperCapButton } from '../components/DeveloperCapButton';
import { CreateProjectForm } from '../components/CreateProjectForm';

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
    description: 'Converting agricultural waste to biochar for soil carbon sequestration.',
  },
  {
    id: '3',
    name: 'Mangrove Restoration',
    location: 'Indonesia',
    type: 'Reforestation',
    coBenefits: ['Coastal Protection', 'Fisheries'],
    price: 15.5,
    creditsAvailable: 800,
    description: 'Restoring mangrove ecosystems for coastal carbon capture.',
  },
];

const MarketplacePage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <FiltersSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Wallet Status and Developer Setup */}
          <div className="mb-6 space-y-4">
            <WalletStatus />
            <DeveloperCapButton />
          </div>
          
          <StatsBar />
          
          {/* Create Project Form */}
          <div className="mb-8">
            <CreateProjectForm />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage; 