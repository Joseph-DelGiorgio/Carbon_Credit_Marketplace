import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import suiService from '../services/suiService';
import toast from 'react-hot-toast';

interface UseSmartContractsReturn {
  createProject: (projectData: CreateProjectData) => Promise<string | null>;
  generateCredits: (creditData: GenerateCreditsData) => Promise<string | null>;
  listCredits: (listingData: ListCreditsData) => Promise<string | null>;
  buyCredits: (purchaseData: BuyCreditsData) => Promise<string | null>;
  createAuction: (auctionData: CreateAuctionData) => Promise<string | null>;
  placeBid: (bidData: PlaceBidData) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

interface CreateProjectData {
  name: string;
  description: string;
  projectType: string;
  location: string;
  coordinates: number[];
  methodology: string;
  expectedLifetime: number;
  monitoringFrequency: number;
}

interface GenerateCreditsData {
  projectId: string;
  amount: number;
  vintageYear: number;
  methodology: string;
  verificationData: Uint8Array;
  coBenefits: string[];
  location: string;
  pricePerTon: number;
}

interface ListCreditsData {
  creditId: string;
  pricePerTon: number;
  expiresAt: number;
}

interface BuyCreditsData {
  listingId: string;
  creditId: string;
  amountToBuy: number;
  payment: bigint;
}

interface CreateAuctionData {
  creditId: string;
  startingPrice: number;
  reservePrice: number;
  durationDays: number;
}

interface PlaceBidData {
  auctionId: string;
  bidAmount: bigint;
}

export const useSmartContracts = (): UseSmartContractsReturn => {
  const { isConnected, address, signAndExecuteTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = async (transactionBlock: any, operation: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signAndExecuteTransaction(transactionBlock);
      
      if (result.effects?.status?.status === 'success') {
        toast.success(`${operation} completed successfully!`);
        return result.digest;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      toast.error(`Failed to ${operation.toLowerCase()}: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: CreateProjectData): Promise<string | null> => {
    try {
      const transactionBlock = await suiService.createProject(
        address!,
        projectData.name,
        projectData.description,
        projectData.projectType,
        projectData.location,
        projectData.coordinates,
        projectData.methodology,
        projectData.expectedLifetime,
        projectData.monitoringFrequency
      );

      return await executeTransaction(transactionBlock, 'Create Project');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const generateCredits = async (creditData: GenerateCreditsData): Promise<string | null> => {
    try {
      const transactionBlock = await suiService.generateCredits(
        address!,
        creditData.projectId,
        creditData.amount,
        creditData.vintageYear,
        creditData.methodology,
        creditData.verificationData,
        creditData.coBenefits,
        creditData.location,
        creditData.pricePerTon
      );

      return await executeTransaction(transactionBlock, 'Generate Credits');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate credits';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const listCredits = async (listingData: ListCreditsData): Promise<string | null> => {
    try {
      const transactionBlock = await suiService.listCredits(
        address!,
        listingData.creditId,
        listingData.pricePerTon,
        listingData.expiresAt
      );

      return await executeTransaction(transactionBlock, 'List Credits');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list credits';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const buyCredits = async (purchaseData: BuyCreditsData): Promise<string | null> => {
    try {
      const transactionBlock = await suiService.buyCredits(
        address!,
        purchaseData.listingId,
        purchaseData.creditId,
        purchaseData.amountToBuy,
        purchaseData.payment
      );

      return await executeTransaction(transactionBlock, 'Buy Credits');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy credits';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const createAuction = async (auctionData: CreateAuctionData): Promise<string | null> => {
    try {
      const transactionBlock = await suiService.createAuction(
        address!,
        auctionData.creditId,
        auctionData.startingPrice,
        auctionData.reservePrice,
        auctionData.durationDays
      );

      return await executeTransaction(transactionBlock, 'Create Auction');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create auction';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const placeBid = async (bidData: PlaceBidData): Promise<string | null> => {
    try {
      const transactionBlock = await suiService.placeBid(
        address!,
        bidData.auctionId,
        bidData.bidAmount
      );

      return await executeTransaction(transactionBlock, 'Place Bid');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  return {
    createProject,
    generateCredits,
    listCredits,
    buyCredits,
    createAuction,
    placeBid,
    isLoading,
    error
  };
}; 