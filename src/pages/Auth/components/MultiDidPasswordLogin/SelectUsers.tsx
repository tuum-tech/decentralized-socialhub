import React, { useEffect, useRef, useState } from 'react';

import Avatar from 'src/components/Avatar';
import DropDown from 'src/elements/arrows/DropDown';
import DropUp from 'src/elements/arrows/DropUp';
import { Trush, WhiteTrush } from 'src/elements/icons';

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
  openModal: () => void;
}

const SelectUser: React.FC<Props> = ({
  users,
  selectDID,
  removeUser,
  openModal
}) => {
  const [selectedItem, setSelectedItem] = useState(users[0]);
  const [showItems, setShowItems] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [disableSelect, setDisableSelect] = useState(false);

  useEffect(() => {
    setSelectedItem(users[0]);
  }, [users]);
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
              if (!disableSelect) {
                selectDID(user.did);
                setSelectedItem(user);
              }
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
              onMouseEnter={() => setDisableSelect(true)}
              onMouseLeave={() => setDisableSelect(false)}
            >
              <Trush />
            </div>
          </div>
        ))}

        <div
          onClick={() => {
            setShowItems(false);
            openModal();
          }}
          className={style['selectBox-items_row']}
        >
          <span className={style['clear-path']}>
            <WhiteTrush />
          </span>

          <div>
            <p className={style['name-clear']}>Clear All Data</p>
            <p className={style['did']}>
              This will remove all your past login credentials from the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectUser;
