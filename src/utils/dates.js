import moment from 'moment';
import 'moment/locale/da';
import 'moment-timezone';

export const convertEpochSecondsToDateString = (
  epochSeconds,
  format = 'D/MMMM-YYYY HH:mm',
  timezone = 'Europe/Copenhagen',
) => {
  console.log('timezone ------------', timezone);
  moment.locale('da');
  return moment(epochSeconds * 1000)
    .tz(timezone)
    .format(format);
};

export const fromNow = epochSeconds => {
  return moment(epochSeconds * 1000).fromNow();
};

export const dayDiff = epochSeconds => {
  const epoch = epochSeconds * 1000;
  return moment(epoch).diff(moment(new Date()), 'days');
};
