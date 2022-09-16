import { Default } from 'components/layouts/Default';
import { NextPage } from 'next';
import { DeFi } from 'components/templates/defi';

const DeFiPage: NextPage<any> = (props) => {
  return (
    <Default width={props.width} height={props.height} pageName="DeFi">
      <DeFi {...props} />
    </Default>
  );
};

export default DeFiPage;
