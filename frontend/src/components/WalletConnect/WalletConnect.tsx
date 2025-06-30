import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';

const WalletConnect: React.FC = () => {
  const { connect, disconnect, isConnected, address, isLoading } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">
            {formatAddress(address)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>

      {/* Wallet Selection Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Connect Wallet</h3>
            <div className="space-y-2">
              <button
                onClick={handleConnect}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sui Wallet</p>
                  <p className="text-xs text-gray-500">Connect to Sui testnet</p>
                </div>
              </button>
              
              <button
                onClick={handleConnect}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">E</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ethos Wallet</p>
                  <p className="text-xs text-gray-500">Popular Sui wallet</p>
                </div>
              </button>
              
              <button
                onClick={handleConnect}
                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">O</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">OneKey</p>
                  <p className="text-xs text-gray-500">Hardware wallet support</p>
                </div>
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Don't have a wallet? 
                <a 
                  href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 ml-1"
                >
                  Install Sui Wallet
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 