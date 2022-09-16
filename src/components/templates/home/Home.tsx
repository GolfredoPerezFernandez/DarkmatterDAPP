/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint-disable complexity */
import { Box, Text, Image, HStack, VStack } from '@chakra-ui/react';
import { Avatar, PlanCard, Button, Illustration, useNotification, notifyType, IPosition } from '@web3uikit/core';
import { Footer } from 'components/modules';
import React, { useEffect, useState } from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useMoralis } from 'react-moralis';
const abi = require('./abi');

const FlipCountdown = require('@rumess/react-flip-countdown');
import Link from 'next/link';

import 'react-multi-carousel/lib/styles.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import Carousel from 'react-multi-carousel';
import numberWithComas from 'utils/numberWithComas';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1700 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 1700, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Home = (props: any) => {
  const { Moralis, user, isWeb3Enabled, isAuthenticated, isWeb3EnableLoading, authenticate } = useMoralis();
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [chainId] = useState('0x13');
  const [claimedAmount, setClaimedAmount] = useState<any>(0);
  const [planetsCreated, setPlanetsCreated] = useState<any>([]);
  const [myPlanets, setMyPlanets] = useState<any>([]);
  const [planets, setTotalPlanets] = useState<any>(0);
  const [rewardsToClaim, setRewardsToClaim] = useState<any>(0);
  const collectionSubscriptionSongbird = async () => {
    const query = new Moralis.Query('PlanetsSongbird');
    const subscription = await query.subscribe();
    subscription.on('create', initPlanets);
  };

  const collectionSubscriptionPolygon = async () => {
    const query = new Moralis.Query('PlanetsPolygon');
    const subscription = await query.subscribe();
    subscription.on('create', initPlanets);
  };
  async function initPlanets() {
    if (chainId === '0x89') {
      const ownedItems = await Moralis.Cloud.run('getTotalPlanetsPolygon');
      setTotalPlanets(ownedItems);
    }
    if (chainId === '0x13') {
      const ownedItems = await Moralis.Cloud.run('getTotalPlanetsSongbird');
      setTotalPlanets(ownedItems);
    }
  }
  useEffect(() => {
    if (chainId === '0x89') {
      collectionSubscriptionPolygon();
    }
    if (chainId === '0x13') {
      collectionSubscriptionSongbird();
    }
    initPlanets();
  }, [chainId]);

  useEffect(() => {
    async function init() {
      setRewardAmount(0);
      let ownedItems2: any = '';
      const chainId2 = Moralis.getChainId();
      let market2: any[] = [];
      let ownedItems: any = '';

      if (chainId2 === '0x89') {
        ownedItems2 = await Moralis.Cloud.run('getPlanetsPolygon'.toString(), { owner: user?.get('ethAddress') });
        ownedItems = await Moralis.Cloud.run('getAllItemsPolygon');
        for (let i = 0; i < ownedItems2.length; i++) {
          const newItem: any = {
            name: ownedItems2[i].name,
            marketId: ownedItems2[i].owner,
            tokenId: ownedItems2[i].tokenId,
            contractType: ownedItems2[i].description,
            tokenAddress: ownedItems2[i].tokenAddress,
            metadataFilePath: ownedItems2[i].metadataFilePath,
            image: ownedItems2[i].image,
          };

          market2 = [...market2, newItem];
        }

        console.log(JSON.stringify(market2));
        setMyPlanets([...market2]);

        console.log(JSON.stringify(ownedItems));
      }

      console.log(ownedItems);
      if (chainId2 === '0x13') {
        ownedItems2 = await Moralis.Cloud.run('getPlanetsSongbird'.toString(), { owner: user?.get('ethAddress') });

        ownedItems = await Moralis.Cloud.run('getAllItemsSongbird');

        for (let i = 0; i < ownedItems2.length; i++) {
          const newItem: any = {
            name: ownedItems2[i].name,
            marketId: ownedItems2[i].owner,
            tokenId: ownedItems2[i].tokenId,
            contractType: ownedItems2[i].description,
            tokenAddress: ownedItems2[i].tokenAddress,
            metadataFilePath: ownedItems2[i].metadataFilePath,
            image: ownedItems2[i].image,
          };

          market2 = [...market2, newItem];
        }
      }
      console.log(JSON.stringify(market2));
      setMyPlanets([...market2]);

      let market: any[] = [];

      for (let i = 0; i < ownedItems.length; i++) {
        console.log(ownedItems[i].tokenId);
        const newItem: any = {
          tokenId: ownedItems[i].tokenId,
        };

        market = [...market, newItem];
      }
      console.log(market);
      setPlanetsCreated([...market]);

      if (isAuthenticated && !isWeb3EnableLoading && isWeb3Enabled) {
        const provider = await Moralis.enableWeb3({ provider: 'metamask' });
        const ethers = Moralis.web3Library;
        let contract: any = '';
        if (chainId2 === '0x89') {
          contract = new ethers.Contract('0x9Fa071bc5Ca5dE26C34D7aa373978A77b55321F9', abi.rewards, provider);
        }
        if (chainId2 === '0x13') {
          contract = new ethers.Contract('0x89F9B8FCd6219ddF1FE994d887b036D538200f1D', abi.rewards, provider);
        }
        const signer = provider.getSigner();

        const transaction2 = await contract
          .connect(signer)
          .poolInfoOfId(0)
          .catch(() => {
            handleUserNotification('warning');
          });
        console.log(JSON.stringify(transaction2));
        console.log(JSON.stringify(Moralis.Units.FromWei(parseFloat(transaction2[6]).toString())));
        const rewa = Moralis.Units.FromWei(parseFloat(transaction2[6]).toString());
        if (parseFloat(rewa) === 0) {
          setRewardAmount(parseFloat(rewa));
        }
        setClaimedAmount(Moralis.Units.FromWei(transaction2[5]));

        let rewardsToClaim2 = 0;

        let ownedItems3: any = '';

        if (chainId2 === '0x89') {
          const nftList = await Moralis.Web3API.account.getNFTs({
            address: user?.get('ethAddress'),
            chain: '0x89',
          });

          ownedItems3 = await Moralis.Cloud.run('getMyPlanetsIdPolygon', { owner: user?.get('ethAddress') });
          console.log(nftList);
        }
        if (chainId2 === '0x13') {
          ownedItems3 = await Moralis.Cloud.run('getMyPlanetsIdSongbird', { owner: user?.get('ethAddress') });
        }

        await Promise.all(
          ownedItems3.map(async (item: any, index: any) => {
            const transactionRewardsOf = await contract.connect(signer).rewardsOf(0, ownedItems3[index].tokenId);

            rewardsToClaim2 =
              rewardsToClaim2 + Math.trunc(parseFloat(Moralis.Units.FromWei(transactionRewardsOf[1].toString())));
          }),
        );
        setRewardsToClaim(rewardsToClaim2.toString());
      }
    }
    if (isWeb3Enabled && isWeb3Enabled && isWeb3Enabled && !isWeb3EnableLoading) {
      init();
    }
  }, [isWeb3Enabled, isWeb3Enabled]);
  const claimRewards = async () => {
    if (isWeb3Enabled && isAuthenticated) {
      const provider = await Moralis.enableWeb3({ provider: 'metamask' });
      const ethers = Moralis.web3Library;
      const signer = provider.getSigner();
      const contract = new ethers.Contract('0x89F9B8FCd6219ddF1FE994d887b036D538200f1D', abi.rewards, provider);

      if (!user?.get('tokenAdded')) {
        const { window } = global.window;

        if (window !== undefined && window.ethereum !== undefined) {
          await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: '0x433eb2d4ccAe3eC8Bb7AFB58aCcA92BBF6d479b6',
                symbol: 'DKMT',
                decimals: 18,
                image: 'https://theuniverse.mypinata.cloud/ipfs/Qmdh3Kv5SvK6NHNY6MUXsrKWimUF9bTLTqhRWpWrNJiatR',
              },
            },
          });

          user?.set('tokenAdded', true);
          user?.save();
        }
      }
      let tokenids: any = [];

      const ownedItems2 = await Moralis.Cloud.run('getMyPlanetsIdSongbird', { owner: user?.get('ethAddress') });
      for (let i = 0; i < ownedItems2.length; i++) {
        tokenids = [...tokenids, ownedItems2[i].tokenId];
      }
      await contract
        .connect(signer)
        .claimRewardsOf(tokenids)
        .catch(() => {
          handleNoNftNotification('warning');
        })
        .then(() => {
          setRewardsToClaim(0);
        });
    } else {
      if (isWeb3Enabled) {
        authenticate();
      }
    }
  };
  const mintNow = async () => {
    setLoading(true);
    const chainId2 = Moralis.getChainId();
    if (user) {
      const provider = await Moralis.enableWeb3({ provider: 'metamask' });
      const ethers = Moralis.web3Library;

      const signer = provider.getSigner();

      const contract0 = new ethers.Contract('0xe4671844Fcb3cA9A80A1224B6f9A0A6c2Ba2a7d5', erc20ABI, provider);
      const res0 = await contract0
        .connect(signer)
        .approve('0x825D72E626864e236baE9bBc6F1B4528a42508C5', Moralis.Units.ETH('5'));

      await res0.wait(3);
      const mintAddress =
        chainId2 === '0x89'
          ? '0x825D72E626864e236baE9bBc6F1B4528a42508C5'
          : chainId2 === '0x13'
          ? '0x825D72E626864e236baE9bBc6F1B4528a42508C5'
          : '';
      const rewardsAddress =
        chainId2 === '0x89'
          ? '0x9Fa071bc5Ca5dE26C34D7aa373978A77b55321F9'
          : chainId2 === '0x13'
          ? '0x89F9B8FCd6219ddF1FE994d887b036D538200f1D'
          : '';

      if (mintAddress === '') {
        return;
      }
      const contract = new ethers.Contract(mintAddress, abi.collection, provider);

      const contract2 = new ethers.Contract(rewardsAddress, abi.rewards, provider);

      const transaction2 = await contract.connect(signer).mintedAmt();
      await contract
        .connect(signer)
        .safeMint(1)
        .then(async (err: any) => {
          console.log(err);
          const wait = await err.wait(3);

          if (wait) {
            const Item = Moralis.Object.extend('PlanetsSongbird');
            const queryResult = new Item();
            queryResult.set('owner', user.get('ethAddress'));
            queryResult.set('planetId', (parseFloat(transaction2) + 1).toString());
            queryResult.set('tokenAddress', '0x825D72E626864e236baE9bBc6F1B4528a42508C5');

            queryResult.set('name', 'Planet #'.concat(parseInt(wait.logs[2].topics[3].toString(), 16).toString()));
            queryResult.set('description', 'Planets are the base of your empire.');
            queryResult.set(
              'metadataFilePath',
              'https://ipfs.moralis.io:2053/ipfs/QmUSRueYhgvJBF7Y5znbHWbhMHKBHPaZNjjj3apEytmDdF/metadata/'
                .concat(parseInt(wait.logs[2].topics[3].toString(), 16).toString())
                .concat('.json'),
            );
            queryResult.set('metadataFileHash', 'QmUSRueYhgvJBF7Y5znbHWbhMHKBHPaZNjjj3apEytmDdF');
            queryResult.set(
              'image',
              'https://theuniverse.mypinata.cloud/ipfs/QmdBJczfNV4HHcucXxPkehqK5LG5iqU6AG3tX83WeUfdgK/'
                .concat(parseInt(wait.logs[2].topics[3].toString(), 16).toString())
                .concat('.png'),
            );
            queryResult.set('tokenId', parseInt(wait.logs[2].topics[3].toString(), 16).toString());

            await queryResult.save();

            handleMintNotification('success');
            user.set('canClaim', true);
            setMyPlanets([
              ...myPlanets,
              {
                owner: user.get('ethAddress'),
                planetId: (parseFloat(transaction2) + 1).toString(),
                tokenAddress: '0x825D72E626864e236baE9bBc6F1B4528a42508C5',
                name: 'Planet #'.concat(parseInt(wait.logs[2].topics[3].toString(), 16).toString()),
                description: 'Planets are the base of your empire.',
                metadataFilePath:
                  'https://ipfs.moralis.io:2053/ipfs/QmUSRueYhgvJBF7Y5znbHWbhMHKBHPaZNjjj3apEytmDdF/metadata/'
                    .concat(parseInt(wait.logs[2].topics[3].toString(), 16).toString())
                    .concat('.json'),
                image: 'https://theuniverse.mypinata.cloud/ipfs/QmdBJczfNV4HHcucXxPkehqK5LG5iqU6AG3tX83WeUfdgK/'
                  .concat(parseInt(wait.logs[2].topics[3].toString(), 16).toString())
                  .concat('.png'),
                tokenId: parseInt(wait.logs[2].topics[3].toString(), 16).toString(),
              },
            ]);
            let tokenids: any = [];
            let rewardsToClaim2 = 0;

            const ownedItems2 = await Moralis.Cloud.run('getMyPlanetsIdSongbird', { owner: user?.get('ethAddress') });

            await Promise.all(
              ownedItems2.map(async (item: any, index: any) => {
                const transactionRewardsOf = await contract2.connect(signer).rewardsOf(0, ownedItems2[index].tokenId);
                rewardsToClaim2 =
                  rewardsToClaim2 + Math.trunc(parseFloat(Moralis.Units.FromWei(transactionRewardsOf[1].toString())));
                tokenids = [...tokenids, ownedItems2[index].tokenId];
              }),
            );

            setRewardsToClaim(rewardsToClaim2.toString());
            setLoading(false);
          }
        })
        .catch(() => {
          handleNoFundsNotification('warning');
        });
    }
  };
  const dispatch = useNotification();

  const handleNoNftNotification = (type: notifyType, icon?: React.ReactElement, position?: IPosition) => {
    dispatch({
      type,
      message: 'Not Own an Planet',
      title: 'You need to own a planet to claim',
      icon,
      position: position || 'topR',
    });
  };
  const handleUserNotification = (type: notifyType, icon?: React.ReactElement, position?: IPosition) => {
    dispatch({
      type,
      message: 'Enable Web3',
      title: 'Please connect you wallet',
      icon,
      position: position || 'topR',
    });
  };

  const handleMintNotification = (type: notifyType, icon?: React.ReactElement, position?: IPosition) => {
    dispatch({
      type,
      message: 'You bought a Planet',
      title: 'Congratulations',
      icon,
      position: position || 'topR',
    });
  };

  const handleNoFundsNotification = (type: notifyType, icon?: React.ReactElement, position?: IPosition) => {
    dispatch({
      type,
      message: 'Canceled',
      title: 'Gas * price',
      icon,
      position: position || 'topR',
    });
  };

  return (
    <Box
      bgPosition={'center'}
      bgRepeat={'no-repeat'}
      width="full"
      bgImg={'https://theuniverse.mypinata.cloud/ipfs/QmYBJaacSHEH8R6oLPJV3xakCgbYqHBqxjw3PPtXgPAMPm'}
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
        <Box style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text fontSize="lg" textAlign={'center'}>
            Patience and planning are rewarded with a strong and flexible account that can be played on and off for
            years.
          </Text>

          <Text fontSize="6xl" textAlign={'center'}>
            Build, Attack, Defend, Explore, or Research.
          </Text>
          <Text fontSize="2xl" marginBottom={20} textAlign={'center'}>
            Develop your space empire in the way you want.
          </Text>
          {props.width < 800 ? (
            <VStack style={{ marginLeft: props.width < 600 ? '0px' : '100px' }}>
              <PlanCard
                description={['Game Access']}
                descriptionTitle="Planets are the base of your empire. You start the game with one (your homeplanet), and can later colonize more of them (colonies).!"
                footer={
                  <Button
                    onClick={mintNow}
                    disabled={user ? false : true}
                    customize={{ backgroundColor: '#000228', textColor: 'white' }}
                    isFullWidth
                    text={'MINT COST'
                      .concat(chainId === '0x13' ? '5000' : '')
                      .concat(chainId === '0x13' ? 'COOT' : 'MATIC')}
                    theme="custom"
                  />
                }
                isActive
                subTitle="NFT"
                title={
                  <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ color: '#041836', fontSize: '34px' }}>
                      <strong>PLANET </strong>
                    </h1>
                    <Box
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        image="https://theuniverse.mypinata.cloud/ipfs/QmdiPG8y5NDALbgeqfWAJjxJ3RFu46J7HikS1otQPNUzj1"
                        isRounded
                        size={120}
                        theme="image"
                      />
                    </Box>
                  </Box>
                }
                isCurrentPlan={false}
              />{' '}
              <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text marginLeft={'0%'} marginTop={'50px'} fontSize="3xl" textAlign={'right'}>
                  {numberWithComas(rewardAmount - claimedAmount)?.concat(' DKMT in Rewards')}
                </Text>
                <Text marginLeft={'0%'} marginTop={'10px'} fontSize="2xl" textAlign={'right'}>
                  {' Planet ID define the  rarity:'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'right'}>
                  {'1 to 500 Legendary'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'right'}>
                  {'500 to 1500 Epic'}
                </Text>
                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'right'}>
                  {'1500 to 3000 Rare'}
                </Text>
                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'right'}>
                  {'3000 to 6000 Uncommon'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'right'}>
                  {'6000 to 10000 Common'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'30px'} fontSize="2xl" textAlign={'right'}>
                  {' Claim your planet rewards:'}
                </Text>

                <Box>
                  <Text marginTop={'0'} marginBottom={5} fontSize="6xl" textAlign={'right'}>
                    {rewardsToClaim.toString().concat('  DKMT')}
                  </Text>

                  {rewardsToClaim > 0 ? (
                    <Button
                      disabled={user ? false : true}
                      onClick={claimRewards}
                      text="Claim Rewards"
                      isFullWidth
                      theme="secondary"
                    />
                  ) : null}
                  <Box
                    style={{
                      flex: 1,
                      width: 200,
                      alignSelf: 'flex-end',
                      marginLeft: '20%',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}
                  ></Box>
                </Box>
              </Box>
            </VStack>
          ) : (
            <HStack
              flexDirection={'row'}
              style={{ flexDirection: 'row', marginLeft: props.width < 600 ? '0px' : '100px' }}
            >
              <PlanCard
                description={['Game Access']}
                descriptionTitle="Planets are the base of your empire. You start the game with one (your homeplanet), and can later colonize more of them (colonies).!"
                footer={
                  <Button
                    onClick={mintNow}
                    disabled={user ? false : true || loading}
                    customize={{ backgroundColor: '#000228', textColor: 'white' }}
                    isFullWidth
                    text={'MINT COST'
                      .concat(chainId === '0x13' ? ' 4000 ' : ' 36 ')
                      .concat(chainId === '0x13' ? 'COOT' : 'MATIC')}
                    theme="custom"
                  />
                }
                isActive
                subTitle="NFT"
                title={
                  <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ color: '#041836', fontSize: '34px' }}>
                      <strong>PLANET </strong>
                    </h1>
                    <Box
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        image="https://theuniverse.mypinata.cloud/ipfs/QmdiPG8y5NDALbgeqfWAJjxJ3RFu46J7HikS1otQPNUzj1"
                        isRounded
                        size={120}
                        theme="image"
                      />
                    </Box>
                  </Box>
                }
                isCurrentPlan={false}
              />

              <Box style={{ flex: 1, justifyContent: 'center', paddingLeft: '20%', alignItems: 'center' }}>
                <Text marginLeft={'0%'} marginTop={'50px'} fontSize="3xl" textAlign={'left'}>
                  {'5.000.0000'.concat(' DKMT in Rewards')}
                </Text>
                <Text marginLeft={'0%'} marginTop={'10px'} fontSize="2xl" textAlign={'left'}>
                  {' Planet ID define the  rarity:'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'left'}>
                  {'1 to 500 Legendary'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'left'}>
                  {'500 to 1500 Epic'}
                </Text>
                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'left'}>
                  {'1500 to 3000 Rare'}
                </Text>
                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'left'}>
                  {'3000 to 6000 Uncommon'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'20px'} fontSize="1xl" textAlign={'left'}>
                  {'6000 to 10000 Common'}
                </Text>

                <Text marginLeft={'0%'} marginTop={'30px'} fontSize="2xl" textAlign={'left'}>
                  {' Claim your planet rewards:'}
                </Text>
                <Text marginTop={'0'} marginBottom={5} fontSize="6xl" textAlign={'left'}>
                  {rewardsToClaim.toString().concat('  DKMT')}
                </Text>

                <Box
                  style={{ flex: 1, width: 200, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}
                >
                  {rewardsToClaim > 0 ? (
                    <Button
                      disabled={user ? false : true}
                      onClick={claimRewards}
                      isFullWidth
                      text="Claim Rewards"
                      theme="secondary"
                    />
                  ) : null}
                </Box>
              </Box>
            </HStack>
          )}
          {parseFloat(planetsCreated.length) > 0 ? (
            <Box
              style={{
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                width: props.width,
                height: 300,
                marginRight: props.width < 600 ? 0 : -200,
              }}
            >
              <Text
                marginTop={'50px'}
                marginLeft={props.width < 600 ? 0 : 20}
                minW={250}
                fontSize="6xl"
                textAlign={'left'}
              >
                {planets.toString().concat('/10000 PLANETS')}
              </Text>

              <Carousel
                additionalTransfrom={0}
                arrows={false}
                autoPlay
                autoPlaySpeed={1}
                centerMode={false}
                className=""
                containerClass="container-with-dots"
                customTransition="all 1s linear"
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={responsive}
                showDots={false}
                sliderClass=""
                slidesToSlide={0}
                swipeable
                transitionDuration={6000}
                rtl={false}
              >
                {planetsCreated.map((card: any) => {
                  return (
                    <Box>
                      <Image rounded={20} marginLeft={10} marginRight={10} width={200} height={200} src={card.image} />
                    </Box>
                  );
                })}
              </Carousel>
            </Box>
          ) : null}

          {myPlanets.length > 0 ? (
            <Box
              style={{
                marginTop: 0,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 200,
                width: props.width,
                height: 300,
                marginRight: props.width < 600 ? 0 : -200,
              }}
            >
              <Box>
                <Text
                  marginTop={0}
                  marginLeft={props.width < 600 ? 0 : 20}
                  minW={250}
                  fontSize="6xl"
                  textAlign={'left'}
                >
                  {'MY PLANETS '.concat(myPlanets.length)}
                </Text>

                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlay
                  autoPlaySpeed={1}
                  centerMode={false}
                  className=""
                  containerClass="container-with-dots"
                  customTransition="all 1s linear"
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={responsive}
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={0}
                  swipeable
                  transitionDuration={6000}
                  rtl={false}
                >
                  {myPlanets.map((card: any) => {
                    return (
                      <Box>
                        <Image
                          rounded={20}
                          marginLeft={10}
                          marginRight={10}
                          width={200}
                          height={200}
                          src={card.image}
                        />
                      </Box>
                    );
                  })}
                </Carousel>
              </Box>
            </Box>
          ) : null}
          <Text marginBottom={5} marginTop={40} fontSize="2xl" textAlign={'center'}>
            BETA GAME RELEASE
          </Text>
          <FlipCountdown hideYear endAt={'2022-12-12 01:26:58'} onTimeUp={() => console.log("Time's up ⏳")} />

          <Box style={{ height: 100 }} />
          <Link href="https://discord.gg/2VG2CKFz">
            <a target="_blank">
              <Illustration logo="discord" />
            </a>
          </Link>

          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

export const erc20ABI = [
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
