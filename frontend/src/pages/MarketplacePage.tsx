import React from 'react';
import FiltersSidebar from '../components/FiltersSidebar';
import StatsBar from '../components/StatsBar';
import ProjectCard from '../components/ProjectCard';

const mockProjects = [
  { id: 1, name: 'Rainforest Restoration', description: 'Reforesting 100 acres in Brazil', credits: 1000, price: 12.5 },
  { id: 2, name: 'Mangrove Revival', description: 'Mangrove planting in Indonesia', credits: 500, price: 15.0 },
];

const MarketplacePage = () => (
  <div className="flex gap-6 p-6">
    <FiltersSidebar />
    <div className="flex-1">
      <StatsBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  </div>
);

export default MarketplacePage; 