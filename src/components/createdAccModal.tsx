import { Dispatch, SetStateAction } from "react";
import {FaExclamationCircle} from "react-icons/fa";
import {Notyf} from "notyf";
import 'notyf/notyf.min.css';

interface CreatedAccModalProps {
	sk: string,
	pk: string,
	setShowKeysModal: Dispatch<SetStateAction<boolean>>,
}

export default function CreatedAccModal(props: CreatedAccModalProps) {
	const notyf = new Notyf({
  	duration: 1000,
  	position: {
  	  x: 'center',
  	  y: 'center',
  	},
	});

	return (
		<div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 dark:bg-opacity-50 transition-opacity"></div>
		  <div className="fixed inset-0 z-10 overflow-y-auto">
		    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
		      <div className="relative transform rounded-lg bg-gray-200 dark:bg-[#1a1a1a] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6 border border-dashed border-green-300">
		        <div className="sm:flex sm:items-start">
		          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
								<FaExclamationCircle className="text-red-500"/>
		          </div>
		          <div className="mt-3 w-full h-full text-center sm:ml-4 sm:mt-0 sm:text-left">
		            <h3 className="font-semibold text-gray-800 dark:text-gray-200" id="modal-title">Store Your Keys Somewhere Safe Fren <span className="ml-2 text-lg font-bold text-green-700">:)</span></h3>
		            <div className="mt-10 w-full h-50 flex flex-row justify-center space-x-5">
									<button 
										className="w-2/4 mx-auto bg-green-100 text-green-700"
										onClick={() => {
  										navigator.clipboard.writeText(props.sk);
											notyf.success("Copied Private Key!");
										}}
									>
										Copy Private Key !
									</button>
									<button 
										className="w-2/4 mx-auto bg-green-100 text-green-700"
										onClick={() => {
  										navigator.clipboard.writeText(props.pk);
											notyf.success("Copied Public Key!");
										}}
									>
										Copy Public Key !
									</button>
		            </div>
		          </div>
		        </div>
		        <div className="mt-10 flex justify-center">
		          <button 
								type="button" 
								className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
								onClick={() => {
									props.setShowKeysModal(false);
								}}
							>
								I've Stored My Keys !
							</button>
		        </div>
		      </div>
		    </div>
		  </div>
		</div>	
	)
}
