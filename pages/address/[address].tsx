import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next';
import { Event } from '@/types/models';
import EventList from '@/components/EventList';
import clientPromise from '@/lib/mongodb';
import { appConfig } from '@/utils/appConfig';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DBNAME);

    const limit = context.query.limit || 2;
    const skip = context.query.skip || 0;
    const address = context.query.address;

    if (!address) throw new Error('Wrong Request missing the address');

    const data = await db.collection('events')
      .find({ $or: [{ from: address }, { to: address }] })
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

const AddressEvents = ({ initialData, error }: Props) => {
  if (error) {
    console.error("error:", error)
    toast.error(error)
  }

  const router = useRouter();
  const { address } = router.query;
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(initialData.length);
  const [disableReload, setDisableReload] = useState(false);
  const [range, setRange] = useState(appConfig.defaultThreshold);
  const [isLoading, setIsLoading] = useState(false)
  const limit = 10;

  const handleLoadMore = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/events?limit=${limit}&range=${range}&skip=${loaded}&address=${address}`);
    const newData = await response.json();

    setData([...data, ...newData]);
    setLoaded(loaded + newData.length);
    setIsLoading(false);
    setDisableReload(true);
    setTimeout(() => setDisableReload(false), 5000);
  };

  const loadEvents = async () => {
    const response = await fetch(`/api/events?limit=${limit}&range=${range}&skip=${loaded}&address=${address}`);
    const newData = await response.json();

    setData(newData);
    setLoaded(newData.length);
    setIsLoading(false);
    setDisableReload(true);
    setTimeout(() => setDisableReload(false), 5000);
  }

  useEffect(() => {
    setIsLoading(true);
    loadEvents();
  }, [limit, address]);
  
  return (
    <>
      <div className="relative py-3 lg mx-auto text-center">
        <div className="mt-4 bg-gray-900 shadow-md rounded text-left font-mono text-base">
          <div className="px-8 py-6 ">
            <p className="block mt-2 font-medium text-gray-900 dark:text-white">Events of: {address}</p>
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

export default AddressEvents;
