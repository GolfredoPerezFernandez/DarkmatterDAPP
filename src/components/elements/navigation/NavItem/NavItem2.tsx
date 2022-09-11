import { Box, Link, Popover, PopoverContent, PopoverTrigger, Stack, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import { ISubNav } from '../SubNav/SubNav';
import { SubNav } from '../SubNav';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Typography } from '@web3uikit/core';

const NavItem2: FC<ISubNav> = ({ label, children, href }) => {
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
          <Box style={{ marginLeft: 6 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmT9izvsQquvKDRXrF1NkcfLXYJ8LCL1zX9RrdoYcYTnbN"
            />
          </Box>
        );
      case 'GAME':
        return (
          <Box style={{ marginLeft: 6 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmT6FXj5osPZok97UXtRH45ttq9bvcp45poEFUc7cXcpa9"
            />
          </Box>
        );
      case 'MARKET':
        return (
          <Box style={{ marginLeft: 14 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/Qme3CdTqf5nwLbKQC5mjqg55JuzHhJbL8b8AbC6LsWFgeD"
            />
          </Box>
        );
      case 'BLOG':
        return (
          <Box style={{ marginLeft: 6 }}>
            <Avatar
              theme="image"
              size={30}
              image="https://theuniverse.mypinata.cloud/ipfs/QmQ4QQQ1wR924QZzoqr2gmmZCyRDJa3Ca2y88yZAA6G3Bg"
            />
          </Box>
        );
      case 'FORUM':
        return (
          <Box style={{ marginLeft: 4 }}>
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
                  {component()}
                  <Typography variant="H2"> {label}</Typography>
                </Link>
              </NextLink>
            )}
          </Box>
        </Box>
      </PopoverTrigger>

      {children && (
        <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
          <Stack>
            {children.map((child) => (
              <SubNav key={child.label} {...child} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default NavItem2;
