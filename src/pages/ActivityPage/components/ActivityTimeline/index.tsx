import React, { useState, useEffect, useCallback } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonText,
  IonList,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

import { ProfileService } from 'src/services/profile.service';
import { DateString } from 'src/utils/time';
import ActivityRow from './ActivityRow';
import style from './style.module.scss';

const Group = styled.div``;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 10px 0px;
`;

interface Props {
  session: ISessionItem;
}
const ActivityTimeline: React.FC<Props> = ({ session }: Props) => {
  const perPage = 10;
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageOffset, setPageOffset] = useState(0);
  const [activityGroupComponents, setActivityGroupComponents] = useState<any[]>(
    []
  );

  const setTimerForActivity = useCallback(() => {
    const timer = setTimeout(async () => {
      // await refreshActivities();
      let _activities = await ProfileService.getActivity(session);
      _activities.sort(
        (a: any, b: any) => (b as any).createdAt - (a as any).createdAt
      );
      setActivities(_activities);
      setTotalPages(pageCount(_activities.length));
      setTimerForActivity();
    }, 3000);
    return () => clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    setTimerForActivity();
  }, [setTimerForActivity]);

  const pageCount = (activityCount: number) => {
    return (
      Math.floor(activityCount / perPage) + (activityCount % perPage ? 1 : 0)
    );
  };

  const handlePagination = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPageOffset(offset);
  };

  const handleMarkAllAsRead = useCallback(() => {
    let _activities = JSON.parse(JSON.stringify(activities));
    _activities.forEach(async (_activity: any) => {
      if (!_activity.read) {
        _activity.read = true;
        await ProfileService.updateActivity(_activity, session);
      }
    });
  }, [session, activities]);

  useEffect(() => {
    let groups: any[] = [];
    activities
      .slice(pageOffset, pageOffset + perPage)
      .forEach((activity, index) => {
        let caption = DateString((activity as any).createdAt);
        let gIndex = groups.findIndex(item => item.caption === caption);
        if (gIndex === -1) {
          groups.push({
            caption: caption,
            list: [activity]
          });
        } else {
          groups[gIndex].list!.push(activity);
        }
      });
    let _activityGroupComponents = groups.map((group, index) => {
      return (
        <Group className={style['activity-list-wrapper']} key={index}>
          <Header>
            <IonText className={style['time']}>{group.caption}</IonText>
            {index === 0 && (
              <IonText
                className={style['mark-all']}
                onClick={handleMarkAllAsRead}
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 15.5C11.866 15.5 15 12.366 15 8.5C15 4.63401 11.866 1.5 8 1.5C4.13401 1.5 1 4.63401 1 8.5C1 12.366 4.13401 15.5 8 15.5ZM8 16.5C12.4183 16.5 16 12.9183 16 8.5C16 4.08172 12.4183 0.5 8 0.5C3.58172 0.5 0 4.08172 0 8.5C0 12.9183 3.58172 16.5 8 16.5Z"
                    fill="#4C6FFF"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.9696 5.46967C11.2625 5.17678 11.7374 5.17678 12.0303 5.46967C12.3196 5.75897 12.3231 6.22582 12.0409 6.51947L8.04873 11.5097C8.04297 11.5169 8.03682 11.5238 8.03029 11.5303C7.7374 11.8232 7.26253 11.8232 6.96963 11.5303L4.32319 8.88388C4.03029 8.59099 4.03029 8.11612 4.32319 7.82322C4.61608 7.53033 5.09095 7.53033 5.38385 7.82322L7.47737 9.91674L10.9497 5.4921C10.9559 5.48424 10.9626 5.47674 10.9696 5.46967Z"
                    fill="#4C6FFF"
                  />
                </svg>
                &nbsp; Mark all as read
              </IonText>
            )}
          </Header>
          <IonList className={style['activity-list']}>
            {group.list.map((activity: any, index: any) => {
              return (
                <ActivityRow
                  activity={activity}
                  zIndex={group.list.length - index}
                  onRead={async () => {
                    activity.read = true;
                    await ProfileService.updateActivity(activity, session);
                  }}
                  key={index}
                />
              );
            })}
          </IonList>
        </Group>
      );
    });
    setActivityGroupComponents(_activityGroupComponents);
  }, [pageOffset, activities, handleMarkAllAsRead, session]);

  return (
    <IonCard className={style['timeline-card']}>
      <IonCardHeader className={style['card-header']}>
        <IonCardTitle className={style['card-title']}>
          Activities Timeline
        </IonCardTitle>
        <IonText className={style['selectinput']}>
          <IonLabel className={style['selectinput_label']}>Sort by</IonLabel>
          <IonSelect
            className={style['selectinput_field']}
            placeholder="Latest"
            onIonChange={e => e}
          >
            <IonSelectOption value={0}>Latest</IonSelectOption>
          </IonSelect>
        </IonText>
      </IonCardHeader>
      <IonCardContent>
        {activityGroupComponents}
        {activityGroupComponents && (
          <ReactPaginate
            previousLabel={'◀︎ Prev'}
            nextLabel={'Next ▶︎'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePagination}
            containerClassName={style['pagination']}
            //  subContainerClassName={'pages pagination'}
            activeClassName={style['page-active']}
          />
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityTimeline;
