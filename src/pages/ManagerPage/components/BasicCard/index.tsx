import React, { useRef } from 'react';

import Card from 'src/elements-v2/Card';
import BasicCardConent from './BasicCardContent';
import Modal from 'src/elements-v2/Modal';
import { LinkStyleSpan } from 'src/components/cards/common';

interface IProps {
  sessionItem: ISessionItem;
  updateFunc: any;
  requestVerification: any;
}

const BasicCard: React.FC<IProps> = ({
  sessionItem,
  updateFunc,
  requestVerification
}: IProps) => {
  const modalRef = useRef(null);

  const handleEdit = () => {
    if(sessionItem.onBoardingCompleted) {
      (modalRef?.current as any).open();
    }
  };

  const closeModal = () => {
    (modalRef?.current as any).close();
  };

  return (
    <>
      <Card
        template="default"
        title="Basic Information"
        action={
          <LinkStyleSpan
            onClick={handleEdit}
            className={!sessionItem.onBoardingCompleted ? 'disable' : 'active'}
          >
            Edit
          </LinkStyleSpan>
        }
      >
        <BasicCardConent
          sessionItem={sessionItem}
          updateFunc={updateFunc}
          requestVerification={requestVerification}
        />
      </Card>
      <Modal
        title="Basic Information"
        okText="Save"
        autoWidth
        noButton
        ref={modalRef}
      >
        <BasicCardConent
          isEdit
          sessionItem={sessionItem}
          updateFunc={updateFunc}
          requestVerification={requestVerification}
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
};

export default BasicCard;
