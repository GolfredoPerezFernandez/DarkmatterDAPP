import { Box, Text, Image } from '@chakra-ui/react';
import React from 'react';
import 'react-alice-carousel/lib/alice-carousel.css';

const Game = (props: any) => {
  return (
    <Box
      alignItems={'flex-start'}
      justifyContent={'flex-start'}
      marginLeft={'40px'}
      minHeight={props.height}
      maxWidth={props.width * 0.8}
      minWidth={props.width * 0.8}
      width={props.width * 0.8}
    >
      <Box
        bgPosition={'center'}
        marginTop={100}
        minHeight={props.height * 2}
        bgRepeat={'no-repeat'}
        width="full"
        bgImg={'https://theuniverse.mypinata.cloud/ipfs/QmT6ahzJuF7sGyqSLs5WtXfYgANGi13SqUaEAC3rNucQAp'}
        bgClip={'border-box'}
      >
        <Text alignSelf={'center'} textAlign="center" fontSize="6xl">
          DarkMatter Review
        </Text>

        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          {' '}
          DarkMatter will be a web browser and text-based sci-fi war simulator and MMO that many consider to be the
          "lite" version of EVE Online.
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={4} fontSize="md">
          DarkMatter is a text-based space simulation strategy MMO available for internet browser. Its gameplay is
          similar to Eve Online but it lacks three-dimensional visuals and focuses primarily as a text-based game.
          Players begin with a single barren planet, balancing resource production and constructing new buildings to
          support a growing fleet, eventually colonizing further planets in the galaxy to create their own empire. Three
          main resources must be collected to build ships and buildings: Metal, Crystal, and Deuterium. To secure
          materials, join an alliance with other players and raid enemies for resources or promote free trade amongst
          members.
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={5} fontSize="md">
          PVP is the main attraction of DarkMatter, and combat will determine if your empire's fleet is the strongest in
          the universe.{' '}
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={10} fontSize="4xl">
          DarkMatter Key Features:
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          NFT Game Based: play to earn fun ecosystem.
        </Text>

        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          Text-Based Gameplay: can be accessed anywhere with an internet connection on most devices.
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          Highly Strategic Resource Management: one of the first major browser based strategy games.
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          Buildings and Research: huge array of buildings and research to construct and utilize.
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          Alliances: form alliances with other players to organize group attacks.
        </Text>
        <Text alignSelf={'center'} textAlign="center" marginTop={2} fontSize="md">
          Resources: gather Metal, Crystal, and Deuterium to build ships and buildings.
        </Text>
        <Image
          src={'https://theuniverse.mypinata.cloud/ipfs/QmUaVqSjqrsKQUjzCReiqXpxVXCiVXVNkVVBubeDt7Sr4k'}
          marginLeft={'44%'}
          marginTop={'40px'}
          height={55}
          width={190}
          alt="Ultimate"
        />
      </Box>
    </Box>
  );
};

export default Game;
