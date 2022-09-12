import { Box, ChakraProvider } from '@chakra-ui/react';
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { extendTheme } from '@chakra-ui/react';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider  } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Loading, NotificationProvider } from '@web3uikit/core';
import { MoralisProvider} from 'react-moralis';

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });
const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    let handleResize;
    if (typeof global.window !== 'undefined') {
      handleResize = function () {
        setWindowSize({
          width: global.window.innerWidth,
          height: global.window.innerHeight,
        });
      };

      global.window.addEventListener('resize', handleResize);

      handleResize();
    }
  }, []);
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <MoralisProvider
      appId="5BMwmoaZo1TQ9gfcEA1ZLLlYYcsCtHOU0Os28u0H"
      serverUrl="https://avjgczsfqac0.usemoralis.com:2053/server"
    >
      <NotificationProvider>
        <ChakraProvider resetCSS theme={theme}>
          <WagmiConfig client={client}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              {isLoading ? (
                <Box
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000228',
                    flex: 1,
                    height: windowSize.height,
                    width: windowSize.width,
                  }}
                >
                  <Box
                    style={{
                      marginLeft: '45%',
                      paddingTop: '20%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <Loading fontSize={12} size={100} spinnerColor="#2E7DAF" spinnerType="wave" text="Loading..." />
                  </Box>
                </Box>
              ) : (
                <Component
                  overflow={'hidden'}
                  overflowX={'hidden'}
                  overflowY={'hidden'}
                  width={windowSize.width}
                  height={windowSize.height}
                  {...pageProps}
                />
              )}
            </SessionProvider>
          </WagmiConfig>
        </ChakraProvider>
      </NotificationProvider>
    </MoralisProvider>
  );
};

export default MyApp;
