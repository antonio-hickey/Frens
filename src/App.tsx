import { useState, useEffect } from "react";
import { 
	getPublicKey, relayInit, Event, 
	getEventHash, signEvent, Relay, 
	UnsignedEvent, Filter,
} from 'nostr-tools';

import './App.css';
import CreatePostCard from "./components/createPostCard";
import DisplayEventCard from "./components/displayEventCard";
import AuthCard from "./components/authCard";
import CreatedAccModal from "./components/createdAccModal";
import EventLoader from "./components/eventLoader";
import RelayCtrlCard from "./components/relayCtrlCard";
import { RELAYS } from "./utils/constants";


function App() {
	const [showKeysModal, setShowKeysModal] = useState<boolean>(false);
	const [showEventsLoader, setShowEventsLoader] = useState<boolean>(true);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [events, setEvents] = useState<Event[]>([]);
	const [curRelayName, setCurRelayName] = useState<string>("wss://relay.damus.io");
	const [relay, setRelay] = useState<Relay | null>(null);
	const [sk, setSk] = useState<string | null>(null);
	const [pk, setPk] = useState<string | null>(sk ? getPublicKey(sk) : null);

	useEffect(() => {
		const connectRelay = async () => {
			setShowEventsLoader(true);
			const relay = relayInit(curRelayName);
			await relay.connect();

			relay.on("connect", async () => {
				setRelay(relay);
				const events: Event[] = await relay.list([{kinds: [1], limit: 100}]);
				setEvents(events);

				setTimeout(() => {
					setShowEventsLoader(false);
				}, 1000);
			})
			relay.on("error", () => {
				console.log('failed to connect to relay')
			})
		};
		connectRelay();

		if (sk && !isLoggedIn) {
			setPk(getPublicKey(sk))
			setIsLoggedIn(true)
		}
	}, [sk, pk, curRelayName]);

	const createEvent = (unsignedEvent: UnsignedEvent, sk: string): Event => {
		const eventHash = getEventHash(unsignedEvent);
		const signature = signEvent(unsignedEvent, sk);
		return {
			...unsignedEvent,
			id: eventHash,
			sig: signature,
		}
	}

	const publishEvent = (event: UnsignedEvent, _sk?: string) => {
		console.log(event, _sk)
		const signedEvent = createEvent(event, _sk ? _sk : sk ? sk : "");
		const pub = relay?.publish(signedEvent);
		pub?.on("ok", () => {
			setIsLoggedIn(true);
		});
		pub?.on("failed", (reason: string) => {
			console.log(reason);
		})
	}

	const getEvents = async (filters: Filter[]) => {
		let events = await relay?.list(filters);
		if (events) setEvents(events);
	}


  return (
		<div className="w-screen h-screen dark:bg-[#242424]">
			<div className="flex flex-col w-screen">
				<div className="flex flex-row w-screen h-10">
      		<div className="flex w-full flex-col items-center justify-center">
      		  <div className="relative mb-8 text-4xl md:text-6xl font-bold text-green-200 dark:text-gray-200 hover:cursor-pointer hover:underline hover:decoration-green-300"
							onClick={async () => {
								if (relay) setEvents(await relay.list([{kinds: [1], limit: 100}]))
							}}
						>
      		    Frens
      		    <sup className="absolute top-0 left-full text-base text-gray-400 dark:text-green-300">
      		      :)
      		    </sup>
      		  </div>
					</div>
				</div>
				
				<div className="flex flex-row h-screen">
					<div className="flex flex-col w-2/6 h-screen p-5 space-y-4">
						{relay && sk && pk ? <CreatePostCard 
							posterPK={pk}  
							posterSK={sk}  
							publishEvent={publishEvent}
							getEvents={getEvents}
						/>: relay && !sk ? 
								<AuthCard 
									setSk={setSk} 
									publishEvent={publishEvent} 
									setShowKeysModal={setShowKeysModal}
								/>
							: <></>}

						<RelayCtrlCard relays={RELAYS} curRelayName={curRelayName} setRelay={setCurRelayName}/>
					</div>
					<div 
						className="flex flex-col w-4/6 p-5 max-h-full overflow-scroll space-y-4"
						onScroll={() => {
							// TODO: Implement fetching new/older events while scrolling ("infinite" content scroll)
						}}
					>

						{showEventsLoader && (
							<EventLoader />
						)}

						{events && (
							<div className="flex flex-col space-y-4">
								{events.map((event, i) => {
									return <DisplayEventCard 
														pk={pk ? pk : null} 
										        event={event} 
										        getEvents={getEvents} 
										        key={i} 
										        showEvent={showEventsLoader}
														publishEvent={publishEvent}		
									/>
								})}
							</div>
						)}
					</div>
					{sk && pk && showKeysModal ? <CreatedAccModal sk={sk} pk={pk} setShowKeysModal={setShowKeysModal}/>: <></>}
				</div>
			</div>
		</div>
  )
}

export default App
