import React from 'react';
import styled from 'styled-components';

import Avatar from 'src/components/Avatar';

const UserRow = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  filter: drop-shadow(0px 0px 1px rgba(12, 26, 75, 0.24));

  margin-top: 30px;
  display: flex;
  padding: 14px;

  .left {
    display: block;
    margin-right: 20px;
  }

  .right {
    display: block;

    .top {
      font-size: 16px;
      line-height: 162.02%;
      color: #425466;
    }

    .bottom {
      font-weight: normal;
      font-size: 13px;
      line-height: 162.02%;
      color: #425466;
    }
  }
`;

interface Props {
  session: ISessionItem;
}

const verifications = [
  {
    from: 'Darrel Steward',
    category: ' Personal Information 👤',
    time: '23 minutes ago',
    status: 'rejected',
    did: 'did:elastos:ie79E4EJnTxRocruhFggxLgTSHNTzyjugo'
  },
  {
    from: 'Darrel Steward',
    category: 'Educational Verification 🎓',
    time: '23 minutes ago',
    status: 'pending',
    did: 'did:elastos:iTREHdGzTXgWgaFmqPp5ttKQdDKDyu5SyP'
  },
  {
    from: 'Darrel Steward',
    category: 'Experience Verification 💼',
    time: '23 minutes ago',
    status: 'approved',
    did: 'did:elastos:iTREHdGzTXgWgaFmqPp5ttKQdDKDyu5SyP'
  }
];

const UserRows: React.FC<Props> = ({ session }: Props) => {
  const rednerUserRow = (
    category: string,
    from: string,
    status: string,
    did: string
  ) => {
    let statusColor = '#FF5A5A';
    if (status === 'approved') {
      statusColor = '#2FD5DD';
    } else if (status === 'pending') {
      statusColor = '#FF9840';
    }
    return (
      <UserRow>
        <div className="left">
          <Avatar did={did} width="50px" />
        </div>
        <div className="right">
          <p className="top">
            {verifications[0].category}{' '}
            <span style={{ fontWeight: 'bold' }}>sent to</span>{' '}
            {verifications[0].from}
          </p>
          <p className="bottom" style={{ display: 'flex' }}>
            23 minutes ago{' '}
            <li style={{ color: statusColor, marginLeft: ' 20px' }}>
              {status}
            </li>
          </p>
        </div>
      </UserRow>
    );
  };

  return (
    <>
      {verifications.map(v =>
        rednerUserRow(v.category, v.from, v.status, v.did)
      )}
    </>
  );
};

export default UserRows;
