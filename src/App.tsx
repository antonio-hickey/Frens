import { 
	getPublicKey, relayInit, Event, 
	getEventHash, signEvent, Relay, UnsignedEvent,
} from 'nostr-tools';
import { useState, useEffect } from "react";
import './App.css';
import CreatePostCard from "./components/createPostCard";
import DisplayEventCard from "./components/displayEventCard";
import AuthCard from "./components/authCard";
import CreatedAccModal from "./components/createdAccModal";



export const RELAYS = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];


function App() {
	const [showKeysModal, setShowKeysModal] = useState<boolean>(false);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [events, setEvents] = useState<Event[]>([]);
	const [relay, setRelay] = useState<Relay | null>(null);
	const [sk, setSk] = useState<string | null>(null);
	const [pk, setPk] = useState<string | null>(sk ? getPublicKey(sk) : null);

	useEffect(() => {
		const connectRelay = async () => {
			const relay = relayInit('wss://relay.damus.io');
			await relay.connect();

			relay.on("connect", () => {
				setRelay(relay);
			})
			relay.on("error", () => {
				console.log('failed to connect to relay')
			})
		}
		connectRelay();

		console.log(isLoggedIn)
		console.log(pk)
		if (sk && !isLoggedIn) {
			setPk(getPublicKey(sk))
			setIsLoggedIn(true)
		}
	}, [sk, pk]);

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
			console.log('hit')
			setIsLoggedIn(true);
		});
		pub?.on("failed", (reason: string) => {
			console.log(reason);
		})
	}

	const getEvents = async () => {
		let events = await relay?.list([{
			kinds: [1],
		}]);
		if (events) setEvents([events[0]]);
	}


  return (
		<div className="w-screen h-screen dark:bg-[#242424]">
			<div className="flex flex-col w-screen">
				<div className="flex flex-row w-screen h-10">
      		<div className="flex w-full flex-col items-center justify-center">
      		  <div className="relative mb-8 text-4xl md:text-6xl font-bold text-green-200 dark:text-gray-200">
      		    Frens
      		    <sup className="absolute top-0 left-full text-base text-gray-400 dark:text-green-300">
      		      :)
      		    </sup>
      		  </div>
					</div>
				</div>
				
				<div className="flex flex-row">
					<div className="flex flex-col w-2/6 h-screen p-5">
						{relay && sk && pk ? <CreatePostCard 
							posterPK={pk}  
							posterSK={sk}  
							publishEvent={publishEvent}
						/>: relay && !sk ? 
								<AuthCard 
									setSk={setSk} 
									publishEvent={publishEvent} 
									setShowKeysModal={setShowKeysModal}
								/>
							: <p>uh oh</p>}
					</div>
					<div className="flex flex-col w-4/6 p-5">
						{relay && events.length > 0 ? (
							<div className="flex flex-col space-y-4">
								{events.map((event) => {
									return <DisplayEventCard event={event} />
								})}
							</div>
						): <button 
								className="mb-2 bg-gray-200 dark:bg-[#1a1a1a] border border-dashed border-green-300" 
								onClick={() => getEvents()}
							>
								Load Feed!
							</button>
						}
					</div>
					{sk && pk && showKeysModal ? <CreatedAccModal sk={sk} pk={pk} setShowKeysModal={setShowKeysModal}/>: <></>}
				</div>
			</div>
		</div>
  )
}

export default App
