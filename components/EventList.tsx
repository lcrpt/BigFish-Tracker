import { Event } from '../types/models';
import EventItem from './EventItem';

interface Props {
  events: Event[];
  disableReload: boolean;
  handleLoadMore: any;
}

const EventList = ({ events, disableReload, handleLoadMore }: Props) => {
  return (
    <>
      {events.map(event => (
        <EventItem event={event} key={event.transactionHash} />
      ))}
      <button
        onClick={handleLoadMore}
        disabled={disableReload}
        className={`${disableReload ? 'bg-slate-500 hover:bg-slate-500 cursor-wait' : 'bg-gray-900'} mt-10 px-8 py-2 text-xs text-white hover:bg-gray-700 font-bold font-sans break-normal rounded`}
      >
        Load More
      </button>
    </>
  )
}

export default EventList;
