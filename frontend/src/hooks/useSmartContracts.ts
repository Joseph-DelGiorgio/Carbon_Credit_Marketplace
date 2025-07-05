import { useSuiClient, useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Deployed contract addresses
const PACKAGE_ID = '0x39cd874b2aa262082baaaab414c049b0dcfcef75f7770c20a576f0c976f66a34';
const UPGRADE_CAP_ID = '0x5bc2be0185e8274511f8229bb5d05d3eab8aa3b13e6069e8fb1c8235d4cb8133';

// Module names
const CARBON_CREDIT_MODULE = 'carbon_credit';

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
  verification_status: string;
  created_at: number;
}

export interface CarbonCredit {
  id: string;
  project_id: string;
  amount: number;
  price: number;
  seller: string;
  buyer?: string;
  status: 'available' | 'sold' | 'retired';
  created_at: number;
}

export function useSmartContracts() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  const queryClient = useQueryClient();

  // Initialize marketplace
  const initializeMarketplace = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::initialize_marketplace`,
          arguments: [UPGRADE_CAP_ID]
        }
      };
      
      return signAndExecute({ transactionBlock: tx });
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
      pricePerCredit
    }: {
      name: string;
      description: string;
      location: string;
      projectType: string;
      totalCredits: number;
      pricePerCredit: number;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::create_project`,
          arguments: [name, description, location, projectType, totalCredits, pricePerCredit]
        }
      };
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // List carbon credits for sale
  const listCredits = useMutation({
    mutationFn: async ({ 
      projectId, 
      amount, 
      price
    }: {
      projectId: string;
      amount: number;
      price: number;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::list_credits`,
          arguments: [projectId, amount, price]
        }
      };
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Buy carbon credits
  const buyCredits = useMutation({
    mutationFn: async ({ 
      listingId, 
      amount
    }: {
      listingId: string;
      amount: number;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::buy_credits`,
          arguments: [listingId, amount]
        }
      };
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Retire carbon credits
  const retireCredits = useMutation({
    mutationFn: async ({ 
      creditId, 
      reason
    }: {
      creditId: string;
      reason: string;
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::retire_credits`,
          arguments: [creditId, reason]
        }
      };
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Verify project
  const verifyProject = useMutation({
    mutationFn: async ({ 
      projectId, 
      verificationData
    }: {
      projectId: string;
      verificationData: {
        sensor_data: string;
        satellite_data: string;
        community_reports: string;
        verification_score: number;
      };
    }) => {
      if (!account?.address) throw new Error('Wallet not connected');
      
      const tx = {
        kind: 'moveCall' as const,
        data: {
          target: `${PACKAGE_ID}::${CARBON_CREDIT_MODULE}::verify_project`,
          arguments: [
            projectId,
            verificationData.sensor_data,
            verificationData.satellite_data,
            verificationData.community_reports,
            verificationData.verification_score
          ]
        }
      };
      
      return signAndExecute({ transactionBlock: tx });
    }
  });

  // Get all projects
  const getProjects = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // This would need to be implemented based on how you want to query the blockchain
      // For now, returning mock data
      return [] as CarbonProject[];
    }
  });

  // Get all credit listings
  const getCreditListings = useQuery({
    queryKey: ['credit-listings'],
    queryFn: async () => {
      // This would need to be implemented based on how you want to query the blockchain
      // For now, returning mock data
      return [] as CarbonCredit[];
    }
  });

  return {
    initializeMarketplace,
    createProject,
    listCredits,
    buyCredits,
    retireCredits,
    verifyProject,
    getProjects,
    getCreditListings,
    packageId: PACKAGE_ID,
    upgradeCapId: UPGRADE_CAP_ID,
    isConnected: !!account?.address,
    address: account?.address
  };
} 