export const timeSince = (timestamp: any) => {
  let seconds = Math.floor((Date.now() - timestamp) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return Math.floor(seconds) + ' seconds ago';
};

export const DateString = (timestamp: any) => {
  let inputDate = new Date(timestamp);
  let todayDate = new Date();

  if (inputDate.setHours(0, 0, 0, 0) == todayDate.setHours(0, 0, 0, 0)) {
    return 'Today';
  }

  inputDate = new Date(timestamp + 86400 * 1000);

  if (inputDate.setHours(0, 0, 0, 0) == todayDate.setHours(0, 0, 0, 0)) {
    return 'Yesterday';
  }

  return new Date(timestamp).toDateString();
};
