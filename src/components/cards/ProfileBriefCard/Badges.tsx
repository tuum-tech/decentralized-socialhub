import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import badgeDetails from 'src/data/badge_detail.json';
import { timeSince } from 'src/utils/time';

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Badge = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 10px;
`;

const ToolTip = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;

  color: #ffffff;

  padding: 5px 10px;
  background: #000000;

  box-shadow: 0px 4px 11px rgba(0, 0, 0, 0.18), 0px 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 7px;
  margin-top: 10px;

  width: 120px;

  position: absolute;
  bottom: -40px;
  left: -20px;
  text-align: center;

  z-index: 1000;
`;

interface Props {
  badges: IBadges;
  cb: (count: number) => void;
}
const Badges: React.FC<Props> = ({ badges, cb }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showBadgeNumber, setShowBadgeNumber] = useState(-1);
  const [archivedBadges, setArchivedBadges] = useState([]);

  const wSize = [1780, 1600, 1350, 1120];

  useEffect(() => {
    let _archivedBadges: any = [];
    if (!badges) return;
    Object.keys(badges!).forEach(category => {
      Object.keys((badges as any)[category]).forEach(name => {
        let archived;
        if ((archived = ((badges as any)[category] as any)[name].archived)) {
          _archivedBadges.push({
            category,
            name,
            archived
          });
        }
      });
    });
    _archivedBadges.sort((a: any, b: any) => b.archived - a.archived);
    setArchivedBadges(_archivedBadges);
    cb(_archivedBadges.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BadgeContainer>
      {archivedBadges.slice(0, 5).map((badge, index) => {
        const { category, name, archived } = badge;
        const { title, description, enbl_icon } = badgeDetails[category][name];
        const text = `${title} <br/> Achieved ${timeSince(archived)}`;
        return (
          <div
            style={{
              display: window.innerWidth > wSize[3 - index] ? 'block' : 'none'
            }}
            key={index}
          >
            <Badge data-for={title} data-tip={text} data-iscapture="true">
              <img alt="enable icon" src={enbl_icon} height={50} />
              {showBadgeNumber === index && (
                <ToolTip>
                  <p>{title}</p>
                  <p>{description}</p>
                </ToolTip>
              )}

              <ReactTooltip id={title} multiline={true} />
            </Badge>
          </div>
        );
      })}
    </BadgeContainer>
  );
};

export default Badges;
