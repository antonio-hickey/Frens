import { SpinnerDiamond } from "spinners-react";

export default function EventLoader () {
	return (
		<div className="w-full h-1/4 rounded-lg bg-gray-200 dark:bg-[#1a1a1a] shadow border border-dashed border-green-300">
			<div className="mt-10 flex flex-col space-y-10">
				<span className="text-2xl font-bold dark:font-gray-200">Loading Events...</span>
				<SpinnerDiamond className="mt-10 mx-auto text-green-300" size={100} color="#86EFAC"/>
			</div>
		</div>
	)
}
