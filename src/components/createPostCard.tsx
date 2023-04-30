import { Event } from "nostr-tools";
import { useRef } from "react";

interface CreatePostCardProps {
	posterPK: string,
	posterSK: string,
	posterPicUrl: string,
	posterName: string,
	publishEvent: (event: Event) => void,
}

export default function CreatePostCard(props: CreatePostCardProps) {
	const textArea = useRef<HTMLTextAreaElement | null>(null);
	return (
		<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-[#1a1a1a] shadow">
  		<div className="px-4 py-5 sm:px-6">
				<div className="flex flex-row justify-between">
					<img className="inline-block h-8 w-8 rounded-full" src={props.posterPicUrl} alt="" />
					<span className="text-lg font-bold text-gray-200">{props.posterName}</span>
					<span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
					  <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
					    <circle cx="3" cy="3" r="3" />
					  </svg>
						{props.posterPK.slice(props.posterPK.length - 6)}
					</span>
				</div>
  		</div>
  		<div className="px-4 py-5 sm:p-6">
  			<div className="mt-2">
    			<textarea 
							name="comment" 
							id="comment" 
							className="block w-full h-32 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
							  content: textArea?.current?.value,
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
