import React from 'react';

type Project = {
  id: string;
  name: string;
  location: string;
  type: string;
  coBenefits: string[];
  price: number;
  creditsAvailable: number;
  description: string;
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-500 text-sm mb-1">{project.location} • {project.type}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {project.coBenefits.map((cb) => (
            <span key={cb} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{cb}</span>
          ))}
        </div>
        <p className="text-gray-700 mb-2">{project.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-lg">${project.price.toFixed(2)}/t</span>
        <span className="text-sm text-gray-600">{project.creditsAvailable} credits</span>
      </div>
    </div>
  );
};

export default ProjectCard; 