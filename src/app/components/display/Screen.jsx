import { webochanAscii } from "@/libs/fs/ascii";

export default function Screen({ sections }) {
    return (
        <div className="font-mono text-sm text-gray-300">
            <div className="text-center text-gray-500">
                -- SCREEN MODE --  (press q to exit)
            </div>

            <pre className="text-teal-200 leading-none md:text-[10px] text-[7px] overflow-x-auto no-scrollbar">

                {webochanAscii}

            </pre>

            <div className="">
                {Object.entries(sections).map(([sectionName, values]) => (
                    <div key={sectionName}>


                        {Object.entries(values).map(([k, v]) => (
                            <div key={k} className="flex">
                                <span className="text-green-400 w-28">{k}</span>
                                <span className="text-gray-300">{v}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
