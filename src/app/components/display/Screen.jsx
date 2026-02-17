import { webochanAscii } from "@/libs/fs/ascii";

export default function Screen({ mode, sections, onQuit }) {

    if (mode !== "SCREEN") {
        return null
    }


    return (

        <div className="fixed inset-0 z-50  my-10 bg-black">
            <div

                className="h-[80vh] overflow-y-auto  font-mono p-5 border no-scrollbar text-gray-400 rounded-md my-10"

            >
                <div className="font-mono text-sm text-gray-300">
                    <div className="flex">
                        <div className="text-center text-gray-500 mx-auto">
                            -- SCREEN MODE --  (press q to exit)
                        </div>
                        <button
                            className="text-gray-500"
                            onClick={onQuit}
                        >✕</button>
                    </div>

                    <pre className="text-teal-200 leading-none md:text-[10px] text-[7px] overflow-x-auto no-scrollbar">

                        {webochanAscii}

                    </pre>

                    <div className="">
                        {Object.entries(sections).map(([sectionName, values]) => (
                            <div key={sectionName}>


                                {Object.entries(values).map(([k, v]) => (
                                    <div key={k} className="flex">
                                        <span className="text-green-400 w-28">{k}<span className="text-white">:</span></span>
                                        <span className="text-gray-300">{v}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-8 max-w-[200px] mt-5 text-transparent">
                        <div className="bg-gray-800">
                            .
                        </div>
                        <div className="bg-rose-600">
                            .
                        </div>
                        <div className="bg-green-600">
                            .
                        </div>
                        <div className="bg-amber-500">
                            .
                        </div>
                        <div className="bg-blue-600">
                            .
                        </div>
                        <div className="bg-fuchsia-600">
                            .
                        </div>
                        <div className="bg-teal-600">
                            .
                        </div>
                        <div className="bg-gray-300">
                            .
                        </div>
                        <div className="bg-gray-500">
                            .
                        </div>
                        <div className="bg-rose-300">
                            .
                        </div>
                        <div className="bg-green-300">
                            .
                        </div>
                        <div className="bg-amber-200">
                            .
                        </div>
                        <div className="bg-blue-300">
                            .
                        </div>
                        <div className="bg-fuchsia-300">
                            .
                        </div>
                        <div className="bg-teal-300">
                            .
                        </div>
                        <div className="bg-white">
                            .
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
