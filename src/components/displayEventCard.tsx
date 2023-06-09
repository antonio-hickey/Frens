import { useProfile, useNostrEvents } from "nostr-react";
import { Filter, type Event, UnsignedEvent } from "nostr-tools";
import { FcLike, FcDislike } from "react-icons/fc";
import { FaRetweet } from "react-icons/fa";
import { BsChatRightQuote } from "react-icons/bs";
import { extractImageLinks } from "./../utils/parsing";
import RepostEventCard from "./repostEventCard";


interface DisplayEventCardProps {
	pk: string | null,
	event: Event,
	showEvent: boolean,
	getEvents: (filters: Filter[]) => void,
	getEvent: (filter: Filter) => Promise<Event | null | undefined>,
	publishEvent: (event: UnsignedEvent, _sk?: string) => void,
}

interface ReactionStats {
	nLikes: number,
	nDislikes: number,
	userLiked: boolean,
	userDisliked: boolean,
	userReposted: boolean,
}

export default function DisplayEventCard(props: DisplayEventCardProps) {
	function getReactionStats(reactions: Event[]): ReactionStats {
		let stats: ReactionStats = {nLikes: 0, nDislikes: 0, userLiked: false, userDisliked: false, userReposted: false};
		for (let i = 0; i < reactions.length; i++) {
			const { content, pubkey, kind } = reactions[i];
			if (["+", "🤙", "👍"].includes(content)) {
				stats.nLikes++;
				if (pubkey === props.pk) stats.userLiked = true;
			}

			else if (["-", "👎"].includes(content)) {
				stats.nDislikes++;
				if (pubkey === props.pk) stats.userDisliked = true;
			}

			else if (kind == 6) stats.userReposted = true;
		}	

		return stats;
	}
	
	const {data: userData} = useProfile({pubkey: props.event.pubkey});
	const reactionEvents = useNostrEvents({
			filter: {
				"#e": [props.event.id],
				kinds: [6, 7],
			},
	}).events;
	const {txtContent, imgLinks} = extractImageLinks(props.event.content);

	let {
		nLikes, nDislikes, 
		userLiked, userDisliked, userReposted
	}: ReactionStats = getReactionStats(reactionEvents);


	// If event is a simple repost
	if (props.event.kind == 6) {
		return <RepostEventCard 
			event={props.event}
			pk={props.pk}
			publishEvent={props.publishEvent}
			getEvents={props.getEvents}
			getEvent={props.getEvent}
			showEvent={props.showEvent}
			isQuotedRepost={false}
		/>
	}

	// If event is refrencing another event
	if (props.event.tags[0] && props.event.tags[0][0] == "e") {
			return <RepostEventCard 
				event={props.event}
				pk={props.pk}
				publishEvent={props.publishEvent}
				getEvents={props.getEvents}
				getEvent={props.getEvent}
				showEvent={props.showEvent}
				isQuotedRepost={true}
			/>
	}


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
					<span className="text-lg text-gray-800 dark:text-gray-200">{txtContent}</span>					
					{imgLinks ? (
						//image link found
						imgLinks.map((imgLink, i) => {
							return <img src={imgLink} key={i}></img>
						})
					):
						// no img link found so just return nothing
						null
					}
  			</div>
  		</div>
  		<div 
				className="px-4 py-5 sm:px-6 text-lg"
			>
				<div className="flex flex-row justify-between">
					<div className="flex flex-row justify-start space-x-1">
						<button className={userDisliked ? "bg-green-300/25 border border-white hover:bg-green-300/25" : "bg-black/25 dark:bg-white/25 border border-white hover:bg-green-300/25 hover:dark:bg-green-300/75"}
							onClick={() => {
								if (!props.pk) return;

								if (userLiked) userLiked = false;
								userDisliked = userDisliked ? false : true;

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
								<span className={userDisliked ? "text-green-700 dark:text-white" : "text-white"}>
									{nDislikes}
								</span>
							</div>
						</button>
						<button className={userLiked ? "bg-green-300/25 border border-white hover:bg-green-300/25" : "bg-black/25 dark:bg-white/25 border border-white hover:bg-green-300/25 hover:dark:bg-green-300/75"}
							onClick={() => {
								if (!props.pk) return;

								if (userDisliked) userDisliked = false;
								userLiked = userLiked ? false : true;

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
								<span className={userLiked ? "text-green-700 dark:text-white" : "text-white"}>{nLikes}</span>
							</div>
						</button>
					</div>
					<div className="flex flex-row justify-start space-x-1">
						<button className={userReposted ? "bg-green-300/25 border border-white hover:bg-green-300/25" : "bg-black/25 dark:bg-white/25 border border-white hover:bg-green-300/25"}
							onClick={() => {
								if (!props.pk) return

								props.publishEvent({
									kind: 6,
									content: JSON.stringify(props.event),  // for quick lookup
									created_at: Math.floor(Date.now() / 1000),
									pubkey: props.pk,
									tags: [
										["e", props.event.id],
										["p", props.event.pubkey],
									],
								});
							}}
						>
							<div className="flex flex-row items-center">
								<FaRetweet className="h-5 w-5 hover:cursor-pointer text-green-300"/>
							</div>
						</button>
						<button className="bg-black/25 dark:bg-white/25 border border-white hover:bg-green-300/25"
							onClick={() => {
								if (!props.pk) return

								props.publishEvent({
									kind: 1,
									content: "quoted reply to event: " + props.event.id,  // empty for now gotta build ui/ux to get user input
									created_at: Math.floor(Date.now() / 1000),
									pubkey: props.pk,
									tags: [
										["e", props.event.id],
										["p", props.event.pubkey],
									],
								});
							}}
						>
							<div className="flex flex-row items-center">
								<BsChatRightQuote className="h-5 w-5 hover:cursor-pointer text-green-300"/>
							</div>
						</button>
					</div>
				</div>
  		</div>
		</div>
	)
}
