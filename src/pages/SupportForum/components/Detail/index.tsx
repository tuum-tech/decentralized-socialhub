import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonSearchbar } from '@ionic/react';
import styled from 'styled-components';

import LeftArrow from 'src/elements/arrows/LeftArrow';
import SelectInput from 'src/elements/inputs/SelectInput';
import { timeSince } from 'src/utils/time';

import TextareaInput from 'src/elements/inputs/TextareaInput';
import { DefaultButton } from 'src/elements/buttons';
import { TableContent, Category } from '../common';

interface DetailProp {
  githubIssue: any;
}

const TopBar = styled.div`
  display: flex;
  align-items: center;
  background: #17171b;
  padding: 20px 12.5%;
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

    .vote {
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
  }
`;

const Containr = styled.div`
  padding: 25px 12.5%;
  position: relative;
`;

const Detail: React.FC<DetailProp> = ({ githubIssue }) => {
  return (
    <>
      <TopBar>
        <LeftArrow fill="#cbd5e0" />
        <p>Back Home</p>
      </TopBar>
      <Containr>
        <Issue>
          <p className="title">{githubIssue.title}</p>
          <div className="metadata">
            <span className="timesince">
              Posted: {timeSince(new Date(githubIssue.updated_at).getTime())}
            </span>
            <span className="category">
              <Category>Bug</Category>
            </span>
            <span className="vote">1234 votes</span>
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
                value={''}
                onChange={() => {}}
                placeholder="Enter your message here"
              ></TextareaInput>
              <DefaultButton
                width="100px"
                onClick={() => {}}
                color="#FFFFFF"
                bgColor="#4C6FFF"
              >
                Share
              </DefaultButton>
            </div>
          </div>
        </Issue>
        <TableContent></TableContent>
      </Containr>
    </>
  );
};

export default Detail;
