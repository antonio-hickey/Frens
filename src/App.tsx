import { 
	generatePrivateKey, getPublicKey, relayInit, 
	SimplePool, Event, getEventHash, signEvent,
	Relay,
} from "nostr-tools";
import {useProfile} from "nostr-react";
import { useState, useEffect } from "react";
import './App.css';
import CreatePostCard from "./components/createPostCard";



export const RELAYS = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];


function App() {
	const [pool, setPool] = useState<SimplePool | null>(null);
	const [events, setEvents] = useState<Event[]>([]);
	const [relay, setRelay] = useState<Relay | null>(null);
	const [sk, setSk] = useState<string>("");
	const [pk, setPk] = useState<string>(getPublicKey(sk));
	const {data: userData} = useProfile({pubkey: pk});
	const [pubStatus, setPubStatus] = useState("");

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

		if (events) {
			console.log(events)
		}

		console.log(61, userData);
		if (userData) {
			console.log(61, userData);
		}

	}, [events]);

	const publishEvent = (event: Event) => {
		event.id = getEventHash(event);
		event.sig = signEvent(event, sk);

		const pub = relay.publish(event);
		pub.on("ok", () => {
			setPubStatus("our event is published");
		});
		pub.on("failed", reason => {
			setPubStatus("our event was NOT published " + reason);
		})
	}

	const getEvents = async () => {
		let events = await relay.list([{
			kinds: [1],
		}]);
		setEvents(events);
	}


  return (
		<div className="w-screen h-screen">
			<div className="flex flex-col w-screen">
				<div className="flex flex-row w-screen h-10">
      		<div className="flex w-full flex-col items-center justify-center">
      		  <div className="relative mb-8 text-4xl md:text-6xl font-bold">
      		    Frens
      		    <sup className="absolute top-0 left-full text-base text-green-300">
      		      :)
      		    </sup>
      		  </div>
					</div>
				</div>
				
				<div className="flex flex-row">
					<div className="flex flex-col w-2/6 h-screen px-5">
						{relay ? <CreatePostCard 
							posterPK={pk}  
							posterSK={sk}  
							posterName={userData?.name!} 
							posterPicUrl={userData?.picture!}
							publishEvent={publishEvent}
						/>: <></>}
					</div>
					<div className="flex flex-col w-4/6">
						{relay ? (
							<div>
								<button onClick={() => publishEvent(event)}>Publish Event</button>
								<button onClick={() => getEvents()}>Load Feed!</button>
							</div>
						): <p>Failed to connect to relay</p>}
						<p>{pubStatus}</p>
					</div>
				</div>
			</div>
		</div>
  )
}

export default App
