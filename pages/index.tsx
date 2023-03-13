import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Event } from '@/types/models';
import { formatAmount } from '@/utils/formats';
import EventList from '@/components/EventList';
import clientPromise from '@/lib/mongodb';
import { appConfig } from '@/utils/appConfig';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DBNAME);

    const limit = context.query.limit || 10;
    const skip = context.query.skip || 0;
    const range = context.query.range || appConfig.defaultThreshold;

    const data = await db.collection('events')
      .find({ amount: { $gte: Number(range) } })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .toArray();

    return {
      props: {
        initialData: JSON.parse(JSON.stringify(data)),
        error: null
      }
    }
  } catch (error) {
    console.error("error:", error)
    return {
      props: {
        error: error || 'Something went wrong.'
      }
    }
  }
}

interface Props {
  initialData: Event[];
  error?: string;
}

const App = ({ initialData, error }: Props) => {
  if (error) {
    console.error("error:", error)
    toast.error(error)
  }
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(initialData.length);
  const [disableReload, setDisableReload] = useState(false);
  const [range, setRange] = useState(appConfig.defaultThreshold);
  // const [isLoading, setIsLoading] = useState(false)
  const limit = 10;

  const handleFilterSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // setIsLoading(true);
      toast.success('Loading data', { autoClose: 1000, pauseOnHover: false });

      setData([]);
      setLoaded(0);

      const response = await fetch(`/api/events?limit=${limit}&range=${range}&skip=${loaded}`);
      if (!response.ok) throw new Error('Bad request error');
      const newData = await response.json();

      setData(newData);
      setLoaded(newData.length);
      // setIsLoading(false);
      toast.success(`Loaded ${newData.length} latest events above ${formatAmount(String(range))}`);
      setDisableReload(true);
      setTimeout(() => setDisableReload(false), 5000);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    }
  };

  const handleLoadMore = async () => {
    try {
      // setIsLoading(true);
      toast.success('Loading data', { autoClose: 1000, pauseOnHover: false });

      const response = await fetch(`/api/events?limit=${limit}&range=${range}&skip=${loaded}`);
      if (!response.ok) throw new Error('Bad request error');
      const newData = await response.json();

      setData([...data, ...newData]);
      setLoaded(loaded + newData.length);
      // setIsLoading(false);
      toast.success(`Loaded ${newData.length} more events above ${formatAmount(String(range))}`);
      toast.success(`Total events loaded: ${loaded + newData.length}`);
      setDisableReload(true);
      setTimeout(() => setDisableReload(false), 5000);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <>
      <div className="relative py-3 lg mx-auto text-center">
        <div className="mt-4 bg-gray-900 shadow-md rounded text-left font-mono text-base">
          <div className="px-8 py-6 ">
            <form onSubmit={handleFilterSubmit}>
              <label htmlFor="range" className="block mt-4 font-medium text-gray-900 dark:text-white">Fetch TRX greater than {formatAmount(String(range))}</label>
              <input
                id="range"
                type="range"
                min={appConfig.defaultThreshold} max="1000000000" step="100000"
                value={range}
                onChange={e => setRange(Number(e.currentTarget.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex items-center">
                <button
                  type="submit"
                  disabled={disableReload}
                  className={`${disableReload ? 'bg-slate-500 hover:bg-slate-500 cursor-wait' : 'bg-green-500'} mt-4 text-white py-2 px-6 rounded hover:bg-green-600`}
                >
                  Fetch
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <EventList
        events={data}
        disableReload={disableReload}
        handleLoadMore={handleLoadMore}
      />
    </>
  );
}

export default App;
