import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Project Details</h1>
        <p className="text-gray-600 mt-2">Project ID: {id}</p>
        <p className="text-gray-500 mt-4">This page is under development...</p>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 