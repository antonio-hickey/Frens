import { SpinnerDiamond } from "spinners-react";

export default function EventLoader () {
	return (
		<div className="w-full py-5 rounded-lg bg-gray-200 dark:bg-[#1a1a1a] shadow border border-dashed border-green-300">
			<div className="flex flex-col space-y-10">
				<span className="text-2xl font-bold dark:font-gray-200">Loading Events...</span>
				<SpinnerDiamond className="mx-auto text-green-300" size={100} color="#86EFAC"/>
			</div>
		</div>
	)
}
