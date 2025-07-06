import React, { useState } from 'react';
import { useSmartContracts } from '../hooks/useSmartContracts';
import type { CarbonProject } from '../hooks/useProjects';

interface MintCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CarbonProject;
}

const MintCreditsModal: React.FC<MintCreditsModalProps> = ({ isOpen, onClose, project }) => {
  const { mintCredits } = useSmartContracts();
  const [co2Kg, setCo2Kg] = useState(100);
  const [metadata, setMetadata] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxCredits = project.total_credits - (project.total_credits - project.available_credits);

  const handleMint = async () => {
    if (co2Kg <= 0 || co2Kg > maxCredits) {
      alert(`Please enter a valid amount between 1 and ${maxCredits.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await mintCredits.mutateAsync({
        projectId: project.id,
        co2Kg: co2Kg,
        metadata: metadata || JSON.stringify({ minted_at: new Date().toISOString() })
      });
      
      alert(`Successfully minted ${co2Kg.toLocaleString()} kg of CO2 credits for ${project.name}!`);
      onClose();
    } catch (error) {
      console.error('Failed to mint credits:', error);
      alert('Failed to mint credits. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mint Carbon Credits</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Project Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Location: {project.location}</div>
                <div>Project Type: {project.project_type.replace('_', ' ')}</div>
                <div>Total Credits: {project.total_credits.toLocaleString()}</div>
                <div>Available to Mint: {maxCredits.toLocaleString()}</div>
              </div>
            </div>

            {/* CO2 Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CO2 Reduction (kg)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={maxCredits}
                  value={co2Kg}
                  onChange={(e) => setCo2Kg(Math.min(parseInt(e.target.value) || 0, maxCredits))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter CO2 reduction in kg"
                />
                <span className="text-sm text-gray-500">/ {maxCredits.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This represents the verified CO2 reduction achieved by your project
              </p>
            </div>

            {/* Metadata Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Metadata (Optional)
              </label>
              <textarea
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Enter verification data, sensor readings, or other metadata..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Include verification data, sensor readings, or other relevant information
              </p>
            </div>

            {/* Summary */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credits to Mint:</span>
                <span className="text-lg font-bold text-green-600">{co2Kg.toLocaleString()} kg CO2</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                These credits will be available for trading once verified
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMint}
                disabled={isSubmitting || co2Kg <= 0 || co2Kg > maxCredits}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Minting...
                  </div>
                ) : (
                  `Mint ${co2Kg.toLocaleString()} Credits`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintCreditsModal; 