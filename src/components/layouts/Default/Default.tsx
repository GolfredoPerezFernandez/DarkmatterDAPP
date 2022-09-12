import { FC, ReactNode } from 'react';
import { Box, Container, Grid, GridItem, List, ListItem, VStack } from '@chakra-ui/react';
import { Header } from 'components/modules';
import Head from 'next/head';

import NAV_LINKS from '../paths';
import { NavItem2 } from 'components/elements';

const Default: FC<{ children: ReactNode; pageName: string; width: number; height: number }> = ({
  children,
  pageName,
  width,
  height,
}) => (
  <Grid
    overflow={'hidden'}
    overflowX={'hidden'}
    overflowY={'hidden'}
    width={width}
    minW={width}
    maxW={width}
    templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
    gridTemplateRows={'100 1fr 30px'}
    gridTemplateColumns={width < 900 ? '0 0fr' : '100px 1fr'}
    backgroundColor={'#000228'}
    color="white"
    fontWeight="bold"
  >
    <>
      <GridItem
        position={'absolute'}
        style={{
          width: '100%',
          background: '#000228',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        pl="2"
        area={'header'}
      >
        <Head>
          <title>{`${pageName} | DarkMatter`}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Header width={width} height={height} />
      </GridItem>

      {width < 900 ? null : (
        <GridItem
          position={'fixed'}
          height="full"
          pl="2"
          background={'#000228'}
          style={{
            paddingTop: 65,
            width: 100,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          area={'nav'}
        >
          <List style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} spacing={3}>
            {NAV_LINKS.map((link) => (
              <ListItem>
                <VStack
                  style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                  w={'full'}
                  height={'80px'}
                  width={'100%'}
                >
                  <NavItem2 key={`link-${link.label}`} {...link} />
                </VStack>
              </ListItem>
            ))}
          </List>
        </GridItem>
      )}
      <GridItem
        alignItems={'center'}
        borderRadius={'100px'}
        maxWidth={width}
        minWidth={width}
        width={width}
        justifyContent={'center'}
        area={'main'}
      >
        <Container
          justifyContent={'center'}
          alignItems={'center'}
          maxW={width}
          width={1900}
          style={{ flex: 1 }}
          marginTop={100}
          as="main"
        >
          {children}
        </Container>
      </GridItem>
      <GridItem pl="2" justifyContent={'center'} alignItems={'center'} area={'footer'}></GridItem>
    </>
  </Grid>
);

export default Default;
