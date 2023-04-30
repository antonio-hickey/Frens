import { useProfile } from "nostr-react";
import { type Event } from "nostr-tools";


interface DisplayEventCardProps {
	event: Event
}

export default function DisplayEventCard(props: DisplayEventCardProps) {
	const {data: userData} = useProfile({pubkey: props.event.pubkey});

	return (
		<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-[#1a1a1a] shadow">
  		<div className="px-4 py-5 sm:px-6">
				<div className="flex flex-row justify-between">
					<img className="inline-block h-8 w-8 rounded-full" src={userData?.picture} alt="" />
					<span className="text-lg font-bold text-gray-200">{userData?.name}</span>
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
