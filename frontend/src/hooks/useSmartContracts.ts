import { useSuiClient, useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Types based on the Move contract
export interface Project {
  id: string;
  name: string;
  location: string;
  projectType: string;
  description: string;
  developer: string;
  totalCredits: number;
  creditsIssued: number;
  pricePerCredit: number;
  coBenefits: string[];
  sdgGoals: number[];
  verificationStatus: number; // 0: pending, 1: verified, 2: rejected
  fundingGoal: number;
  fundingRaised: number;
  createdAt: number;
  metadata: string;
}

export interface CarbonCredit {
  id: string;
  projectId: string;
  projectName: string;
  co2Kg: number;
  verificationHash: string;
  dMRVData: string;
  retired: boolean;
  retirementCertificate: string;
  createdAt: number;
  metadata: string;
}

export interface CreditListing {
  id: string;
  creditId: string;
  seller: string;
  price: number;
  quantity: number;
  active: boolean;
  createdAt: number;
}

// Contract configuration
const PACKAGE_ID = '0x...'; // Will be set after deployment
const MODULE_NAME = 'carbon_credit';

export const useSmartContracts = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  const queryClient = useQueryClient();

  // Query: Get all projects
  const useProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        // For now, return mock data until we have proper object parsing
        // In production, you'd use client.getOwnedObjects() or client.getObject()
        return [] as Project[];
      },
      enabled: !!PACKAGE_ID
    });
  };

  // Query: Get all carbon credits
  const useCarbonCredits = () => {
    return useQuery({
      queryKey: ['carbonCredits'],
      queryFn: async () => {
        // For now, return mock data until we have proper object parsing
        return [] as CarbonCredit[];
      },
      enabled: !!PACKAGE_ID
    });
  };

  // Query: Get all listings
  const useListings = () => {
    return useQuery({
      queryKey: ['listings'],
      queryFn: async () => {
        // For now, return mock data until we have proper object parsing
        return [] as CreditListing[];
      },
      enabled: !!PACKAGE_ID
    });
  };

  // Mutation: Initialize developer capability
  const useInitializeDeveloperCap = () => {
    return useMutation({
      mutationFn: async () => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::initialize_developer_cap`,
          arguments: []
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['capabilities'] });
      }
    });
  };

  // Mutation: Initialize verifier capability
  const useInitializeVerifierCap = () => {
    return useMutation({
      mutationFn: async () => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::initialize_verifier_cap`,
          arguments: []
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['capabilities'] });
      }
    });
  };

  // Mutation: Create project
  const useCreateProject = () => {
    return useMutation({
      mutationFn: async (projectData: {
        name: string;
        location: string;
        projectType: string;
        description: string;
        totalCredits: number;
        pricePerCredit: number;
        coBenefits: string[];
        sdgGoals: number[];
        fundingGoal: number;
        metadata: string;
      }) => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::create_project`,
          arguments: [
            tx.object('0x...'), // Developer cap object ID
            tx.pure.string(projectData.name),
            tx.pure.string(projectData.location),
            tx.pure.string(projectData.projectType),
            tx.pure.string(projectData.description),
            tx.pure.u64(projectData.totalCredits),
            tx.pure.u64(projectData.pricePerCredit),
            tx.pure.vector('string', projectData.coBenefits),
            tx.pure.vector('u8', projectData.sdgGoals),
            tx.pure.u64(projectData.fundingGoal),
            tx.pure.string(projectData.metadata)
          ]
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    });
  };

  // Mutation: Mint credits
  const useMintCredits = () => {
    return useMutation({
      mutationFn: async (mintData: {
        projectId: string;
        co2Kg: number;
        metadata: string;
      }) => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::mint_credits`,
          arguments: [
            tx.object('0x...'), // Developer cap object ID
            tx.object(mintData.projectId), // Project object
            tx.pure.u64(mintData.co2Kg),
            tx.pure.string(mintData.metadata)
          ]
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    });
  };

  // Mutation: Create listing
  const useCreateListing = () => {
    return useMutation({
      mutationFn: async (listingData: {
        creditId: string;
        price: number;
      }) => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::create_listing`,
          arguments: [
            tx.object(listingData.creditId), // Carbon credit object
            tx.pure.u64(listingData.price)
          ]
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listings'] });
        queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });
      }
    });
  };

  // Mutation: Buy credits
  const useBuyCredits = () => {
    return useMutation({
      mutationFn: async (buyData: {
        listingId: string;
        paymentAmount: number;
      }) => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(buyData.paymentAmount)]);
        
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::buy_credits`,
          arguments: [
            tx.object(buyData.listingId), // Listing object
            coin
          ]
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listings'] });
        queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });
      }
    });
  };

  // Mutation: Fund project
  const useFundProject = () => {
    return useMutation({
      mutationFn: async (fundData: {
        projectId: string;
        fundingAmount: number;
      }) => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(fundData.fundingAmount)]);
        
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::fund_project`,
          arguments: [
            tx.object(fundData.projectId), // Project object
            coin
          ]
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    });
  };

  // Mutation: Retire credit
  const useRetireCredit = () => {
    return useMutation({
      mutationFn: async (retireData: {
        creditId: string;
        retirementReason: string;
      }) => {
        if (!account?.address) throw new Error('Wallet not connected');
        
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::retire_credit`,
          arguments: [
            tx.object(retireData.creditId), // Carbon credit object
            tx.pure.string(retireData.retirementReason)
          ]
        });

        const result = await signAndExecute({
          transactionBlock: tx,
        });

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });
      }
    });
  };

  return {
    // Queries
    useProjects,
    useCarbonCredits,
    useListings,
    
    // Mutations
    useInitializeDeveloperCap,
    useInitializeVerifierCap,
    useCreateProject,
    useMintCredits,
    useCreateListing,
    useBuyCredits,
    useFundProject,
    useRetireCredit,
    
    // Helper functions
    isConnected: !!account?.address,
    address: account?.address
  };
}; 