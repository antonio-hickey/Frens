import { RadioGroup } from "@headlessui/react";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";

import classNames from "../utils/tailwind";
import { RELAYS } from "../utils/constants";


interface RelayCtrlCardProps {
	relays: string[],
	curRelayName: string,
	setRelay: Dispatch<SetStateAction<string>>,
}

export default function RelayCtrlCard(props: RelayCtrlCardProps) {
	const [selectedRelay, setSelectedRelay] = useState<string>(RELAYS[0]);
	const customRelayUrl = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		props.setRelay(selectedRelay);
	}, [selectedRelay])

	return (
		<div className="divide-y divide-white h-3/6 overflow-hidden rounded-lg bg-gray-200 dark:bg-[#1a1a1a] shadow border border-dashed border-green-300">
  		<div 
				className="px-4 py-5 sm:px-6 text-lg hover:dark:bg-green-300/25 hover:!text-xl hover:underline hover:decoration-green-300"
			>
				<div className="flex flex-row justify-center">
					<span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current <span className="text-green-500 dark:text-green-300">Relay</span>: </span>
					<span className="ml-5 inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
					  <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
					    <circle cx="3" cy="3" r="3" />
					  </svg>
						{props.curRelayName}
					</span>
				</div>
  		</div>
  		<div className="px-4 py-5 sm:p-6">
  			<div className="mt-2">
					<div className="flex flex-row w-full space-x-5">
						<div className="flex flex-col w-1/2">
  						<label id="listbox-label" className="block text-lg font-semibold leading-6 text-gray-800 dark:text-gray-200">Popular <span className="text-green-500 dark:text-green-300">Relays</span>:</label>
						  <RadioGroup value={selectedRelay} onChange={setSelectedRelay} className="mt-2">
      					<div className="space-y-2">
      					  {RELAYS.map((relay, i) => (
      					    <RadioGroup.Option
      					      key={i}
      					      value={relay}
      					      className={() =>
      					        classNames(
      					          relay == selectedRelay ? 'border-transparent' : 'border-gray-300',
      					          'relative block cursor-pointer rounded-lg border bg-white/50 px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between hover:bg-green-300/75'
      					        )
      					      }
      					    >
      					      {({ active, checked }) => (
      					        <>
      					          <span className="flex items-center w-full">
      					            <span className="flex flex-col text-sm w-full">
      					              <RadioGroup.Label as="span" 
																className={classNames(relay == selectedRelay ?
																	"text-gray-900 dark:text-white font-bold" : "text-gray-900",
																	"w-full text-center mx-auto"
																)}
															>
      					                {relay}
      					              </RadioGroup.Label>
      					            </span>
      					          </span>
      					          <span
      					            className={classNames(
      					              active ? 'border-dashed border' : 'border',
      					              checked ? 'border-dashed border-green-300 bg-green-300/25' : 'border-transparent',
      					              'pointer-events-none absolute -inset-px rounded-lg '
      					            )}
      					          />
      					        </>
      					      )}
      					    </RadioGroup.Option>
      					  ))}
      					</div>
    					</RadioGroup>
						</div>
						<div className="flex flex-col w-1/2">
  						<label id="listbox-label" className="block text-lg font-semibold leading-6 text-gray-800 dark:text-gray-200">Custom <span className="text-green-500 dark:text-green-300">Relay</span>:</label>
					  	<div className="mt-2 flex rounded-md shadow-sm">
					  	  <span className="inline-flex items-center rounded-l-md bg-white/50 border border-r-0 border-gray-300 px-3 py-4 text-gray-800 dark:text-gray-200 sm:text-sm">wss://</span>
					  	  <input 
                  ref={customRelayUrl} 
                  type="text" 
                  className="bg-black/25 dark:bg-white/25 block pl-2 w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:text-green-900 placeholder:dark:text-green-300" 
                  placeholder="example.io"
                />
					  	</div>
								<button 
									className="mt-5 bg-green-100 text-green-700 w-1/2 mx-auto"
									onClick={() => {
										const url = customRelayUrl?.current?.value!.replace('wss://', '');
										setSelectedRelay('wss://' + url);
									}}
								>
									Use Relay
								</button>
						</div>
					</div>
				</div>
  		</div>
		</div>	

	)
}
