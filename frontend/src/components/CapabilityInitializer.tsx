import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSmartContracts } from '../hooks/useSmartContracts';

const CapabilityInitializer: React.FC = () => {
  const account = useCurrentAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const { useInitializeDeveloperCap, useInitializeVerifierCap } = useSmartContracts();
  const initializeDeveloperCap = useInitializeDeveloperCap();
  const initializeVerifierCap = useInitializeVerifierCap();

  if (!account) {
    return null;
  }

  const handleInitializeDeveloperCap = async () => {
    setIsInitializing(true);
    try {
      await initializeDeveloperCap.mutateAsync();
      alert('Developer capability initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize developer capability:', error);
      alert('Failed to initialize developer capability. You may already have one.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleInitializeVerifierCap = async () => {
    setIsInitializing(true);
    try {
      await initializeVerifierCap.mutateAsync();
      alert('Verifier capability initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize verifier capability:', error);
      alert('Failed to initialize verifier capability. You may already have one.');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Setup Capabilities
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Initialize Capabilities</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isInitializing}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Developer Capability
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Required to create projects and mint carbon credits. Initialize this if you want to be a project developer.
                </p>
                <button
                  onClick={handleInitializeDeveloperCap}
                  disabled={isInitializing}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isInitializing ? 'Initializing...' : 'Initialize Developer Cap'}
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Verifier Capability
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Required to verify carbon credits through dMRV system. Initialize this if you want to be a verifier.
                </p>
                <button
                  onClick={handleInitializeVerifierCap}
                  disabled={isInitializing}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isInitializing ? 'Initializing...' : 'Initialize Verifier Cap'}
                </button>
              </div>

              <div className="text-xs text-gray-600 mt-4">
                <p><strong>Note:</strong> You only need to initialize each capability once per wallet address.</p>
                <p>If you get an error, you may already have the capability initialized.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CapabilityInitializer; 