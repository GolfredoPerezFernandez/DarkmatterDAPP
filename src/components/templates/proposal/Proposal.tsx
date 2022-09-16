import React, { useState, useEffect } from 'react';
import './pages.css';
import { Tag, Widget, Tooltip, Form, Table, Avatar } from '@web3uikit/core';
import { Blockie } from 'web3uikit';

import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Proposal = () => {
  const router: any = useRouter();
  const { proposalDetails } = router.query;
  const { Moralis, isInitialized } = useMoralis();
  const [latestVote, setLatestVote] = useState<any>();
  const [percUp, setPercUp] = useState<any>(0);
  const [percDown, setPercDown] = useState<any>(0);
  const [votes, setVotes] = useState<any>([]);
  const [sub, setSub] = useState<any>(false);
  const contractProcessor = useWeb3ExecuteFunction();

  async function getVotes() {
    const Votes = Moralis.Object.extend('Votes');
    const query = new Moralis.Query(Votes);
    query.equalTo('proposal', proposalDetails?.id);
    query.descending('createdAt');
    const results = await query.find();
    if (results.length > 0) {
      setLatestVote(results[0].attributes);
      setPercDown(
        (
          (Number(results[0].attributes.votesDown) /
            (Number(results[0].attributes.votesDown) + Number(results[0].attributes.votesUp))) *
          100
        ).toFixed(0),
      );
      setPercUp(
        (
          (Number(results[0].attributes.votesUp) /
            (Number(results[0].attributes.votesDown) + Number(results[0].attributes.votesUp))) *
          100
        ).toFixed(0),
      );
    }

    const votesDirection = results.map((e) => [
      e.attributes.voter,
      <Avatar
        theme="image"
        size={24}
        avatarBackground={e.attributes.votedFor ? '#2cc40a' : '#d93d3d'}
        image={
          e.attributes.votedFor
            ? '"https://theuniverse.mypinata.cloud/ipfs/QmdHRmTnEmJmYpWc8yx5W4GrZi8GDCynJsNT3P7KCTBT5t"'
            : 'https://theuniverse.mypinata.cloud/ipfs/QmQJZ2KiDbhkAcAYCx6cJHThTU6ndUBaeCsN7sF39u1jor'
        }
      />,
    ]);

    setVotes(votesDirection);
  }
  useEffect(() => {
    if (isInitialized) {
      getVotes();
    }
  }, [isInitialized]);

  async function castVote(upDown: any) {
    const options = {
      contractAddress: '0x403fCf1049f7F9AAF22Af5f1775E9735F3A3a4bC',
      functionName: 'voteOnProposal',
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_id',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: '_vote',
              type: 'bool',
            },
          ],
          name: 'voteOnProposal',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      params: {
        _id: proposalDetails.id,
        _vote: upDown,
      },
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log('Vote Cast Succesfully');
        setSub(false);
      },
      onError: () => {
        setSub(false);
      },
    });
  }

  return (
    <>
      <div className="contentProposal">
        <div className="proposal">
          <Link to="/">
            <div className="backHome">Overview</div>
          </Link>
          <div>{proposalDetails.description}</div>
          <div className="proposalOverview">
            <Tag color={proposalDetails.color} text={proposalDetails.text} />
            <div className="proposer">
              <span>Proposed By </span>
              <Tooltip content={proposalDetails.proposer}>
                <Blockie seed={proposalDetails.proposer} />
              </Tooltip>
            </div>
          </div>
        </div>
        {latestVote && (
          <div className="widgets">
            <Widget info={latestVote.votesUp} title="Votes For">
              <div className="extraWidgetInfo">
                <div className="extraTitle">{percUp}%</div>
                <div className="progress">
                  <div className="progressPercentage" style={{ width: `${percUp}%` }}></div>
                </div>
              </div>
            </Widget>
            <Widget info={latestVote.votesDown} title="Votes Against">
              <div className="extraWidgetInfo">
                <div className="extraTitle">{percDown}%</div>
                <div className="progress">
                  <div className="progressPercentage" style={{ width: `${percDown}%` }}></div>
                </div>
              </div>
            </Widget>
          </div>
        )}
        <div className="votesDiv">
          <Table
            style={{ width: '60%' }}
            columnsConfig="90% 10%"
            data={votes}
            header={[<span>Address</span>, <span>Vote</span>]}
            pageSize={5}
          />

          <Form
            isDisabled={proposalDetails.text !== 'Ongoing'}
            style={{
              width: '35%',
              height: '250px',
              border: '1px solid rgba(6, 158, 252, 0.2)',
            }}
            buttonConfig={{
              isLoading: sub,
              loadingText: 'Casting Vote',
              text: 'Vote',
              theme: 'secondary',
            }}
            data={[
              {
                inputWidth: '100%',
                name: 'Cast Vote',
                options: ['For', 'Against'],
                type: 'radios',
                validation: {
                  required: true,
                },
              },
            ]}
            onSubmit={(e) => {
              if (e.data[0].inputResult[0] === 'For') {
                castVote(true);
              } else {
                castVote(false);
              }
              setSub(true);
            }}
            title="Cast Vote"
          />
        </div>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Proposal;
