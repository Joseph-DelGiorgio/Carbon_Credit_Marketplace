import { useSuiClient, useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionBlock } from '@mysten/sui/transactions';

// Deployed contract addresses
const PACKAGE_ID = '0x39cd874b2aa262082baaaab414c049b0dcfcef75f7770c20a576f0c976f66a34';
const UPGRADE_CAP_ID = '0x5bc2be0185e8274511f8229bb5d05d3eab8aa3b13e6069e8fb1c8235d4cb8133';

// Module names
const CARBON_CREDIT_MODULE = 'carbon_credit';

// Types based on the smart contract
export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  location: string;
  project_type: string;
  total_credits: number;
  available_credits: number;
  price_per_credit: number;
  developer: string;
  verified: boolean;
  created_at: number;
}

export interface CreditListing {
  id: string;
  project_id: string;
  seller: string;
  amount: number;
  price_per_credit: number;
  created_at: number;
}

export interface MarketplaceStats {
  total_projects: number;
  total_credits_available: number;
  total_volume_traded: number;
  average_price: number;
}

export const useSmartContracts = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();

  // Initialize developer capability
  const initializeDeveloperCap = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Missing transaction sender');
      
      const transactionBlock = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::initialize_developer_cap`,
          arguments: []
        }
      };
      
      return signAndExecute({ transactionBlock });
    }
  });

  // Initialize verifier capability
  const initializeVerifierCap = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Missing transaction sender');
      
      const transactionBlock = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::initialize_verifier_cap`,
          arguments: []
        }
      };
      
      return signAndExecute({ transactionBlock });
    }
  });

  // Create carbon project
  const createProject = useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      location, 
      projectType, 
      totalCredits, 
      pricePerCredit,
      coBenefits,
      sdgGoals,
      fundingGoal,
      metadata
    }: {
      name: string;
      description: string;
      location: string;
      projectType: string;
      totalCredits: number;
      pricePerCredit: number;
      coBenefits: string[];
      sdgGoals: number[];
      fundingGoal: number;
      metadata: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::create_project`,
        arguments: [
          tx.pure(name),
          tx.pure(location),
          tx.pure(projectType),
          tx.pure(description),
          tx.pure(totalCredits),
          tx.pure(pricePerCredit),
          tx.pure(coBenefits),
          tx.pure(sdgGoals),
          tx.pure(fundingGoal),
          tx.pure(metadata)
        ]
      });
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Mint credits for a project
  const mintCredits = useMutation({
    mutationFn: async ({ 
      projectId, 
      co2Kg, 
      metadata 
    }: {
      projectId: string;
      co2Kg: number;
      metadata: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::mint_credits`,
        arguments: [
          tx.object(projectId),
          tx.pure(co2Kg),
          tx.pure(metadata)
        ]
      });
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Create listing for credits
  const createListing = useMutation({
    mutationFn: async ({ 
      creditId, 
      price, 
      quantity 
    }: {
      creditId: string;
      price: number;
      quantity: number;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::create_listing`,
        arguments: [
          tx.object(creditId),
          tx.pure(price),
          tx.pure(quantity)
        ]
      });
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Buy credits
  const buyCredits = useMutation({
    mutationFn: async ({ 
      listingId, 
      payment 
    }: {
      listingId: string;
      payment: number;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::buy_credits`,
        arguments: [
          tx.object(listingId),
          tx.pure(payment)
        ]
      });
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Retire credits
  const retireCredit = useMutation({
    mutationFn: async ({ 
      creditId, 
      reason 
    }: {
      creditId: string;
      reason: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::retire_credit`,
        arguments: [
          tx.object(creditId),
          tx.pure(reason)
        ]
      });
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Fund project
  const fundProject = useMutation({
    mutationFn: async ({ 
      projectId, 
      amount 
    }: {
      projectId: string;
      amount: number;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::fund_project`,
        arguments: [
          tx.object(projectId),
          tx.pure(amount)
        ]
      });
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Query functions
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<CarbonProject[]> => {
      // This would query the blockchain for projects
      // For now, return mock data
      return [
        {
          id: '1',
          name: 'Amazon Rainforest Conservation',
          description: 'Protecting 10,000 hectares of Amazon rainforest from deforestation',
          location: 'Brazil',
          project_type: 'Forest Conservation',
          total_credits: 100000,
          available_credits: 75000,
          price_per_credit: 15.50,
          developer: '0x123...abc',
          verified: true,
          created_at: Date.now() - 86400000
        },
        {
          id: '2',
          name: 'Solar Farm Development',
          description: 'Building a 50MW solar farm in rural India',
          location: 'India',
          project_type: 'Renewable Energy',
          total_credits: 50000,
          available_credits: 30000,
          price_per_credit: 12.75,
          developer: '0x456...def',
          verified: false,
          created_at: Date.now() - 172800000
        }
      ];
    }
  });

  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async (): Promise<CreditListing[]> => {
      // This would query the blockchain for credit listings
      // For now, return mock data
      return [
        {
          id: '1',
          project_id: '1',
          seller: '0x123...abc',
          amount: 1000,
          price_per_credit: 16.00,
          created_at: Date.now() - 3600000
        },
        {
          id: '2',
          project_id: '2',
          seller: '0x456...def',
          amount: 500,
          price_per_credit: 13.00,
          created_at: Date.now() - 7200000
        }
      ];
    }
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async (): Promise<MarketplaceStats> => {
      // This would query the blockchain for marketplace statistics
      // For now, return mock data
      return {
        total_projects: 2,
        total_credits_available: 105000,
        total_volume_traded: 2500000,
        average_price: 14.25
      };
    }
  });

  return {
    // Mutations
    initializeDeveloperCap,
    initializeVerifierCap,
    createProject,
    mintCredits,
    createListing,
    buyCredits,
    retireCredit,
    fundProject,
    
    // Queries
    projects,
    projectsLoading,
    listings,
    listingsLoading,
    stats,
    statsLoading,
    
    // Contract addresses
    PACKAGE_ID,
    UPGRADE_CAP_ID
  };
}; 