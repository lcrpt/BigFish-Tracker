import type { AppProps } from 'next/app'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        closeOnClick={true}
        pauseOnHover={true}
        theme='dark'
      />

      <div className="bg-gray-100 font-sans leading-normal tracking-normal">
        <div className="container w-full md:max-w-3xl mx-auto pt-20 pb-20">
          <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal">
            <div className='flex justify-between'>
              <div className="font-sans">
                <Link href="/">
                  <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">Whale Tracker</h1>
                  <p className="text-sm md:text-base font-normal text-gray-600">All latest <span className="text-green-500">USDT</span> and <span className="text-blue-500">USDC</span> big moves (BETA)</p>
                </Link>
              </div>
            </div>
            <Component {...pageProps} />
          </div>
        </div>
      </div>

      <Analytics />
    </>
  )
}
