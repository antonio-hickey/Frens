declare module 'nostr-tools' {
	// event
	export declare enum Kind {
	    Metadata = 0,
	    Text = 1,
	    RecommendRelay = 2,
	    Contacts = 3,
	    EncryptedDirectMessage = 4,
	    EventDeletion = 5,
			Repost = 6,
	    Reaction = 7,
	    BadgeAward = 8,
	    ChannelCreation = 40,
	    ChannelMetadata = 41,
	    ChannelMessage = 42,
	    ChannelHideMessage = 43,
	    ChannelMuteUser = 44,
	    Report = 1984,
	    ZapRequest = 9734,
	    Zap = 9735,
	    RelayList = 10002,
	    ClientAuth = 22242,
	    BadgeDefinition = 30008,
	    ProfileBadge = 30009,
	    Article = 30023
	}
	export type EventTemplate = {
	    kind: Kind;
	    tags: string[][];
	    content: string;
	    created_at: number;
	};
	export type UnsignedEvent = EventTemplate & {
	    pubkey: string;
	};
	export type Event = UnsignedEvent & {
	    id: string;
	    sig: string;
	};
	export type QuotedEvent = Event & {
		quotedEvent: Event;
	}
	export declare function getBlankEvent(): EventTemplate;
	export declare function finishEvent(t: EventTemplate, privateKey: string): Event;
	export declare function serializeEvent(evt: UnsignedEvent): string;
	export declare function getEventHash(event: UnsignedEvent): string;
	export declare function validateEvent<T>(event: T): event is T & UnsignedEvent;
	export declare function verifySignature(event: Event): boolean;
	export declare function signEvent(event: UnsignedEvent, key: string): string;
	

	// Fake JSON
	export declare function getHex64(json: string, field: string): string;
	export declare function getInt(json: string, field: string): number;
	export declare function getSubscriptionId(json: string): string | null;
	export declare function matchEventId(json: string, id: string): boolean;
	export declare function matchEventPubkey(json: string, pubkey: string): boolean;
	export declare function matchEventKind(json: string, kind: number): boolean;


	// Filter
	export type Filter = {
	    ids?: string[];
	    kinds?: number[];
	    authors?: string[];
	    since?: number;
	    until?: number;
	    limit?: number;
	    search?: string;
	    [key: `#${string}`]: string[];
	};
	export declare function matchFilter(filter: Filter, event: Event): boolean;
	export declare function matchFilters(filters: Filter[], event: Event): boolean;

	
	//Keys
	export declare function generatePrivateKey(): string;
	export declare function getPublicKey(privateKey: string): string;


	// Nip 04
	export declare function encrypt(privkey: string, pubkey: string, text: string): Promise<string>;
	export declare function decrypt(privkey: string, pubkey: string, data: string): Promise<string>;


	// Nip 19
	export type ProfilePointer = {
	    pubkey: string;
	    relays?: string[];
	};
	export type EventPointer = {
	    id: string;
	    relays?: string[];
	    author?: string;
	};
	export type AddressPointer = {
	    identifier: string;
	    pubkey: string;
	    kind: number;
	    relays?: string[];
	};
	export type DecodeResult = {
	    type: 'nprofile';
	    data: ProfilePointer;
	} | {
	    type: 'nrelay';
	    data: string;
	} | {
	    type: 'nevent';
	    data: EventPointer;
	} | {
	    type: 'naddr';
	    data: AddressPointer;
	} | {
	    type: 'nsec';
	    data: string;
	} | {
	    type: 'npub';
	    data: string;
	} | {
	    type: 'note';
	    data: string;
	};
	export declare function decode(nip19: string): DecodeResult;
	export declare function nsecEncode(hex: string): string;
	export declare function npubEncode(hex: string): string;
	export declare function noteEncode(hex: string): string;
	export declare function nprofileEncode(profile: ProfilePointer): string;
	export declare function neventEncode(event: EventPointer): string;
	export declare function naddrEncode(addr: AddressPointer): string;
	export declare function nrelayEncode(url: string): string;


	// Nip 05
	export declare function useFetchImplementation(fetchImplementation: any): void;
	export declare function searchDomain(domain: string, query?: string): Promise<{
	    [name: string]: string;
	}>;
	export declare function queryProfile(fullname: string): Promise<ProfilePointer | null>;


	// Nip 06
	export declare function privateKeyFromSeedWords(mnemonic: string, passphrase?: string): string;
	export declare function generateSeedWords(): string;
	export declare function validateWords(words: string): boolean;


	// Nip 10 
	export type NIP10Result = {
	    /**
	     * Pointer to the root of the thread.
	     */
	    root: EventPointer | undefined;
	    /**
	     * Pointer to a "parent" event that parsed event replies to (responded to).
	     */
	    reply: EventPointer | undefined;
	    /**
	     * Pointers to events which may or may not be in the reply chain.
	     */
	    mentions: EventPointer[];
	    /**
	     * List of pubkeys that are involved in the thread in no particular order.
	     */
	    profiles: ProfilePointer[];
	};
	export declare function parse(event: Pick<Event, 'tags'>): NIP10Result;


	// Nip 13 
	// /** Get POW difficulty from a Nostr hex ID. */
	export declare function getPow(id: string): number;


	// Nip 21
	/**
	 * Bech32 regex.
	 * @see https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki#bech32
	 */
	export declare const BECH32_REGEX: RegExp;
	/** Nostr URI regex, eg `nostr:npub1...` */
	export declare const NOSTR_URI_REGEX: RegExp;
	/** Test whether the value is a Nostr URI. */
	export declare function test(value: unknown): value is `nostr:${string}`;
	/** Parsed Nostr URI data. */
	export interface NostrURI {
	    /** Full URI including the `nostr:` protocol. */
	    uri: `nostr:${string}`;
	    /** The bech32-encoded data (eg `npub1...`). */
	    value: string;
	    /** Decoded bech32 string, according to NIP-19. */
	    decoded: nip19.DecodeResult;
	}
	/** Parse and decode a Nostr URI. */
	export declare function parse(uri: string): NostrURI;
	

	// Nip 26
	export type Parameters = {
	    pubkey: string;
	    kind: number | undefined;
	    until: number | undefined;
	    since: number | undefined;
	};
	export type Delegation = {
	    from: string;
	    to: string;
	    cond: string;
	    sig: string;
	};
	export declare function createDelegation(privateKey: string, parameters: Parameters): Delegation;
	export declare function getDelegator(event: Event): string | null;


	// Nip 27
	/** Regex to find NIP-21 URIs inside event content. */
	export declare const regex: () => RegExp;
	/** Match result for a Nostr URI in event content. */
	export interface NostrURIMatch extends nip21.NostrURI {
	    /** Index where the URI begins in the event content. */
	    start: number;
	    /** Index where the URI ends in the event content. */
	    end: number;
	}
	/** Find and decode all NIP-21 URIs. */
	export declare function matchAll(content: string): Iterable<NostrURIMatch>;
	/**
	 * Replace all occurrences of Nostr URIs in the text.
	 *
	 * WARNING: using this on an HTML string is potentially unsafe!
	 *
	 * @example
	 * ```ts
	 * nip27.replaceAll(event.content, ({ decoded, value }) => {
	 *   switch(decoded.type) {
	 *     case 'npub':
	 *       return renderMention(decoded)
	 *     case 'note':
	 *       return renderNote(decoded)
	 *     default:
	 *       return value
	 *   }
	 * })
	 * ```
	 */
	export declare function replaceAll(content: string, replacer: (match: nip21.NostrURI) => string): string;


	// Nip 39
	export declare function useFetchImplementation(fetchImplementation: any): void;
	export declare function validateGithub(pubkey: string, username: string, proof: string): Promise<boolean>;


	// Nip 42
	/**
	 * Authenticate via NIP-42 flow.
	 *
	 * @example
	 * const sign = window.nostr.signEvent
	 * relay.on('auth', challenge =>
	 *   authenticate({ relay, sign, challenge })
	 * )
	 */
	export declare const authenticate: ({ challenge, relay, sign }: {
	    challenge: string;
	    relay: Relay;
	    sign: (e: EventTemplate) => Promise<Event>;
	}) => Promise<void>;


	// Nip 57
	export declare function useFetchImplementation(fetchImplementation: any): void;
	export declare function getZapEndpoint(metadata: Event): Promise<null | string>;
	export declare function makeZapRequest({ profile, event, amount, relays, comment }: {
	    profile: string;
	    event: string | null;
	    amount: number;
	    comment: string;
	    relays: string[];
	}): EventTemplate;
	export declare function validateZapRequest(zapRequestString: string): string | null;
	export declare function makeZapReceipt({ zapRequest, preimage, bolt11, paidAt }: {
	    zapRequest: string;
	    preimage: string | null;
	    bolt11: string;
	    paidAt: Date;
	}): EventTemplate;


	// Pool
	export declare class SimplePool {
	    private _conn;
	    private _seenOn;
	    private eoseSubTimeout;
	    private getTimeout;
	    constructor(options?: {
	        eoseSubTimeout?: number;
	        getTimeout?: number;
	    });
	    close(relays: string[]): void;
	    ensureRelay(url: string): Promise<Relay>;
	    sub(relays: string[], filters: Filter[], opts?: SubscriptionOptions): Sub;
	    get(relays: string[], filter: Filter, opts?: SubscriptionOptions): Promise<Event | null>;
	    list(relays: string[], filters: Filter[], opts?: SubscriptionOptions): Promise<Event[]>;
	    publish(relays: string[], event: Event): Pub;
	    seenOn(id: string): string[];
	}

	
	// Refrences
	type Reference = {
	    text: string;
	    profile?: ProfilePointer;
	    event?: EventPointer;
	    address?: AddressPointer;
	};
	export declare function parseReferences(evt: Event): Reference[];
	export {};



	// Relay
	type RelayEvent = {
	    connect: () => void | Promise<void>;
	    disconnect: () => void | Promise<void>;
	    error: () => void | Promise<void>;
	    notice: (msg: string) => void | Promise<void>;
	    auth: (challenge: string) => void | Promise<void>;
	};
	export type CountPayload = {
	    count: number;
	};
	type SubEvent = {
	    event: (event: Event) => void | Promise<void>;
	    count: (payload: CountPayload) => void | Promise<void>;
	    eose: () => void | Promise<void>;
	};
	export type Relay = {
	    url: string;
	    status: number;
	    connect: () => Promise<void>;
	    close: () => void;
	    sub: (filters: Filter[], opts?: SubscriptionOptions) => Sub;
	    list: (filters: Filter[], opts?: SubscriptionOptions) => Promise<Event[]>;
	    get: (filter: Filter, opts?: SubscriptionOptions) => Promise<Event | null>;
	    count: (filters: Filter[], opts?: SubscriptionOptions) => Promise<CountPayload | null>;
	    publish: (event: Event) => Pub;
	    auth: (event: Event) => Pub;
	    off: <T extends keyof RelayEvent, U extends RelayEvent[T]>(event: T, listener: U) => void;
	    on: <T extends keyof RelayEvent, U extends RelayEvent[T]>(event: T, listener: U) => void;
	};
	export type Pub = {
	    on: (type: 'ok' | 'failed', cb: any) => void;
	    off: (type: 'ok' | 'failed', cb: any) => void;
	};
	export type Sub = {
	    sub: (filters: Filter[], opts: SubscriptionOptions) => Sub;
	    unsub: () => void;
	    on: <T extends keyof SubEvent, U extends SubEvent[T]>(event: T, listener: U) => void;
	    off: <T extends keyof SubEvent, U extends SubEvent[T]>(event: T, listener: U) => void;
	};
	export type SubscriptionOptions = {
	    id?: string;
	    verb?: 'REQ' | 'COUNT';
	    skipVerification?: boolean;
	    alreadyHaveEvent?: null | ((id: string, relay: string) => boolean);
	};
	export declare function relayInit(url: string, options?: {
	    getTimeout?: number;
	    listTimeout?: number;
	    countTimeout?: number;
	}): Relay;
	export {};


	// utils
	export declare const utf8Decoder: TextDecoder;
	export declare const utf8Encoder: TextEncoder;
	export declare function normalizeURL(url: string): string;
	export declare function insertEventIntoDescendingList(sortedArray: Event[], event: Event): Event[];
	export declare function insertEventIntoAscendingList(sortedArray: Event[], event: Event): Event[];
}
