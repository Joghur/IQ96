import moment from 'moment';
import 'moment/locale/da';
import 'moment/locale/fi';

export const convertEpochSecondsToDateString = (
  epochSeconds,
  format = 'D/MMMM-YYYY h:mm',
  locale = 'da',
) => {
  moment.locale(locale);
  return moment(epochSeconds * 1000).format(format);
};
