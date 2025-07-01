import React from 'react';
import { useSmartContracts } from '../hooks/useSmartContracts';
import { useCapabilities } from '../hooks/useCapabilities';

export const DeveloperCapButton: React.FC = () => {
  const { initializeDeveloperCap, loading, error } = useSmartContracts();
  const { capabilities, checkCapabilities } = useCapabilities();

  const handleInitialize = async () => {
    try {
      await initializeDeveloperCap();
      // Refresh capabilities after initialization
      await checkCapabilities();
      console.log('Developer capability initialized successfully!');
    } catch (err) {
      console.error('Failed to initialize developer capability:', err);
    }
  };

  if (capabilities.hasDeveloperCap) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-green-800 font-medium">Project Developer</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          You can create and manage carbon credit projects
        </p>
        {capabilities.developerCapId && (
          <p className="text-green-600 text-xs mt-1">
            Cap ID: {capabilities.developerCapId.slice(0, 8)}...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Project Developer Setup</h3>
      <p className="text-gray-600 mb-4 text-sm">
        Initialize your developer capability to create and manage carbon credit projects.
      </p>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleInitialize}
        disabled={loading}
      >
        {loading ? 'Initializing...' : 'Become Project Developer'}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}; 