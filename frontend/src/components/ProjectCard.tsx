import React from 'react';

const ProjectCard = ({ project }: { project: any }) => (
  <div className="bg-white rounded-lg shadow p-4 border border-neutral hover:shadow-lg transition">
    <h3 className="text-lg font-bold text-primary mb-2">{project.name}</h3>
    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-accent font-semibold">{project.credits} credits</span>
      <span className="text-primary font-bold">${project.price}</span>
    </div>
    <button className="mt-4 w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition">Buy Credits</button>
  </div>
);

export default ProjectCard; 