import { Dispatch, SetStateAction, useRef } from "react";
import { GiSkeletonKey } from "react-icons/gi";
import { HiPencilSquare, HiUserCircle } from "react-icons/hi2"
import { generatePrivateKey, getPublicKey, UnsignedEvent } from "nostr-tools";


interface AuthCardProps {
	setSk: Dispatch<SetStateAction<string | null>>,
	publishEvent: (event: UnsignedEvent, sk?:string) => void,
	setShowKeysModal: Dispatch<SetStateAction<boolean>>,
}

export default function AuthCard(props: AuthCardProps) {
	const skField = useRef<HTMLInputElement | null>(null);
	const displayNameField = useRef<HTMLInputElement | null>(null);
	const profilePicField = useRef<HTMLInputElement | null>(null);


	return (
		<div className="flex flex-col space-y-5">
			<div className="rounded-lg bg-gray-200 shadow p-5 dark:bg-[#1a1a1a] border border-dashed border-green-300">
				<div>
  				<div className="mt-2 relative rounded-md shadow-sm">
  				  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<GiSkeletonKey className="text-green-700 h-6 w-6"/>
  				  </div>
  				  <input 
							className="block w-full rounded-md border border-green-300 py-1.5 pl-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
							placeholder="Your Private Key..." 
							ref={skField}
						/>
  				</div>
				</div>
				
				<button 
					className="mt-5 bg-green-100 text-green-700"
					onClick={() => {
						const sk = skField?.current?.value!;
						if (sk.length !== 64) return;

						props.setSk(sk)
					}}
				>
					Sign In
				</button>
  		</div>

			<div className="rounded-lg bg-gray-200 shadow p-5 dark:bg-[#1a1a1a] border border-dashed border-green-300">
  			<div className="relative rounded-md shadow-sm">
  			  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<HiPencilSquare className="text-green-700 h-6 w-6"/>
  			  </div>
  			  <input 
						className="block w-full rounded-md border border-green-300 py-1.5 pl-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
						placeholder="Your Display Name..." 
						ref={displayNameField}
					/>
  			</div>
				<div className="mt-2 relative rounded-md shadow-sm">
  			  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<HiUserCircle className="text-green-700 h-6 w-6"/>
  			  </div>
  			  <input 
						className="block w-full rounded-md border border-green-300 py-1.5 pl-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
						placeholder="Profile Pic URL..." 
						ref={profilePicField}
					/>
  			</div>
				
				<button 
					className="mt-5 bg-green-100 text-green-700"
					onClick={() => {
						const sk: string =  generatePrivateKey();
						props.setSk(sk);
						props.publishEvent({
							kind: 0,
							created_at: Math.floor(Date.now() / 1000),
							tags: [],
							content: JSON.stringify({
								name: displayNameField?.current?.value,
								picture: profilePicField?.current?.value,
							}),
							pubkey: getPublicKey(sk),
						}, sk);
						props.setShowKeysModal(true);
					}}
				>
					Sign Up
				</button>
  		</div>
		</div>
	)
}
