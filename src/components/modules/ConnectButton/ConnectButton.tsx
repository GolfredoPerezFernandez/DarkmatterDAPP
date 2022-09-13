import { signOut, useSession } from 'next-auth/react';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { Typography } from '@web3uikit/core';

import { useMoralis } from 'react-moralis';
import { useState } from 'react';
const ConnectButton = () => {
  const toast = useToast();
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const { Moralis, isWeb3Enabled, authenticate, enableWeb3, logout, chainId, user } = useMoralis();

  const handleAuth = async () => {
    setLoading(true);
    console.log('entro');
    try {
      await enableWeb3();
      console.log('entro');
      const CHAIN2 = Moralis.getChainId();

      const chainId2 = 19;
      const chainName = 'Songbird';
      const currencyName = 'SGB';
      const currencySymbol = 'SGB';
      const rpcUrl = 'https://songbird.towolabs.com/rpc';
      const blockExplorerUrl = 'https://explorer-mumbai.maticvigil.com/';
      console.log('entro' + CHAIN2);
      if (CHAIN2 === '0x13') {
        console.log('entro');
        await authenticate({
          signingMessage: 'Be Welcome to DarkMatter.',
        });
      } else {
        console.log('entro');
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
    <Button size="sm" disabled={loading} onClick={handleAuth} color="#000228">
      <Typography color={'white'}> Connect Wallet</Typography>
    </Button>
  );
};

export default ConnectButton;
