import React from 'react';
import { MenuIcon } from '../LeftSideMenu/components/icons';
import GradientText from 'src/elements-v2/buttons/GradientText';
import ColorText from 'src/elements-v2/buttons/ColorText';

interface ITabButtonContentProps {
  name: string;
  active: boolean;
  handleClick: () => void;
  children: React.ReactNode;
}

const TabButtonContent = ({
  name,
  active,
  handleClick,
  children
}: ITabButtonContentProps) => {
  return (
    <div onClick={handleClick}>
      <MenuIcon name={name} active={active} customStyle={{ marginBottom: 6 }} />
      {active ? (
        <GradientText>{children}</GradientText>
      ) : (
        <ColorText color="#425466">{children}</ColorText>
      )}
    </div>
  );
};

export default TabButtonContent;
