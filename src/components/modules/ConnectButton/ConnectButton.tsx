import { InjectedConnector } from 'wagmi/connectors/injected';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import apiPost from 'utils/apiPost';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { Typography } from '@web3uikit/core';

import { useMoralis } from 'react-moralis';
const ConnectButton = () => {
  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();
  const { data } = useSession();

  const { Moralis, isWeb3Enabled, authenticate, logout, user } = useMoralis();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      if (isWeb3Enabled) {
        const chainId2 = 19;
        const chainName = 'Songbird';
        const currencyName = 'SGB';
        const currencySymbol = 'SGB';
        const rpcUrl = 'https://songbird.towolabs.com/rpc';
        const blockExplorerUrl = 'https://explorer-mumbai.maticvigil.com/';

        await Moralis.addNetwork(chainId2, chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl);

        const CHAIN2 = await Moralis.chainId;

        if (CHAIN2 !== '0x13') {
          await Moralis.switchNetwork('0x13');
        }

        if (CHAIN2 === '0x13') {
          await authenticate({
            signingMessage: 'Be Welcome to DarkMatter.',
          });
        } else {
          console.log();
          const { account, chain } = await connectAsync();

          const userData = { address: account, chain: chain.id, network: 'evm' };

          const { message } = await apiPost('/auth/request-message', userData);

          const signature = await signMessageAsync({ message });

          await signIn('credentials', { message, signature, callbackUrl: '/' });
        }
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
      <Typography color={'#000228'}> Connect Wallet</Typography>
    </Button>
  );
};

export default ConnectButton;
