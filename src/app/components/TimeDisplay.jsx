
import { formatLocalTime, timeAgo } from '@/libs/utils/utils';

const TimeDisplay = ({ utcDate, showAgo = true }) => {
  if (!utcDate) return <span>Nuevo</span>;
  
  return (
    <span title={formatLocalTime(utcDate)}>
      {showAgo ? timeAgo(utcDate) : formatLocalTime(utcDate)}
    </span>
  );
};

export default TimeDisplay;