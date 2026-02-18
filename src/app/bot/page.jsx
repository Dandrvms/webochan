import { webotAscii } from "@/libs/fs/ascii";
export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center w-full h-full pb-20">
                <fieldset className="flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-2 rounded-md border-gray-400 mt-20 pb-10 ">
                    <legend className="text-lg font-bold text-gray-300 mt-5 px-2 text-center">Utiliza nuestro bot de telegram</legend>

                    <div className="max-w-[50vh] md:max-w-3xl mx-auto" >
                   
                        <a href="https://t.me/webochanbot" target="_blank" rel="noopener noreferrer">
                            <pre role="img" aria-label="webot ascii" className="text-teal-200 leading-none text-[7px] md:text-[10px] overflow-x-auto no-scrollbar">{webotAscii}</pre>
          
                        </a>
                    </div>

                    <ul className="list-disc list-inside text-sm md:text-lg pl-5">
                        <li className="text-gray-400 mt-5">Recibe <span className="text-green-400">notificaciones</span> de posts en los tablones que elijas.</li>
                        <li className="text-gray-400 mt-5"><span className="text-fuchsia-400">Sigue</span> las respuestas de los hilos que te interesen.</li>
                        <li className="text-gray-400 mt-5"><span className="text-amber-400">Escanea</span> un tablón y navega por sus posts y comentarios</li>
                        <li className="text-gray-400 mt-5"><span className="text-sky-400">Postea</span> y <span className="text-orange-500">responde</span> desde el bot.</li>

                    </ul>
                </fieldset>
            </div>
        </>
    );
}