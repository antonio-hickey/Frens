import { Filter, UnsignedEvent } from "nostr-tools";
import { useProfile } from "nostr-react";

import { useRef } from "react";


interface CreatePostCardProps {
	posterPK: string,
	posterSK: string,
	publishEvent: (event: UnsignedEvent) => void,
	getEvents: (filters: Filter[]) => void,
}

export default function CreatePostCard(props: CreatePostCardProps) {
	const {data: userData} = useProfile({pubkey: props.posterPK});
	const textArea = useRef<HTMLTextAreaElement | null>(null);

	return (
		<div className="divide-y divide-white overflow-hidden rounded-lg bg-gray-200 dark:bg-[#1a1a1a] shadow border border-dashed border-green-300">
  		<div 
				className="px-4 py-5 sm:px-6 hover:cursor-pointer text-lg hover:dark:bg-green-300/25 hover:!text-xl hover:cursor-pointer hover:underline hover:decoration-green-300"
				onClick={() => {
					const filter: Filter[] = [{
						kinds: [1],
						authors: [props.posterPK],
					}];
					props.getEvents(filter);
				}}
			>
				<div className="flex flex-row justify-between">
					<img className="inline-block h-8 w-8 rounded-full" src={userData?.picture} alt="" />
					<span className="font-bold text-gray-800 dark:text-gray-200">
						{userData?.name}
					</span>
					<span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
					  <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
					    <circle cx="3" cy="3" r="3" />
					  </svg>
						{props.posterPK?.slice(props.posterPK?.length - 6)}
					</span>
				</div>
  		</div>
  		<div className="px-4 py-5 sm:p-6">
  			<div className="mt-2">
    			<textarea 
						name="post" 
						id="post" 
						className="block w-full h-32 bg-gray-900/25 dark:bg-white/25 rounded-lg p-1.5 text-gray-900 text-xl shadow ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:leading-6 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
						placeholder="Type your post..."
						ref={textArea}
					></textarea>
					<button 
						className="mt-5 bg-green-100 text-green-700"
						onClick={() => {
							let newEvent = {
							  kind: 1,
							  created_at: Math.floor(Date.now() / 1000),
							  tags: [],
							  content: textArea?.current?.value!,
							  pubkey: props.posterPK, 
							}

							props.publishEvent(newEvent);
						}}
					>
						Publish
					</button>
  			</div>
  		</div>
		</div>
	)
}
