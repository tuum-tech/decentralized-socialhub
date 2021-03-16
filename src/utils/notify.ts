import toastr from 'toastr';

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

  if (type === 'info') {
    toastr.info(text, 'Information', opts);
  } else if (type === 'success') {
    toastr.success(text, 'Success', opts);
  } else if (type === 'warning') {
    toastr.warning(text, 'Warning', opts);
  } else if (type === 'error') {
    toastr.error(text, 'warning', opts);
  }
};

export const alertError = (err: { message: string } | null, text: string) => {
  showNotify((err && err.message) || text, 'error');
};
