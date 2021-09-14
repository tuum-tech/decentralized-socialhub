import React, { useEffect, useState } from 'react';
import { IonSearchbar } from '@ionic/react';
import styled from 'styled-components';

import arrowLeft from 'src/assets/icon/arrow-left-square.svg';
import { SearchService } from 'src/services/search.service';
import { alertError } from 'src/utils/notify';
import Avatar from 'src/components/Avatar';
import { Container, NextButton } from './step1';

const UsersContainer = styled.div`
  ion-searchbar {
    padding: 0;
  }

  .usersContainer {
    max-height: 350px;
    overflow-y: auto;
  }

  .userRow {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 20px;

    &_info {
      flex-grow: 1;
      padding: 0 15px;

      .name {
        font-family: 'SF Pro Display';
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.56;
        letter-spacing: normal;
        text-align: left;
        color: #27272e;
      }
      .truncatedDID {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        font-family: 'SF Pro Display';
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.62;
        letter-spacing: normal;
        text-align: left;
        color: #979797;
      }
    }

    &_button {
      font-family: 'SF Pro Display';
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      font-size: 12px;

      padding: 0px 20px;
      height: 35px;

      background: white;
      border-radius: 9px;
      color: #4c6fff;
      border: 1px solid #4c6fff;
    }
  }
`;

interface Props {
  session: ISessionItem;
  selectedDids: string[];
  updateSelectedUserDids: (newDids: string[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

const UsersView = ({
  session,
  selectedDids,
  updateSelectedUserDids,
  onNext,
  onPrev
}: Props) => {
  const [filteredUsers, setFilteredUsers] = useState<PeopleDTO>({ items: [] });
  const [searchService, setSearchService] = useState(new SearchService());

  const getSearchAppHiveInstance = async (): Promise<SearchService> => {
    return SearchService.getSearchServiceAppOnlyInstance();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let searchService = await getSearchAppHiveInstance();
      setSearchService(searchService);
    })();
  }, []);

  const loadData = async () => {
    if (searchService.appHiveClient) {
      try {
        let listUsers: any = await searchService.getUsers('', 200, 0, session);
        setFilteredUsers(listUsers);
      } catch (e) {
        setFilteredUsers({ items: [] });
        alertError(null, 'Could not load users');
        return;
      }
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadData();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchService]);

  const invokeSearch = async (searchQuery: string) => {
    let listUsers: any = await searchService.getUsers(
      searchQuery,
      200,
      0,
      session
    );
    setFilteredUsers(listUsers);
  };

  useEffect(() => {
    (async () => {
      if (searchQuery !== '' && searchQuery.length > 2) {
        invokeSearch(searchQuery);
      } else if (searchQuery === '') {
        setSearchQuery('');
        setIsLoading(true);
        await loadData();
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const search = (e: any) => {
    setSearchQuery(e.detail.value!);
  };

  return (
    <Container>
      <img
        onClick={() => onPrev()}
        src={arrowLeft}
        alt="arrow-left"
        className="mb-1"
        width="20px"
      />
      <div className="title mb-2">Choose Verifiers</div>
      <div className="intro mb-2" style={{ color: 'black' }}>
        Select user(s) to verify your credentials
        <span style={{ color: 'red' }}>(max 3 users)</span>
      </div>
      <UsersContainer>
        <IonSearchbar
          value={searchQuery}
          onIonChange={e => search(e)}
          placeholder="Search people, pages by name or DID"
        ></IonSearchbar>
        <div className="usersContainer">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            filteredUsers.items.map(({ name, did }) => (
              <div className="userRow">
                <Avatar did={did} width="45px" />
                <div className="userRow_info">
                  <span className="name">{name}</span>
                  <br />
                  <span className="truncatedDID">{did}</span>
                </div>
                <button
                  className="userRow_button"
                  onClick={() => {
                    if (selectedDids.includes(did)) {
                      const newSelectedDids = selectedDids.filter(
                        sDid => sDid !== did
                      );
                      updateSelectedUserDids(newSelectedDids);
                    } else if (selectedDids.length < 3) {
                      const newSelectedDids = selectedDids.concat(did);
                      updateSelectedUserDids(newSelectedDids);
                    }
                  }}
                >
                  {selectedDids.includes(did) ? 'Remove' : 'Add'}
                </button>
              </div>
            ))
          )}
        </div>
      </UsersContainer>
      <NextButton
        style={{
          cursor: selectedDids.length === 0 ? 'not-allowed' : 'pointer'
        }}
        onClick={onNext}
        disabled={selectedDids.length === 0}
      >
        Continue
      </NextButton>
    </Container>
  );
};

export default UsersView;
