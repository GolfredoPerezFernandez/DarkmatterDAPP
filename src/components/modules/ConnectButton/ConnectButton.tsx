import { signOut, useSession } from 'next-auth/react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { Typography } from '@web3uikit/core';

import { useMoralis } from 'react-moralis';
const ConnectButton = () => {
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const toast = useToast();
  const { data } = useSession();

  const { Moralis, isWeb3Enabled, authenticate, enableWeb3, logout, isWeb3EnableLoading, chainId, user } = useMoralis();

  const handleAuth = async () => {
    if (!isWeb3EnableLoading) {
      if (isConnected) {
        await disconnectAsync();
      }
      try {
        if (isWeb3Enabled) {
          await enableWeb3();
          const CHAIN2 = chainId;

          const chainId2 = 19;
          const chainName = 'Songbird';
          const currencyName = 'SGB';
          const currencySymbol = 'SGB';
          const rpcUrl = 'https://songbird.towolabs.com/rpc';
          const blockExplorerUrl = 'https://explorer-mumbai.maticvigil.com/';

          await Moralis.addNetwork(chainId2, chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl).then(
            async () => {
              if (CHAIN2 === '0x13') {
                await authenticate({
                  signingMessage: 'Be Welcome to DarkMatter.',
                });
              }
            },
          );
        } else {
          await enableWeb3();
        }
      } catch (e) {
        toast({
          title: 'Oops, something is wrong...',
          description: (e as { message: string })?.message,
          status: 'error',
          position: 'top-right',
          isClosable: true,
        });
      }
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
    <Button size="sm" onClick={handleAuth} color="#000228">
      <Typography color={'white'}> Connect Wallet</Typography>
    </Button>
  );
};

export default ConnectButton;
