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
  const { Moralis, user, isWeb3Enabled, isAuthenticated, authenticate } = useMoralis();
  const [rewardAmount, setRewardAmount] = useState<number>(0);

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

  async function initPlanets() {
    const ownedItems = await Moralis.Cloud.run('getTotalPlanetsSongbird');
    setTotalPlanets(ownedItems);
  }
  useEffect(() => {
    collectionSubscriptionSongbird();

    initPlanets();
  });

  useEffect(() => {
    async function init() {
      setRewardAmount(0);
      const ownedItems2 = await Moralis.Cloud.run('getPlanetsSongbird', { owner: user?.get('ethAddress') });
      let market2: any[] = [];

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
      setMyPlanets([...market2]);

      const ownedItems = await Moralis.Cloud.run('getAllItemsSongbird');
      let market: any[] = [];

      for (let i = 0; i < ownedItems.length; i++) {
        const newItem: any = {
          name: ownedItems[i].name,
          marketId: ownedItems[i].owner,
          tokenId: ownedItems[i].tokenId,
          contractType: ownedItems[i].description,
          tokenAddress: ownedItems[i].tokenAddress,
          metadataFilePath: ownedItems[i].metadataFilePath,
          image: ownedItems[i].image,
        };

        market = [...market, newItem];
      }
      setPlanetsCreated([...market]);
      if (isWeb3Enabled && isAuthenticated) {
        const provider = await Moralis.enableWeb3({ provider: 'metamask' });
        const ethers = Moralis.web3Library;

        const signer = provider.getSigner();

        const contract = new ethers.Contract('0x3F5eE9E1632Aa3fa688875050f9C9a486bA82179', abi.rewards, provider);

        const transaction2 = await contract
          .connect(signer)
          .poolInfoOfId(0)
          .catch(() => {
            handleUserNotification('warning');
          });
        const rewa = Moralis.Units.FromWei(transaction2[4]);
        if (parseFloat(rewa) === 0) {
          setRewardAmount(parseFloat(rewa));
        }
        setClaimedAmount(Moralis.Units.FromWei(transaction2[5]));

        let rewardsToClaim2 = 0;

        const ownedItems3 = await Moralis.Cloud.run('getMyPlanetsId', { owner: user?.get('ethAddress') });

        await Promise.all(
          ownedItems3.map(async (item: any, index: any) => {
            const transactionRewardsOf = await contract.connect(signer).rewardsOf(0, ownedItems2[index].tokenId);
            console.log(index);
            rewardsToClaim2 =
              rewardsToClaim2 + Math.trunc(parseFloat(Moralis.Units.FromWei(transactionRewardsOf[1].toString())));
          }),
        );

        setRewardsToClaim(rewardsToClaim2.toString());
      }
    }
    if (isWeb3Enabled) {
      init();
    }
  }, [isWeb3Enabled, isAuthenticated]);
  const claimRewards = async () => {
    if (isWeb3Enabled && isAuthenticated) {
      const provider = await Moralis.enableWeb3({ provider: 'metamask' });
      const ethers = Moralis.web3Library;
      const signer = provider.getSigner();
      const contract = new ethers.Contract('0x3F5eE9E1632Aa3fa688875050f9C9a486bA82179', abi.rewards, provider);

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

      const ownedItems2 = await Moralis.Cloud.run('getMyPlanetsId', { owner: user?.get('ethAddress') });
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
    if (user) {
      const provider = await Moralis.enableWeb3({ provider: 'metamask' });
      const ethers = Moralis.web3Library;

      const signer = provider.getSigner();

      const contract = new ethers.Contract('0x17BFc1E8CB7E07eE69697c6fd016f9D02D1A59A4', abi.collection, provider);

      const contract2 = new ethers.Contract('0x3F5eE9E1632Aa3fa688875050f9C9a486bA82179', abi.rewards, provider);

      const transaction2 = await contract.connect(signer).mintedAmt();

      const transaction = await contract
        .connect(signer)
        .safeMint(1, { value: Moralis.Units.ETH(1) })
        .catch(() => {
          handleNoFundsNotification('warning');
        });

      const wait = await transaction?.wait();
      try {
        const Item = Moralis.Object.extend('PlanetsSongbird');
        const queryResult = new Item();
        queryResult.set('owner', user.get('ethAddress'));
        queryResult.set('planetId', (parseFloat(transaction2) + 1).toString());
        queryResult.set('tokenAddress', '0x17BFc1E8CB7E07eE69697c6fd016f9D02D1A59A4');

        queryResult.set('name', 'Planet #'.concat(parseInt(wait.logs[0].topics[3].toString(), 16).toString()));
        queryResult.set('description', 'Planets are the base of your empire.');
        queryResult.set(
          'metadataFilePath',
          'https://ipfs.moralis.io:2053/ipfs/QmUSRueYhgvJBF7Y5znbHWbhMHKBHPaZNjjj3apEytmDdF/metadata/'
            .concat(parseInt(wait.logs[0].topics[3].toString(), 16).toString())
            .concat('.json'),
        );
        queryResult.set('metadataFileHash', 'QmUSRueYhgvJBF7Y5znbHWbhMHKBHPaZNjjj3apEytmDdF');
        queryResult.set(
          'image',
          'https://theuniverse.mypinata.cloud/ipfs/QmdBJczfNV4HHcucXxPkehqK5LG5iqU6AG3tX83WeUfdgK/'
            .concat(parseInt(wait.logs[0].topics[3].toString(), 16).toString())
            .concat('.png'),
        );
        queryResult.set('tokenId', parseInt(wait.logs[0].topics[3].toString(), 16).toString());

        await queryResult.save();

        user.set('canClaim', true);
        handleMintNotification('success');
        setMyPlanets([
          ...myPlanets,
          {
            owner: user.get('ethAddress'),
            planetId: (parseFloat(transaction2) + 1).toString(),
            tokenAddress: '0x17BFc1E8CB7E07eE69697c6fd016f9D02D1A59A4',
            name: 'Planet #'.concat(parseInt(wait.logs[0].topics[3].toString(), 16).toString()),
            description: 'Planets are the base of your empire.',
            metadataFilePath:
              'https://ipfs.moralis.io:2053/ipfs/QmUSRueYhgvJBF7Y5znbHWbhMHKBHPaZNjjj3apEytmDdF/metadata/'
                .concat(parseInt(wait.logs[0].topics[3].toString(), 16).toString())
                .concat('.json'),
            image: 'https://theuniverse.mypinata.cloud/ipfs/QmdBJczfNV4HHcucXxPkehqK5LG5iqU6AG3tX83WeUfdgK/'
              .concat(parseInt(wait.logs[0].topics[3].toString(), 16).toString())
              .concat('.png'),
            tokenId: parseInt(wait.logs[0].topics[3].toString(), 16).toString(),
          },
        ]);
        let tokenids: any = [];
        let rewardsToClaim2 = 0;

        const ownedItems2 = await Moralis.Cloud.run('getMyPlanetsId', { owner: user?.get('ethAddress') });

        await Promise.all(
          ownedItems2.map(async (item: any, index: any) => {
            const transactionRewardsOf = await contract2.connect(signer).rewardsOf(0, ownedItems2[index].tokenId);
            rewardsToClaim2 =
              rewardsToClaim2 + Math.trunc(parseFloat(Moralis.Units.FromWei(transactionRewardsOf[1].toString())));
            tokenids = [...tokenids, ownedItems2[index].tokenId];
          }),
        );

        setRewardsToClaim(rewardsToClaim2.toString());
      } catch (e: any) {
        console.log('error'.concat(e.message));
      }
    } else {
      handleUserNotification('warning');
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
      message: 'Insufficient funds',
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
                    disabled={!isAuthenticated}
                    customize={{ backgroundColor: '#000228', textColor: 'white' }}
                    isFullWidth
                    text="Pre-Sale Creation Cost 1000 SGB"
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
                  <Button
                    disabled={rewardsToClaim <= 0}
                    onClick={claimRewards}
                    isFullWidth
                    text="Claim Rewards"
                    theme="secondary"
                  />

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
                    disabled={!isAuthenticated}
                    customize={{ backgroundColor: '#000228', textColor: 'white' }}
                    isFullWidth
                    text="Creation Cost 1200 SGB"
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
                  <Button
                    disabled={rewardsToClaim <= 0}
                    onClick={claimRewards}
                    isFullWidth
                    text="Claim Rewards"
                    theme="secondary"
                  />
                </Box>
              </Box>
            </HStack>
          )}

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
          <Text marginBottom={5} marginTop={20} fontSize="2xl" textAlign={'center'}>
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
