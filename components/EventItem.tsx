import React from 'react';
import moment from 'moment';
import { Event } from '../types/models';
import { formatAmount } from '../utils/formats';
import Link from 'next/link';

interface Props {
	event: Event
}

const formatAddress = (address: string) => `${address.slice(0, 5)}..${address.slice(address.length -10)}`;

const EventItem: React.FC<Props> = ({ event }) => {
	const color = (symbol: string) => symbol === 'USDT' ? 'text-green-500' : 'text-blue-500';

	return (
		<>
			<p className="pt-6 pb-2">{event.eventType} of {formatAmount(event.amount)} <span className={color(event.symbol)}>{event.symbol}</span>, {moment(event.createdAt).fromNow()}</p>

			<pre className="bg-gray-900 rounded text-white font-mono text-base p-2 md:p-4">

				<code className="break-words whitespace-pre-wrap">
					<>
						<b>name:</b> {event.name} <br />
						<b>event:</b> {event.eventType} <br />
						<b>amount:</b> {formatAmount(event.amount)} {event.symbol}<br />
						<b>from:</b> <Link href={`/address/${event.from}`} className={color(event.symbol)}>{formatAddress(event.from)}</Link> <br />
						<b>to:</b> <Link href={`/address/${event.to}`} className={color(event.symbol)}>{formatAddress(event.to)}</Link> <br />
						<b>Block:</b> {event.blockNumber} <br />
						<b>Date:</b> {moment(event.createdAt).format('D/M/Y h:mm:ss a')} <br />
						<b>TRX: </b>
						<a href={event.blockExplorerLink}
							target="_blank"
							rel="noreferrer"
							className={`text-base md:text-sm no-underline hover:underline ${color(event.symbol)}`}
						>
							{formatAddress(event.transactionHash)}
						</a>
						<br />
					</>
				</code>
			</pre>

			<div className="text-base md:text-sm text-gray-900 px-4 py-4">
				Links: <a
					href={event.blockExplorerLink}
					target="_blank"
					rel="noreferrer"
					className={`text-base md:text-sm no-underline hover:underline ${color(event.symbol)}`}>
					Etherscan
				</a> |
				<Link
					href={`/address/${event.from}`}
					className={`text-base md:text-sm no-underline hover:underline pl-2 ${color(event.symbol)}`}>
					From: TRX List
				</Link> |
				<Link
					href={`/address/${event.to}`}
					className={`text-base md:text-sm no-underline hover:underline pl-2 ${color(event.symbol)}`}>
					To: TRX List
				</Link>
			</div>
		</>
	)
}

export default EventItem;