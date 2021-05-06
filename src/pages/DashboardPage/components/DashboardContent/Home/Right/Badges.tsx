import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Header, MainCard, CardTitle, ExploreAll } from './VerificationStatus';
import badgeDetails from 'src/data/badge_detail.json';

const BadgeContainer = styled.div`
  display: flex;
`;

const Badge = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
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
  exploreAll: () => void;
}
const Badges: React.FC<Props> = ({ badges, exploreAll }) => {
  const [showBadgeNumber, setShowBadgeNumber] = useState(-1);
  const [archivedBadges, setArchivedBadges] = useState([]);
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
    console.log(_archivedBadges);
    _archivedBadges.sort((a: any, b: any) => b.archived - a.archived);
    setArchivedBadges(_archivedBadges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainCard>
      <Header>
        <CardTitle>Badges</CardTitle>
        <ExploreAll
          onClick={() => {
            exploreAll();
          }}
        >
          Explore all
        </ExploreAll>
      </Header>
      <BadgeContainer>
        {archivedBadges.slice(0, 5).map((badge, index) => {
          const { category, name } = badge;
          const { title, description, enbl_icon } = badgeDetails[category][
            name
          ];
          return (
            <Badge
              onMouseEnter={() => setShowBadgeNumber(index)}
              onMouseLeave={() => setShowBadgeNumber(-1)}
              key={index}
            >
              <img alt="enable icon" src={enbl_icon} height={50} />
              {showBadgeNumber === index && (
                <ToolTip>
                  <p>{title}</p>
                  <p>{description}</p>
                </ToolTip>
              )}
            </Badge>
          );
        })}
      </BadgeContainer>
    </MainCard>
  );
};

export default Badges;
