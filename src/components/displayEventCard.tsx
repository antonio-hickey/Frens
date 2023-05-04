import { useProfile, useNostrEvents } from "nostr-react";
import { Filter, type Event, UnsignedEvent } from "nostr-tools";
import { useEffect, useState } from "react";
import { FcLike, FcDislike } from "react-icons/fc"


interface DisplayEventCardProps {
	pk: string | null,
	event: Event,
	showEvent: boolean,
	getEvents: (filters: Filter[]) => void,
	publishEvent: (event: UnsignedEvent, _sk?: string) => void,
}

export default function DisplayEventCard(props: DisplayEventCardProps) {
	const {data: userData} = useProfile({pubkey: props.event.pubkey});
	const [liked, setLiked] = useState<boolean>(false);
	const [disliked, setDisliked] = useState<boolean>(false);
	const reactions = useNostrEvents({
			filter: {
				"#e": [props.event.id],
				kinds: [7],
			},
	}).events;

	const getReactionCount = (reactions: Event[], reactionType: string): number => {
		let count: number = 0;
		for (let reaction of reactions) {
			if (reaction.content == reactionType) count++;
		}
		
		return count;
	}

	useEffect(() => {
		if (reactions) {
			for (let reaction of reactions) {
				if (reaction.pubkey == props.pk && reaction.content == "+") {
					setLiked(true);
				} else if (reaction.pubkey == props.pk && reaction.content == "-") {
					setDisliked(true);
				} else {
					setLiked(false);
					setDisliked(false);
				}
			}
		}
	}, [reactions])


	return (
		<div className="divide-y divide-white overflow-hidden rounded-lg bg-gray-200 dark:bg-[#1a1a1a] shadow border border-dashed border-green-300" hidden={props.showEvent ? true : false}>
  		<div 
				className="px-4 py-5 sm:px-6 hover:cursor-pointer text-lg hover:bg-green-300/25 hover:!text-xl hover:cursor-pointer hover:underline hover:decoration-green-300"
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
					<span className="font-bold text-gray-800 dark:text-gray-200">{userData?.name}</span>
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
  		<div 
				className="px-4 py-5 sm:px-6 text-lg"
			>
				<div className="flex flex-row justify-start space-x-1">
					<button className={disliked ? "bg-green-300/25 border border-white hover:bg-green-300/25" : "border border-white hover:bg-green-300/25"}
						onClick={() => {
							if (!props.pk) return;

							if (liked) setLiked(false);
							setDisliked(current => current ? false : true);

							props.publishEvent({
								kind: 7,
								content: "-",
							  created_at: Math.floor(Date.now() / 1000),
								tags: [
									["e", props.event.id],
									["p", props.event.pubkey],
								],
								pubkey: props.pk, 
							});
						}}
					>
						<div className="flex flex-row items-center space-x-2">
							<FcDislike className="h-5 w-5 hover:cursor-pointer"/>
							<span>
								{getReactionCount(reactions, "-")}
							</span>
						</div>
					</button>
					<button className={liked ? "bg-green-300/25 border border-white hover:bg-green-300/25" : "border border-white hover:bg-green-300/25"}
						onClick={() => {
							if (!props.pk) return;

							if (disliked) setDisliked(false);
							setLiked(current => current ? false : true);

							props.publishEvent({
								kind: 7,
								content: "+",
							  created_at: Math.floor(Date.now() / 1000),
								tags: [
									["e", props.event.id],
									["p", props.event.pubkey],
								],
								pubkey: props.pk, 
							});
						}}
					>
						<div className="flex flex-row items-center space-x-2">
							<FcLike className="h-5 w-5 hover:cursor-pointer"/>
							<span>{getReactionCount(reactions, "+")}</span>
						</div>
					</button>
				</div>
  		</div>
		</div>
	)
}
