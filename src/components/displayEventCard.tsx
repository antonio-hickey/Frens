import { useProfile } from "nostr-react";
import { Filter, type Event } from "nostr-tools";


interface DisplayEventCardProps {
	event: Event
	getEvents: (filters: Filter[]) => void,
}

export default function DisplayEventCard(props: DisplayEventCardProps) {
	const {data: userData} = useProfile({pubkey: props.event.pubkey});

	return (
		<div className="divide-y divide-white overflow-hidden rounded-lg bg-gray-200 dark:bg-[#1a1a1a] shadow border border-dashed border-green-300">
  		<div 
				className="px-4 py-5 sm:px-6 hover:cursor-pointer text-lg hover:dark:bg-green-300/25 hover:!text-xl hover:cursor-pointer hover:underline hover:decoration-green-300"
				onClick={() => {
					const filter: Filter[] = [{
						kinds: [1],
						authors: [props.event.pubkey],
					}];
					props.getEvents(filter);
				}}
			>
				<div className="flex flex-row justify-between">
					<img 
						className="inline-block h-8 w-8 rounded-full" 
						src={userData?.picture} 
						alt=""
					/>
					<span className="font-bold text-gray-200">{userData?.name}</span>
					<span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
					  <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
					    <circle cx="3" cy="3" r="3" />
					  </svg>
						{props.event.pubkey.slice(props.event.pubkey.length - 6)}
					</span>
				</div>
  		</div>
  		<div className="px-4 py-5 sm:p-6">
  			<div className="mt-2">
					<span className="text-lg">{props.event.content}</span>					
  			</div>
  		</div>
		</div>
	)
}
