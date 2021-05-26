import { toast } from 'react-toastify';
import ToastBox from 'src/components/toast';
import React from 'react';

export const showNotify = (text: string, type = 'success') => {
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
