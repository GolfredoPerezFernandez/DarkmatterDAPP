import { Default } from 'components/layouts/Default';
import { NextPage } from 'next';
import { Game } from 'components/templates/game';

const GamePage: NextPage<any> = (props: any) => {
  return (
    <Default width={props.width} height={props.height} pageName="Market">
      <Game {...props} />
    </Default>
  );
};
export default GamePage;
