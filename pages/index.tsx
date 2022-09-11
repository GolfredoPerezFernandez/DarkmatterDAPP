import { Default } from 'components/layouts/Default';
import { Home } from 'components/templates/home';
import type { NextPage } from 'next';
import { useEffect } from 'react';

import { useMoralis } from 'react-moralis';

const HomePage: NextPage<any> = (props: any) => {
  const { enableWeb3, isWeb3Enabled } = useMoralis();
  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);
  return (
    <Default width={props.width} height={props.height} {...props} pageName="Home">
      <Home {...props} />
    </Default>
  );
};

export default HomePage;
