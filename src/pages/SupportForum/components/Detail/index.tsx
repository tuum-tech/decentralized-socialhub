import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonList, IonItem, IonLabel, IonAvatar } from '@ionic/react';
import styled from 'styled-components';

import { TuumTechScriptService } from 'src/services/script.service';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';

import LeftArrow from 'src/elements/arrows/LeftArrow';
import { timeSince } from 'src/utils/time';
import { showNotify } from 'src/utils/notify';

import TextareaInput from 'src/elements/inputs/TextareaInput';
import { DefaultButton } from 'src/elements/buttons';
import { TableContent, Category } from '../common';

import voteIcon from 'src/assets/icon/arrow-up-filled.svg';
import defaultAvatar from 'src/assets/icon/dp.png';

interface DetailProp {
  githubIssue: any;
  githubIssues: any[];
  userSession: ISessionItem;
}

const TopBar = styled.div`
  background: #17171b;
  padding: 20px 12.5%;
  a {
    display: flex;
    align-items: center;
  }
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 21.06px;

    color: #cbd5e0;
    margin-left: 4px;
  }
`;

const Issue = styled.div`
  p.title {
    font-weight: 700;
    font-size: 36px;
    line-height: 48.97px;

    color: #2d3748;

    margin-bottom: 15px;
  }
  .metadata {
    display: flex;
    align-items: center;

    margin-bottom: 20px;
    span {
      margin-right: 20px;
    }
    .timesince {
      font-size: 14px;
      line-height: 20px;

      color: #425466;
    }
    .category {
      display: flex;
      align-items: center;
    }
    .vote {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .description {
    p {
      font-weight: 600;
      color: #27272e;
    }
    font-size: 16px;
    line-height: 25.92px;

    margin-bottom: 30px;
  }
  .comment {
    padding: 20px 0px;
    border-top: 1px solid #cbd5e0;
    border-bottom: 1px solid #cbd5e0;
    .input-area {
      p {
        font-size: 20px;
        line-height: 27.3px;
        font-weight: 600;
      }
      ion-textarea {
        background: #edf2f7;
        margin-bottom: 15px;
      }
    }
    .comment-history {
      margin-top: 30px;
    }
  }
`;

const ExploreBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  h3 {
    color: #2d3748;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
  }
  a {
    color: #4c6fff;
    font-size: 16px;
    line-height: 162.02%;
  }
`;
const Containr = styled.div`
  padding: 25px 12.5%;
  position: relative;
`;

const Detail: React.FC<DetailProp> = ({
  githubIssue,
  githubIssues,
  userSession
}) => {
  const [comment, setComment] = useState<string>('');
  const [commentList, setCommentList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let userService = new UserService(new DidService());
      const commentsInTuumTech = await TuumTechScriptService.getGithubCommentsByIssueId(
        githubIssue.number
      );
      const _commentList = await Promise.all(
        commentsInTuumTech.map(async (itr: any) => {
          const commentOwner = await userService.SearchUserWithDID(itr.did);
          return {
            owner: {
              name: commentOwner.name,
              avatar: commentOwner.avatar || defaultAvatar
            },
            timeSince: timeSince(itr.created.$date),
            content: itr.comment
          };
        })
      );
      setCommentList(_commentList);
    })();
  }, [githubIssue]);

  const handleAddComment = async () => {
    const params: IGithubCommentItem = {
      githubIssueId: githubIssue.number,
      did: userSession.did,
      comment: comment,
      createdAt: new Date().getTime()
    };
    const response = await TuumTechScriptService.addGithubComment(params);
    if (response.data && response.data._status === 'OK') {
      setComment('');
      setCommentList([
        ...commentList,
        {
          owner: {
            name: userSession.name,
            avatar: userSession.avatar || defaultAvatar
          },
          timeSince: timeSince(new Date().getTime()),
          content: comment
        }
      ]);
      showNotify('Add comment succeed', 'success');
    } else {
      showNotify('Add comment failed', 'error');
    }
  };

  const onInputComment = (text: string) => {
    setComment(text);
  };

  return (
    <>
      <TopBar onClick={() => {}}>
        <Link to="/support-forum">
          <LeftArrow fill="#cbd5e0" />
          <p>Back Home</p>
        </Link>
      </TopBar>
      <Containr>
        <Issue>
          <p className="title">{githubIssue.title}</p>
          <div className="metadata">
            <span className="timesince">
              Posted: {timeSince(new Date(githubIssue.updated_at).getTime())}
            </span>
            <span className="category">
              {githubIssue.labels.map((label: any) => {
                return <Category label={label.name}>{label.name}</Category>;
              })}
            </span>
            <span className="vote">
              <img src={voteIcon} width="15" alt="vote" />
              1234 votes
            </span>
            <span className=""></span>
          </div>
          <div className="description">
            <p>Description</p>
            {githubIssue.body}
          </div>

          <div className="comment">
            <div className="input-area">
              <p>Share your thoughts</p>
              <TextareaInput
                label=""
                cols={10}
                rows={6}
                value={comment}
                onChange={onInputComment}
                placeholder="Enter your message here"
              ></TextareaInput>
              <DefaultButton
                width="100px"
                onClick={handleAddComment}
                color="#FFFFFF"
                bgColor="#4C6FFF"
              >
                Share
              </DefaultButton>
            </div>
            <div className="comment-history">
              <IonList>
                {commentList.map((comment, index) => {
                  return (
                    <CommentItem key={index}>
                      <IonAvatar slot="start">
                        <img src={comment.owner.avatar} alt="profile" />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{comment.owner.name}</h2>
                        <h3>{comment.content}</h3>
                        <p>{comment.timeSince}</p>
                      </IonLabel>
                    </CommentItem>
                  );
                })}
              </IonList>
            </div>
          </div>
        </Issue>
        <ExploreBar>
          <h3>Explore more topics</h3>
          <Link to="/support-forum">Explore all</Link>
        </ExploreBar>
        <TableContent>
          <div className="table-head">
            <div className="topic">Topic</div>
            <div className="category">Category</div>
            <div className="votes">Votes</div>
            <div className="date">DATE</div>
          </div>
          {githubIssues.map((issue, index) => {
            const linkUrl = '/support-forum/' + issue.number;
            return (
              <div className="table-row" key={index}>
                <div className="topic">
                  <Link to={linkUrl}>{issue.title}</Link>
                </div>
                <div className="category">
                  {issue.labels.map((label: any) => {
                    return <Category label={label.name}>{label.name}</Category>;
                  })}
                </div>
                <div className="votes">994 Votes</div>
                <div className="date">
                  {timeSince(new Date(issue.updated_at).getTime())}
                </div>
              </div>
            );
          })}
        </TableContent>
      </Containr>
    </>
  );
};

const CommentItem = styled(IonItem)`
  display: flex;
  align-items: center;
  --border-color: #ffffff;

  ion-label {
    h2 {
      color: #27272e;
      font-weight: bold;
      font-size: 13px;
      line-height: 162.02%;
    }
    h3 {
      olor: #27272e;
      font-size: 16px;
      line-height: 162.02%;
    }
    p {
      font-size: 13px;
      line-height: 162.02%;
    }
  }
`;

export default Detail;
