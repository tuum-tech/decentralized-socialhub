import React, { useEffect, useRef, useState } from 'react';

import Avatar from 'src/components/Avatar';
import DropDown from 'src//components/arrows/DropDown';
import DropUp from 'src//components/arrows/DropUp';
import { Trush } from 'src/components/icons';

import style from './style.module.scss';

interface UserType {
  avatar: string;
  name: string;
  did: string;
}

interface Props {
  users: UserType[];
  selectDID: (did: string) => void;
  removeUser: (did: string) => void;
}

const SelectUser: React.FC<Props> = ({ users, selectDID, removeUser }) => {
  const [selectedItem, setSelectedItem] = useState(users[0]);
  const [showItems, setShowItems] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowItems(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className={style['selectBox-box']} ref={wrapperRef}>
      <div
        className={style['selectBox-container']}
        style={{
          borderBottomLeftRadius: showItems ? '0' : '6px',
          borderBottomRightRadius: showItems ? '0' : '6px'
        }}
      >
        <div
          className={style['selectBox-selected-item']}
          onClick={() => setShowItems(!showItems)}
        >
          <Avatar did={selectedItem.did} width="53px" />
          <div>
            <p className={style['name']}>{selectedItem.name}</p>
            <p className={style['did']}>{selectedItem.did}</p>
          </div>
          <div className={style['selectBox-arrow']}>
            {showItems ? <DropUp /> : <DropDown />}
          </div>
        </div>
      </div>

      <div
        style={{ display: showItems ? 'block' : 'none' }}
        className={style['selectBox-items']}
      >
        {users.map((user: UserType) => (
          <div
            key={user.did}
            onClick={() => {
              selectDID(user.did);
              setSelectedItem(user);
              setShowItems(false);
            }}
            className={style['selectBox-items_row']}
          >
            <Avatar did={user.did} width="53px" />
            <div>
              <p className={style['name']}>{user.name}</p>
              <p className={style['did']}>{user.did}</p>
            </div>
            <div
              className={style['trush']}
              onClick={() => removeUser(user.did)}
            >
              <Trush />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectUser;
