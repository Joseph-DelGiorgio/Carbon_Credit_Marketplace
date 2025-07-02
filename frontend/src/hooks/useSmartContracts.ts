import { useCallback, useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Contract addresses (will be updated after deployment)
const PACKAGE_ID = '0x...'; // Replace with actual package ID after deployment
const MODULE_NAME = 'carbon_credit';

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

export const useSmartContracts = () => {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use SuiClient from @mysten/sui/client
  const provider = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

  // Initialize developer capability
  const initializeDeveloperCap = useCallback(async () => {
    if (!currentAccount) throw new Error('Wallet not connected');

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::initialize_developer_cap`,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize developer capability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentAccount, signAndExecuteTransaction]);

  // Create a new project
  const createProject = useCallback(async (projectData: {
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
    if (!currentAccount) throw new Error('Wallet not connected');

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      // Add capability object (assuming user has it)
      const cap = tx.object('0x...'); // Replace with actual capability object ID
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_project`,
        arguments: [
          cap,
          tx.pure.string(projectData.name),
          tx.pure.string(projectData.location),
          tx.pure.string(projectData.projectType),
          tx.pure.string(projectData.description),
          tx.pure.u64(projectData.totalCredits),
          tx.pure.u64(projectData.pricePerCredit),
          tx.pure.vector('string', projectData.coBenefits),
          tx.pure.vector('u8', projectData.sdgGoals),
          tx.pure.u64(projectData.fundingGoal),
          tx.pure.string(projectData.metadata),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentAccount, signAndExecuteTransaction]);

  // Mint carbon credits
  const mintCredits = useCallback(async (
    projectId: string,
    co2Kg: number,
    metadata: string
  ) => {
    if (!currentAccount) throw new Error('Wallet not connected');

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      const cap = tx.object('0x...'); // Replace with actual capability object ID
      const project = tx.object(projectId);
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::mint_credits`,
        arguments: [
          cap,
          project,
          tx.pure.u64(co2Kg),
          tx.pure.string(metadata),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint credits');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentAccount, signAndExecuteTransaction]);

  // Buy credits from listing
  const buyCredits = useCallback(async (
    listingId: string,
    paymentAmount: number
  ) => {
    if (!currentAccount) throw new Error('Wallet not connected');

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      const listing = tx.object(listingId);
      const payment = tx.splitCoins(tx.gas, [paymentAmount]);
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::buy_credits`,
        arguments: [listing, payment],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to buy credits');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentAccount, signAndExecuteTransaction]);

  // Retire credits
  const retireCredits = useCallback(async (
    creditId: string,
    retirementReason: string
  ) => {
    if (!currentAccount) throw new Error('Wallet not connected');

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      const credit = tx.object(creditId);
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::retire_credit`,
        arguments: [
          credit,
          tx.pure.string(retirementReason),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retire credits');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentAccount, signAndExecuteTransaction]);

  // Query projects
  const getProjects = useCallback(async (): Promise<Project[]> => {
    try {
      const objects = await provider.getOwnedObjects({
        owner: currentAccount?.address || '',
        filter: {
          Package: PACKAGE_ID,
        },
      });

      const projects: Project[] = [];
      
      for (const obj of objects.data) {
        if (obj.data?.type?.includes('Project')) {
          const projectData = await provider.getObject({
            id: obj.data.objectId,
            options: { showContent: true },
          });
          
          if (projectData.data?.content) {
            const content = projectData.data.content as any;
            projects.push({
              id: obj.data.objectId,
              name: content.fields.name,
              location: content.fields.location,
              projectType: content.fields.project_type,
              description: content.fields.description,
              developer: content.fields.developer,
              totalCredits: Number(content.fields.total_credits),
              creditsIssued: Number(content.fields.credits_issued),
              pricePerCredit: Number(content.fields.price_per_credit),
              coBenefits: content.fields.co_benefits,
              sdgGoals: content.fields.sdg_goals,
              verificationStatus: Number(content.fields.verification_status),
              fundingGoal: Number(content.fields.funding_goal),
              fundingRaised: Number(content.fields.funding_raised),
              createdAt: Number(content.fields.created_at),
              metadata: content.fields.metadata,
            });
          }
        }
      }

      return projects;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      return [];
    }
  }, [currentAccount, provider]);

  // Query carbon credits
  const getCarbonCredits = useCallback(async (): Promise<CarbonCredit[]> => {
    try {
      const objects = await provider.getOwnedObjects({
        owner: currentAccount?.address || '',
        filter: {
          Package: PACKAGE_ID,
        },
      });

      const credits: CarbonCredit[] = [];
      
      for (const obj of objects.data) {
        if (obj.data?.type?.includes('CarbonCredit')) {
          const creditData = await provider.getObject({
            id: obj.data.objectId,
            options: { showContent: true },
          });
          
          if (creditData.data?.content) {
            const content = creditData.data.content as any;
            credits.push({
              id: obj.data.objectId,
              projectId: content.fields.project_id,
              projectName: content.fields.project_name,
              co2Kg: Number(content.fields.co2_kg),
              verificationHash: content.fields.verification_hash,
              dMRVData: content.fields.dMRV_data,
              retired: content.fields.retired,
              retirementCertificate: content.fields.retirement_certificate,
              createdAt: Number(content.fields.created_at),
              metadata: content.fields.metadata,
            });
          }
        }
      }

      return credits;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch carbon credits');
      return [];
    }
  }, [currentAccount, provider]);

  return {
    loading,
    error,
    initializeDeveloperCap,
    createProject,
    mintCredits,
    buyCredits,
    retireCredits,
    getProjects,
    getCarbonCredits,
  };
}; 