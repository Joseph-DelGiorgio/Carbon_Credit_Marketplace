import React, { useState } from 'react';
import { useSmartContracts } from '../hooks/useSmartContracts';
import type { CarbonProject } from '../hooks/useSmartContracts';

interface MockCredit {
  id: string;
  project_id: string;
  amount: number;
  price: number;
  seller: string;
  status: 'available' | 'sold' | 'retired';
  created_at: number;
}

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credit: MockCredit;
  project: CarbonProject;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, credit, project }) => {
  const { buyCredits } = useSmartContracts();
  const [amount, setAmount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('BuyCreditsModal render:', { isOpen, credit, project });

  // Add a useEffect to log when modal opens/closes
  React.useEffect(() => {
    console.log('BuyCreditsModal useEffect - isOpen changed:', isOpen);
  }, [isOpen]);

  const totalPrice = amount * credit.price;
  const maxAmount = credit.amount;

  const handleBuy = async () => {
    if (amount <= 0 || amount > maxAmount) {
      setError('Please enter a valid amount');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Starting purchase:', { listingId: credit.id, amount });
      
      const result = await buyCredits.mutateAsync({
        listingId: credit.id,
        amount: amount
      });
      
      console.log('Purchase successful:', result);
      
      // Show success message
      const successMessage = `Successfully purchased ${amount} credits for ${totalPrice.toFixed(2)} SUI!\n\nTransaction ID: ${result.digest}`;
      alert(successMessage);
      
      // Close modal
      onClose();
      
      // Reset form
      setAmount(1);
      setError(null);
      
    } catch (error: any) {
      console.error('Failed to buy credits:', error);
      setError(error.message || 'Failed to purchase credits. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount(1);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Buy Carbon Credits</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                <div>Price per Credit: <span className="font-medium text-green-600">{credit.price} SUI</span></div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Credits
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => setAmount(Math.min(parseInt(e.target.value) || 0, maxAmount))}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-500">/ {maxAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Price:</span>
                <span className="text-lg font-bold text-green-600">{totalPrice.toFixed(2)} SUI</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {amount} credits × {credit.price} SUI per credit
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={isSubmitting || amount <= 0 || amount > maxAmount}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Buy ${amount} Credits`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal; 