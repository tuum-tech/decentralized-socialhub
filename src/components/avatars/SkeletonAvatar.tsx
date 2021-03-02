import React from 'react';

interface Props {
  fill?: string;
}

const SkeletonAvatar: React.FC<Props> = ({ fill = '#EDF2F7' }) => {
  return (
    <svg
      width='0'
      height='0'
      viewBox='0 0 77 73'
      fill='none'
      display=''
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <clipPath id='avatarClip'>
          <path
            d='M68.0682 65.6342C56.3607 74.6944 19.8063 74.6944 8.33844 65.6342C-3.369 56.5739 -2.17392 17.8393 8.33844 7.64541C18.8508 -2.54847 57.5558 -2.54847 68.0682 7.64541C78.5805 17.8393 79.7743 56.5739 68.0682 65.6342Z'
            fill={fill}
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SkeletonAvatar;
