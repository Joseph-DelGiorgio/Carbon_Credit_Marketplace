import { useCallback, useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

export interface Capabilities {
  hasDeveloperCap: boolean;
  hasVerifierCap: boolean;
  developerCapId?: string;
  verifierCapId?: string;
}

export const useCapabilities = () => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [capabilities, setCapabilities] = useState<Capabilities>({
    hasDeveloperCap: false,
    hasVerifierCap: false,
  });
  const [loading, setLoading] = useState(false);

  const checkCapabilities = useCallback(async () => {
    if (!currentAccount?.address) {
      setCapabilities({ hasDeveloperCap: false, hasVerifierCap: false });
      return;
    }

    setLoading(true);
    try {
      // Query owned objects to find capability objects
      const objects = await client.getOwnedObjects({
        owner: currentAccount.address,
        options: {
          showType: true,
          showContent: true,
        },
      });

      let hasDeveloperCap = false;
      let hasVerifierCap = false;
      let developerCapId: string | undefined;
      let verifierCapId: string | undefined;

      for (const obj of objects.data) {
        if (obj.data?.type?.includes('ProjectDeveloperCap')) {
          hasDeveloperCap = true;
          developerCapId = obj.data.objectId;
        } else if (obj.data?.type?.includes('VerifierCap')) {
          hasVerifierCap = true;
          verifierCapId = obj.data.objectId;
        }
      }

      setCapabilities({
        hasDeveloperCap,
        hasVerifierCap,
        developerCapId,
        verifierCapId,
      });
    } catch (error) {
      console.error('Error checking capabilities:', error);
      setCapabilities({ hasDeveloperCap: false, hasVerifierCap: false });
    } finally {
      setLoading(false);
    }
  }, [currentAccount?.address, client]);

  // Check capabilities when account changes
  useEffect(() => {
    checkCapabilities();
  }, [checkCapabilities]);

  return {
    capabilities,
    loading,
    checkCapabilities,
  };
}; 