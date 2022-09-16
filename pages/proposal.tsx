import { Default } from 'components/layouts/Default';
import { NextPage } from 'next';
import { Proposal } from 'components/templates/proposal';

const ProposalPage: NextPage<any> = (props) => {
  return (
    <Default width={props.width} height={props.height} pageName="DAO">
      <Proposal {...props} />
    </Default>
  );
};

export default ProposalPage;
