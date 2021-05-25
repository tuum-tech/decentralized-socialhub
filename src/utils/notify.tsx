import toastr from 'toastr';
import { toast, Slide } from 'react-toastify';
import ToastBox from 'src/components/toast';
import React from 'react';

const SHOW_INTERVAL = 3000;

export const showNotify = (
  text: string,
  type = 'success',
  timeOut = SHOW_INTERVAL
) => {
  const opts: any = {
    closeButton: true,
    debug: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut
  };
  toast(
    <ToastBox
      text={text}
      title={type}
      type={type}
      onOK={() => {
        toast.dismiss();
      }}
    />
  );
};

export const alertError = (err: { message: string } | null, text: string) => {
  showNotify((err && err.message) || text, 'error');
};
