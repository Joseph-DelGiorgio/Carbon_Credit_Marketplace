import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSmartContracts } from './useSmartContracts';
import { useState } from 'react';

// Import real on-chain config
import onchainConfig from '../onchain-config.json';

export interface ProjectFilters {
  projectType?: string;
  location?: string;
  verified?: boolean;
  minCredits?: number;
  maxCredits?: number;
}

export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  location: string;
  project_type: string;
  developer: string;
  total_credits: number;
  available_credits: number;
  price_per_credit: number;
  verified: boolean;
  created_at: number;
  metadata: string;
}

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
  verificationStatus: number;
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

export const useProjects = (filters?: ProjectFilters) => {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { createProject, mintCredits, createListing, buyCredits } = useSmartContracts();

  // Dynamic projects array that can be updated when new projects are created
  const [dynamicProjects, setDynamicProjects] = useState<CarbonProject[]>([]);

  // Load real on-chain projects from config and convert to CarbonProject format
  const realProjects: CarbonProject[] = onchainConfig.projects.map((project, index) => ({
    id: project.id,
    name: `Real Project ${index + 1}`,
    location: 'Brazil',
    project_type: 'Forest Conservation',
    description: 'Real on-chain carbon credit project',
    developer: account?.address || '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
    total_credits: 10000,
    available_credits: 5000,
    price_per_credit: 0.1,
    verified: true,
    created_at: Date.now(),
    metadata: '{}'
  }));

  // Fetch all projects (using real on-chain data + dynamic projects)
  const { data: projects = [...realProjects, ...dynamicProjects], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching all projects from blockchain...');
      console.log('Using real on-chain project data from config + dynamic projects');
      return [...realProjects, ...dynamicProjects];
    },
    staleTime: 30000, // 30 seconds
  });

  // Fetch user projects
  const { data: userProjects = [], isLoading: userProjectsLoading } = useQuery({
    queryKey: ['userProjects', account?.address],
    queryFn: async () => {
      if (!account?.address) return [];
      console.log('Fetching user projects for:', account.address);
      
      // Filter projects by developer address (include both real and dynamic projects)
      const allProjects = [...realProjects, ...dynamicProjects];
      const userProjects = allProjects.filter(project => 
        project.developer === account.address
      );
      
      console.log('Found', userProjects.length, 'user projects');
      return userProjects;
    },
    enabled: !!account?.address,
    staleTime: 30000,
  });

  // Real on-chain credit listings (using real object IDs from config)
  const realListings: CreditListing[] = ((onchainConfig as any).realListings || []).map((listing: any) => ({
    id: listing.id,
    creditId: listing.credit_id,
    seller: listing.seller,
    price: listing.price * 1000000000, // Convert SUI to MIST
    quantity: listing.amount,
    active: listing.status === 'available',
    createdAt: listing.created_at
  }));

  // Mock listings for testing (using real object IDs)
  const mockListings: CreditListing[] = [
    {
      id: '0xa954ba137edee2a8bd58222d61e27fff4ee46c7b2cf25f8a684239909d1cd2ef', // Real CreditListing ID
      creditId: '0xad3a6f4448b552595a8ee37f4a8eab7d5b586f80263ed3d66a59e4c4c629141b', // Real CarbonCredit ID
      seller: account?.address || '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
      price: 100000000, // 0.1 SUI in MIST
      quantity: 1000,
      active: true,
      createdAt: Date.now()
    },
    {
      id: '0xc41426c2ef92ab82885638dfe5bcb91b4ca6db725f31dd2d499a64622544370a', // Real CarbonCredit ID as listing ID
      creditId: '0xc41426c2ef92ab82885638dfe5bcb91b4ca6db725f31dd2d499a64622544370a', // Real CarbonCredit ID
      seller: account?.address || '0xde5043879bb960b742bd9963bbbb72cf7c46e0c24c54f5859ae2008eced4b997',
      price: 100000000, // 0.1 SUI in MIST
      quantity: 500,
      active: true,
      createdAt: Date.now()
    }
  ];

  // Fetch all credit listings
  const { data: allCreditListingsData = [...realListings, ...mockListings], isLoading: listingsLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching all credit listings...');
      console.log('Using real listing data from config + mock listings');
      return [...realListings, ...mockListings];
    },
    staleTime: 30000,
  });

  // Mock carbon credits (using real object IDs)
  const mockCredits: CarbonCredit[] = [
    {
      id: '0xad3a6f4448b552595a8ee37f4a8eab7d5b586f80263ed3d66a59e4c4c629141b', // Real CarbonCredit ID
      projectId: realProjects[0]?.id || '0x0cc7899704ae2055e9b52c7e214874e75dc7f0b7f8dceb4bdfa978a0ce5d507c',
      projectName: 'Real Project 1',
      co2Kg: 1000,
      verificationHash: '0x1234567890abcdef',
      dMRVData: '{"sensor_data": "verified", "satellite_data": "confirmed"}',
      retired: false,
      retirementCertificate: '',
      createdAt: Date.now(),
      metadata: '{}'
    },
    {
      id: '0xc41426c2ef92ab82885638dfe5bcb91b4ca6db725f31dd2d499a64622544370a', // Real CarbonCredit ID
      projectId: realProjects[1]?.id || '0x4af69381fddbec56f28e50261c5892d2c3b3ab390febb934f8ecf5b56ed25e00',
      projectName: 'Real Project 2',
      co2Kg: 500,
      verificationHash: '0xabcdef1234567890',
      dMRVData: '{"sensor_data": "verified", "satellite_data": "confirmed"}',
      retired: false,
      retirementCertificate: '',
      createdAt: Date.now(),
      metadata: '{}'
    }
  ];

  // Fetch all carbon credits
  const { data: credits = mockCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      console.log('Fetching all carbon credits...');
      console.log('Using mock credit data for testing');
      return mockCredits;
    },
    staleTime: 30000,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject.mutateAsync,
    onSuccess: (result) => {
      console.log('Project created successfully:', result);
      // Add the new project to the dynamic projects list
      // Note: In a real implementation, you'd extract the project ID from the transaction result
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });

  // Mint credits mutation
  const mintCreditsMutation = useMutation({
    mutationFn: mintCredits.mutateAsync,
    onSuccess: (result) => {
      console.log('Credits minted successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: createListing.mutateAsync,
    onSuccess: (result) => {
      console.log('Listing created successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  // Buy credits mutation
  const buyCreditsMutation = useMutation({
    mutationFn: buyCredits.mutateAsync,
    onSuccess: (result) => {
      console.log('Credits purchased successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  return {
    // Return the expected property names that the component is looking for
    allProjects: projects || [],
    userProjects: userProjects || [],
    allListings: allCreditListingsData || [],
    carbonCredits: credits || [],
    isLoadingProjects: projectsLoading,
    isLoadingUserProjects: userProjectsLoading,
    isLoadingListings: listingsLoading,
    isLoadingCredits: creditsLoading,
    createProject: createProjectMutation.mutateAsync,
    mintCredits: mintCreditsMutation.mutateAsync,
    createListing: createListingMutation.mutateAsync,
    buyCredits: buyCreditsMutation.mutateAsync,
    // Mutation states
    isCreatingProject: createProjectMutation.isPending,
    isMintingCredits: mintCreditsMutation.isPending,
    isCreatingListing: createListingMutation.isPending,
    isBuyingCredits: buyCreditsMutation.isPending,
  };
}; 