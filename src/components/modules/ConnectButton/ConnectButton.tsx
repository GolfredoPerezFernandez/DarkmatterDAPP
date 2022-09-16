import { signOut, useSession } from 'next-auth/react';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { Typography } from '@web3uikit/core';

import { useMoralis } from 'react-moralis';
import { useEffect, useState } from 'react';
const ConnectButton = () => {
  const toast = useToast();
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const { Moralis, authenticate, enableWeb3, isWeb3EnableLoading, isWeb3Enabled, logout, user } = useMoralis();

  useEffect(() => {
    async function init() {
      await enableWeb3();
    }
    if (!isWeb3Enabled) {
      setLoading(true);
      init();
    } else {
      setLoading(false);
    }
  }, [isWeb3Enabled]);
  const handleAuth = async () => {
    setLoading(true);
    console.log('entro');
    try {
      console.log('entro');
      await enableWeb3();
      const chainId = Moralis.getChainId();

      const chainId2 = 19;
      const chainName = 'Songbird';
      const currencyName = 'SGB';
      const currencySymbol = 'SGB';
      const rpcUrl = 'https://songbird.towolabs.com/rpc';
      const blockExplorerUrl = 'https://explorer-mumbai.maticvigil.com/';

      if (chainId === '0x89' || chainId === '0x13') {
        await authenticate({
          signingMessage: 'Be Welcome to DarkMatter DAO.',
        });
      } else {
        await Moralis.addNetwork(chainId2, chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);

      toast({
        title: 'Oops, something is wrong...',
        description: (e as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleDisconnect = async () => {
    await logout();
    signOut({ callbackUrl: '/' });
  };

  if (user) {
    return (
      <HStack onClick={handleDisconnect} cursor={'pointer'}>
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(user.get('ethAddress'))}</Text>
      </HStack>
    );
  }

  if (data?.user) {
    return (
      <HStack onClick={handleDisconnect} cursor={'pointer'}>
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(data.user.address)}</Text>
      </HStack>
    );
  }

  return (
    <Button size="sm" disabled={loading && isWeb3EnableLoading} onClick={handleAuth} color="#000228">
      <Typography color={'white'}> Connect Wallet</Typography>
    </Button>
  );
};

export default ConnectButton;
