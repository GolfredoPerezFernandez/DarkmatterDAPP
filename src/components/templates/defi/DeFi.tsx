import { Box, Grid, GridItem, Text, SimpleGrid } from '@chakra-ui/react';
import { Avatar, Information, PlanCard, Button, Input, Modal, Typography } from '@web3uikit/core';
import React, { useState } from 'react';
import { useMoralis } from 'react-moralis';
import numberWithCommas from 'utils/numberWithComas';

const DeFi = (props: any) => {
  const { Moralis, user, isWeb3Enabled, isAuthenticated } = useMoralis();
  const [open, setOpen] = useState(false);
  const handleBuy = async () => {
    try {
      if (user && isWeb3Enabled && isAuthenticated) {
        console.log(user.get('ethAddress'));
        console.log(Moralis.Units.ETH(parseFloat(values.amount) * 0.005));
        console.log(parseFloat(values.amount));
        const sendOptions1 = {
          contractAddress: '0xd3d74F421713996394e3A8EE1036c8130b8140d3',
          functionName: 'buyTokens',
          msgValue: Moralis.Units.ETH(parseFloat(values.amount) / 10),
          abi: crowdFunding,
          awaitReceipt: true,
          params: {
            beneficiary: user.get('ethAddress'),
          },
        };

        console.log(JSON.stringify('hola'));
        await Moralis.executeFunction(sendOptions1);
        return;
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const [values, setValues] = useState<any>({
    amount: '',
  });

  const handleOpen = (val: boolean) => {
    setOpen(val);
  };
  const handleChanges = (prop: keyof any) => (event: React.ChangeEvent<any>) => {
    if (prop === 'amount') {
      if (parseFloat(event.target.value).toString().length > 12) {
        return;
      }
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <Box
      bgPosition={'center'}
      bgRepeat={'no-repeat'}
      width="full"
      bgImg={'https://theuniverse.mypinata.cloud/ipfs/QmeJk3D3P6abctHSzezLhBYVhX5o9DSySfpJ3W17Pu9buM'}
      bgClip={'border-box'}
    >
      <div
        style={{
          height: '90vh',
          transform: 'scale(1)',
        }}
      >
        <div>
          <Box>
            <Grid
              style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              templateColumns="repeat(1, 3fr)"
              gap="5"
            >
              <GridItem>
                <SimpleGrid
                  minChildWidth="220px"
                  spacing="40px"
                  w={props.width * 0.7}
                  mt={5}
                  paddingTop={20}
                  paddingLeft={props.width < 600 ? 0 : 200}
                  justifyContent={'space-between'}
                  alignItems={'space-between'}
                >
                  <PlanCard
                    description={['ER20 Staking']}
                    descriptionTitle=" Dark matter can be used to purchase 10%, 20% or 30% resource increase and also to halve/finish building upgrades, researching and also ships/defences being built"
                    footer={
                      <Button
                        onClick={() => handleOpen(true)}
                        customize={{ backgroundColor: '#000228', textColor: 'white' }}
                        isFullWidth
                        text="0.1 SGB per DKMT"
                        theme="custom"
                      />
                    }
                    isActive
                    subTitle="ERC20 TOKEN"
                    title={
                      <h1 style={{ color: '#041836', fontSize: '34px' }}>
                        <strong>DARKMATTER </strong>
                        <Box
                          style={{
                            marginTop: 10,
                            marginBottom: 10,
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar
                            image="https://theuniverse.mypinata.cloud/ipfs/Qmdh3Kv5SvK6NHNY6MUXsrKWimUF9bTLTqhRWpWrNJiatR"
                            isRounded
                            size={140}
                            theme="image"
                          />
                        </Box>
                      </h1>
                    }
                    isCurrentPlan={false}
                  />
                  <Box style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text fontSize="4xl" marginBottom={4} textAlign={'center'}>
                      Stake DKMT
                    </Text>
                    <Text fontSize="lg" marginLeft={'4%'} textAlign={'center'}>
                      GENERATE MORE DARK MATTER WITH STAKING
                    </Text>
                    <Input
                      style={{
                        marginTop: 20,
                        marginLeft: props.width < 800 ? '5%' : '22%',
                      }}
                      label="Amount To Stake"
                      name="Test number Input"
                      type="number"
                    />
                    <Box
                      style={{
                        marginLeft: '26%',
                        marginTop: 10,
                        alignSelf: 'center',
                        width: '50%',
                      }}
                    >
                      <Button isFullWidth={true} color="green" text="Stake Dark Matter" theme="colored" />
                    </Box>
                  </Box>
                </SimpleGrid>
              </GridItem>
              <GridItem>
                <SimpleGrid
                  minChildWidth="220px"
                  spacing="40px"
                  w={props.width * 0.7}
                  mt={5}
                  paddingTop={20}
                  paddingLeft={props.width < 600 ? 0 : 200}
                  justifyContent={'space-between'}
                  alignItems={'space-between'}
                >
                  <PlanCard
                    description={['ER20 Staking']}
                    descriptionTitle=" Dark matter can be used to purchase 10%, 20% or 30% resource increase and also to halve/finish building upgrades, researching and also ships/defences being built"
                    footer={
                      <Button
                        onClick={() => handleOpen(true)}
                        customize={{ backgroundColor: '#000228', textColor: 'white' }}
                        isFullWidth
                        text="0.005 SGB per DKMT"
                        theme="custom"
                      />
                    }
                    isActive
                    subTitle="ERC20 TOKEN"
                    title={
                      <h1 style={{ color: '#041836', fontSize: '34px' }}>
                        <strong>DARKMATTER </strong>
                        <Box
                          style={{
                            marginTop: 10,
                            marginBottom: 10,
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar
                            image="https://theuniverse.mypinata.cloud/ipfs/Qmdh3Kv5SvK6NHNY6MUXsrKWimUF9bTLTqhRWpWrNJiatR"
                            isRounded
                            size={140}
                            theme="image"
                          />
                        </Box>
                      </h1>
                    }
                    isCurrentPlan={false}
                  />
                  <Box style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text fontSize="4xl" marginBottom={4} textAlign={'center'}>
                      Stake Your Planets
                    </Text>
                    <Text fontSize="lg" marginLeft={'4%'} textAlign={'center'}>
                      GENERATE MORE DARK MATTER WITH PLANET STAKING
                    </Text>
                    <Input
                      style={{
                        marginTop: 20,
                        marginLeft: props.width < 800 ? '5%' : '22%',
                      }}
                      label="Amount To Stake"
                      name="Test number Input"
                      type="number"
                    />
                    <Box
                      style={{
                        marginLeft: '26%',
                        marginTop: 10,
                        alignSelf: 'center',
                        width: '50%',
                      }}
                    >
                      <Button isFullWidth={true} color="green" text="Stake Dark Matter" theme="colored" />
                    </Box>
                  </Box>
                </SimpleGrid>
              </GridItem>

              <GridItem>
                <SimpleGrid
                  w={props.width * 0.8}
                  height={250}
                  marginTop={40}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  minChildWidth="200px"
                  spacing="20px"
                >
                  <Box height="100px">
                    <Information
                      information={numberWithCommas(props.circulating)?.concat(' DKMT')}
                      topic="Circulating Supply"
                    />
                  </Box>

                  <Box height="100px">
                    <Information information="10.000.000.000 DKMT" topic="Total Supply" />
                  </Box>

                  <Box height="100px">
                    <Information information={'+ '.concat(numberWithCommas(props.holders))} topic="Holders" />
                  </Box>

                  <Box height="100px">
                    <Information information="10000 DKMT" topic="Burned" />
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid>

            {open === true ? (
              <Modal
                cancelText="Discard Changes"
                id="regular"
                okText="Save Changes"
                onCancel={() => setOpen(false)}
                onCloseButtonPressed={() => setOpen(false)}
                onOk={handleBuy}
                title={
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Typography color="#68738D" variant="h3">
                      Edit Nickname
                    </Typography>
                  </div>
                }
              >
                <div
                  style={{
                    padding: '20px 0 20px 0',
                  }}
                >
                  <Input value={values.amount} onChange={handleChanges('amount')} label="Token amount" width="100%" />
                </div>
              </Modal>
            ) : null}
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default DeFi;

const crowdFunding = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pRate',
        type: 'uint256',
      },
      {
        internalType: 'address payable',
        name: 'pWallet',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'pToken',
        type: 'address',
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
        name: 'purchaser',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TokensPurchased',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'buyTokens',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'rate',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
  {
    inputs: [],
    name: 'wallet',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'weiRaised',
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
        internalType: 'bool',
        name: '_withdrawAll',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'weiAmount',
        type: 'uint256',
      },
    ],
    name: 'withdrawRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
