import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NostrProvider } from "nostr-react";

export const RELAYS = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.swiss-enigma.ch",
  "wss://relay.damus.io",
];


let root = document.getElementById('root');
root?.classList.add('dark:bg-[#242424]');
ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
		<NostrProvider relayUrls={RELAYS} debug={true}>
    	<App />
		</NostrProvider>
  </React.StrictMode>,
)
