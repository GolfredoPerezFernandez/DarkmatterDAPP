import { Default } from 'components/layouts/Default';
import { Proposal } from 'components/templates/proposal';
import { NextPage } from 'next';

const ProposalPage: NextPage<any> = (props) => {
  return (
    <Default width={props.width} height={props.height} pageName="DAO">
      <Proposal {...props} />
    </Default>
  );
};

export default ProposalPage;
