import { Box, Container, Flex, HStack, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { MoralisLogo, SubNav } from 'components/elements';
import { ConnectButton } from '../ConnectButton';
import { Menu as Menu2 } from '@web3uikit/icons';
import { Typography } from '@web3uikit/core';

import { Link, Popover, PopoverContent, PopoverTrigger, Stack, useColorModeValue, Text, Image } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar } from '@web3uikit/core';

import NAV_LINKS from './paths';
import { useMoralis } from 'react-moralis';
const Header = (props: any) => {
  const { user, isWeb3Enabled, Moralis, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();
  const [balance, setBalance] = useState('');
  useEffect(() => {
    async function init() {
      const CHAIN2 = await Moralis.chainId;
      if (CHAIN2 !== '0x13') {
        await Moralis.switchNetwork('0x13');
      }
      if (CHAIN2 === '0x13') {
        const sendOptionsSymbol3 = {
          contractAddress: '0x433eb2d4ccAe3eC8Bb7AFB58aCcA92BBF6d479b6',
          functionName: 'balanceOf',
          abi: collection,
          params: {
            account: user?.get('ethAddress'),
          },
        };
        const ownerOf = await Moralis.executeFunction(sendOptionsSymbol3);

        setBalance(Math.round(parseFloat(Moralis.Units.FromWei(ownerOf.toString()))).toString());
      }
    }
    if (isAuthenticated) {
      init();
    }
  }, [user, isWeb3Enabled, isAuthenticated]);
  return (
    <Box borderBottom="1px" backgroundColor={'#000228'} borderBottomColor="chakra-border-color">
      <Container backgroundColor={'#000228'} maxW="container.xl">
        <Flex align="center" marginLeft={0} justify="space-between">
          <MoralisLogo />
          <HStack>
            {!user ? null : (
              <Text fontSize="1xl" marginLeft={20} textAlign={'right'}>
                {balance === '' ? '' : balance.concat(' DKMT')}
              </Text>
            )}

            <Box width="40px" />
            {props.width > 900 ? (
              <ConnectButton />
            ) : (
              <Box marginRight={'100px'}>
                <Menu variant={''}>
                  <MenuButton>
                    <Menu2 fontSize="20px" />
                  </MenuButton>
                  <MenuList backgroundColor={'#000228'}>
                    <MenuGroup>
                      <MenuItem style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ConnectButton />
                      </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                      <Box backgroundColor={'#000228'}>
                        {NAV_LINKS.map((link) => (
                          <MenuItem backgroundColor={'#000228'}>
                            <NavItem2 key={`link-${link.label}`} {...link} />
                          </MenuItem>
                        ))}
                      </Box>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              </Box>
            )}

            <Image
              src={'https://cdn.discordapp.com/attachments/907590324627595284/1001294615099486208/mint-live.png'}
              marginLeft={50}
              height={'40px'}
              width={50}
              alt="Ultimate"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;

const NavItem2: FC<any> = ({ label, children, href }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.400');
  const linkActiveColor = useColorModeValue('gray.800', 'white');
  const router = useRouter();
  const isCurrentPath = router.asPath === href || (href !== '/' && router.pathname.startsWith(href || ''));
  function component() {
    switch (label) {
      case 'DeFi':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmWxDVy8DypsqV1uQoHCwFLxY4NAg6GZK7Zf1YJb2ghPQH?preview=1"
            />
          </Box>
        );
      case 'HOME':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmT9izvsQquvKDRXrF1NkcfLXYJ8LCL1zX9RrdoYcYTnbN"
            />
          </Box>
        );
      case 'GAME':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmT6FXj5osPZok97UXtRH45ttq9bvcp45poEFUc7cXcpa9"
            />
          </Box>
        );
      case 'MARKET':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/Qme3CdTqf5nwLbKQC5mjqg55JuzHhJbL8b8AbC6LsWFgeD"
            />
          </Box>
        );
      case 'BLOG':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmQ4QQQ1wR924QZzoqr2gmmZCyRDJa3Ca2y88yZAA6G3Bg"
            />
          </Box>
        );
      case 'FORUM':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmQJZ2KiDbhkAcAYCx6cJHThTU6ndUBaeCsN7sF39u1jor"
            />
          </Box>
        );

      case 'DAO':
        return (
          <Box style={{ marginLeft: 2 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmdHRmTnEmJmYpWc8yx5W4GrZi8GDCynJsNT3P7KCTBT5t"
            />
          </Box>
        );

      default:
        return null;
    }
  }
  return (
    <Popover trigger={'hover'} placement={'bottom-start'}>
      <PopoverTrigger>
        <Box>
          <Box
            fontSize={15}
            fontWeight={500}
            color={isCurrentPath ? linkActiveColor : linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkActiveColor,
            }}
            cursor="pointer"
          >
            {children ? (
              <>
                {label} <ChevronDownIcon />
              </>
            ) : (
              <NextLink href={href || '/'}>
                <Link
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  <HStack>
                    {component()}
                    <Typography variant="H2"> {label}</Typography>
                  </HStack>
                </Link>
              </NextLink>
            )}
          </Box>
        </Box>
      </PopoverTrigger>

      {children && (
        <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
          <Stack>
            {children.map((child: any) => (
              <SubNav key={child.label} {...child} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

const collection = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newCap',
        type: 'uint256',
      },
    ],
    name: 'MaxTotalSupplyUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cap',
        type: 'uint256',
      },
    ],
    name: 'MinterUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_TOTAL_SUPPLY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_initial',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'minters',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'minters_minted',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newCap',
        type: 'uint256',
      },
    ],
    name: 'resetMaxTotalSupply',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_minterCap',
        type: 'uint256',
      },
    ],
    name: 'setMinter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
