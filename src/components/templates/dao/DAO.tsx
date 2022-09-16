//no-mixed-spaces-and-tabs

import React, { useEffect, useState } from 'react';
import { Widget, Tag, Table, Form, Button, Avatar, PlanCard, TagProps } from '@web3uikit/core';
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from 'react-moralis';
import { Box, HStack, Text } from '@chakra-ui/react';
const DAO = (props: any) => {
  const [passRate, setPassRate] = useState<any>(0);
  const [totalP, setTotalP] = useState<any>(0);
  const [counted, setCounted] = useState<any>(0);
  const [voters, setVoters] = useState<any>(0);
  const { Moralis, isInitialized, user } = useMoralis();
  const [proposals, setProposals] = useState<any>();
  const Web3Api = useMoralisWeb3Api();
  const [sub, setSub] = useState<any>();
  const contractProcessor = useWeb3ExecuteFunction();

  async function createProposal(newProposal: any) {
    const options = {
      contractAddress: '0x403fCf1049f7F9AAF22Af5f1775E9735F3A3a4bC',
      functionName: 'createProposal',
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_description',
              type: 'string',
            },
            {
              internalType: 'address[]',
              name: '_canVote',
              type: 'address[]',
            },
          ],
          name: 'createProposal',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      params: {
        _description: newProposal,
        _canVote: voters,
      },
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log('Proposal Succesful');
        setSub(false);
      },
      onError: () => {
        setSub(false);
      },
    });
  }

  async function getStatus(proposalId: any): Promise<TagProps> {
    const ProposalCounts = Moralis.Object.extend('ProposalCounts');
    const query = new Moralis.Query(ProposalCounts);
    query.equalTo('uid', proposalId);
    const result = await query.first();
    if (result !== undefined) {
      if (result.attributes.passed) {
        return { color: 'green', text: 'Passed' };
      }

      return { color: 'red', text: 'Rejected' };
    }
    return { color: 'blue', text: 'Ongoing' };
  }
  async function getPassRate() {
    const ProposalCounts = Moralis.Object.extend('ProposalCounts');
    const query = new Moralis.Query(ProposalCounts);
    const results = await query.find();
    let votesUp = 0;

    results.forEach((e) => {
      if (e.attributes.passed) {
        votesUp++;
      }
    });

    setCounted(results.length);
    setPassRate((votesUp / results.length) * 100);
  }

  const fetchTokenIdOwners = async () => {
    const options: any = {
      address: '0x4c8B2ce3Ae6eFBF74511df50658e7D7b316942A4',
      token_id: '1',
      chain: 'polygon',
    };
    const tokenIdOwners: any = await Web3Api.token.getTokenIdOwners(options);
    console.log(tokenIdOwners);
    const addresses = tokenIdOwners.result.map((e: any) => e.owner_of);
    setVoters(addresses);
  };

  useEffect(() => {
    async function getProposals() {
      const Proposals = Moralis.Object.extend('Proposals');
      const query = new Moralis.Query(Proposals);
      query.descending('uid_decimal');
      const results = await query.find();
      const table = await Promise.all(
        results.map(async (e) => [
          e.attributes.uid,
          e.attributes.description,
          <Tag color={(await getStatus(e.attributes.uid)).color} text={(await getStatus(e.attributes.uid)).text} />,
        ]),
      );
      setProposals(table);
      setTotalP(results.length);
    }
    if (isInitialized) {
      fetchTokenIdOwners();
      getProposals();
      getPassRate();
    }
  }, [isInitialized]);

  const mintNow = async () => {
    const chainId = Moralis.getChainId();
    if (user) {
      const provider = await Moralis.enableWeb3({ provider: 'metamask' });
      const ethers = Moralis.web3Library;

      const signer = provider.getSigner();
      const mintAddress =
        chainId === '0x89'
          ? '0x4c8B2ce3Ae6eFBF74511df50658e7D7b316942A4'
          : chainId === '0x13'
          ? '0x825D72E626864e236baE9bBc6F1B4528a42508C5'
          : '';

      if (mintAddress === '') {
        return;
      }
      try {
        const contract = new ethers.Contract(mintAddress, erc1155, provider);
        const contract0 = new ethers.Contract('0x7cf12057804499A21A08c40B87E3DE9Ff237E566', erc20, provider);
        const res0 = await contract0
          .connect(signer)
          .approve('0x4c8B2ce3Ae6eFBF74511df50658e7D7b316942A4', '1000000000000000000000');

        await res0.wait(3);

        await contract.connect(signer).mint(1);
      } catch (e: any) {
        console.log('error'.concat(e.message));
      }
    }
  };
  return (
    <Box
      bgPosition={'center'}
      bgRepeat={'no-repeat'}
      width="full"
      paddingLeft={5}
      paddingTop={100}
      height={props.height * 2.5}
      bgImg={'https://theuniverse.mypinata.cloud/ipfs/QmeJk3D3P6abctHSzezLhBYVhX5o9DSySfpJ3W17Pu9buM'}
      bgClip={'border-box'}
    >
      <Box
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
        marginLeft={'20px'}
        maxWidth={props.width * 0.8}
        minWidth={props.width * 0.8}
        width={props.width * 0.8}
      >
        <>
          <div className="content">
            {proposals && (
              <div className="tabContent">
                Governance Overview
                <div className="widgets">
                  <Box style={{ width: '200%' }}>
                    <Widget info={totalP} title="Proposals Created">
                      <div className="extraWidgetInfo">
                        <div className="extraTitle">Pass Rate</div>
                        <div className="progress">
                          <div className="progressPercentage" style={{ width: `${passRate}%` }}></div>
                        </div>
                      </div>
                    </Widget>
                  </Box>
                  <Widget info={voters.length} title="Eligible Voters" />
                  <Widget info={(totalP - counted).toString()} title="Ongoing Proposals" />
                </div>
                Recent Proposals
                <div style={{ marginTop: '30px' }}>
                  <Table
                    columnsConfig="10% 70% 20%"
                    data={proposals}
                    header={[<span>ID</span>, <span>Description</span>, <span>Status</span>]}
                    pageSize={5}
                  />
                </div>
                <div style={{ marginTop: '30px' }} />
                <Form
                  buttonConfig={{
                    isLoading: sub,
                    loadingText: 'Submitting Proposal',
                    text: 'Submit',
                    theme: 'secondary',
                  }}
                  data={[
                    {
                      inputWidth: '100%',
                      name: 'New Proposal',
                      type: 'textarea',
                      validation: {
                        required: true,
                      },
                      value: '',
                    },
                  ]}
                  onSubmit={(e) => {
                    setSub(true);
                    createProposal(e.data[0].inputResult);
                  }}
                  title="Create a New Proposal"
                  id={''}
                />
                <HStack
                  flexDirection={'row'}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 100,
                    width: props.width * 0.8,
                    marginLeft: props.width < 600 ? '0px' : '10px',
                  }}
                >
                  <PlanCard
                    description={['DAO Voting', 'Faster Combat Ships & More']}
                    descriptionTitle=" Player class that gives bonuses to fleet actions."
                    footer={
                      <Button
                        disabled={user ? false : true}
                        onClick={mintNow}
                        customize={{ backgroundColor: '#000228', textColor: 'white' }}
                        isFullWidth
                        text="1000 DKMT"
                        theme="custom"
                      />
                    }
                    isActive
                    subTitle="ERC1155 TOKENS"
                    title={
                      <h1 style={{ color: '#041836', fontSize: '34px' }}>
                        <strong>Generals </strong>
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

                  <Box style={{ flex: 1, justifyContent: 'center', paddingLeft: '10%', alignItems: 'center' }}>
                    <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'left'}>
                      {'10/1000 DAO TOKENS LEFT'}
                    </Text>
                  </Box>
                </HStack>
              </div>
            )}
          </div>
          <div className="voting"></div>
        </>
      </Box>
    </Box>
  );
};

export default DAO;
const erc1155 = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
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
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
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
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
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
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_mintPrice',
        type: 'uint256',
      },
    ],
    name: 'setTokenPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    name: 'setTokenUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
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
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
    ],
    name: 'TransferBatch',
    type: 'event',
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
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
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'TransferSingle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'value',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'URI',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'minting',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_tokenIDs',
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
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: '_tokenOwner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: '_tokenOwners',
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
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
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
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
    ],
    name: 'balanceOfBatch',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentID',
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
    name: 'getCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
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
    ],
    name: 'getTokenIDs',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getTokenOwners',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
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
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
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
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const erc20 = [
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
