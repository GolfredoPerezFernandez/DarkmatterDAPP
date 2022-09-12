import { Default } from 'components/layouts/Default';
import { Home } from 'components/templates/home';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import { useMoralis } from 'react-moralis';

const HomePage: NextPage<any> = (props: any) => {
  const { logout, chainId } = useMoralis();

  useEffect(() => {
    async function init() {
      if (chainId !== '0x13') {
        await logout();
      }
    }

    init();
  }, [chainId]);
  return (
    <Default width={props.width} height={props.height} {...props} pageName="Home">
      <Home {...props} />
    </Default>
  );
};

export default HomePage;
