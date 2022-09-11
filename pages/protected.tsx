import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { Protected } from 'components/templates/protected';

const ProtectedPage: NextPage<any> = (props) => {
  return (
    <Default width={props.width} height={props.height} pageName="Protected">
      <Protected {...props} />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  const nftList = await Moralis.EvmApi.account.getNFTsForContract({
    address: session.user.address,
    tokenAddress: 'xxx',
    chain: 80001,
  });

  return {
    props: {
      message: nftList.raw.total > 0 ? 'Nice! You have our NFT' : "Sorry, you don't have our NFT",
      nftList: nftList.raw.result,
    },
  };
};

export default ProtectedPage;
