import Link from "next/link";
import { webochanAscii } from "@/libs/fs/ascii";
export default function Homepage() {
  return (
    <>
  

      <div className="min-h-screen bg-black text-gray-200">
        <div className="text-center pt-8 px-4">
          <div className="max-w-3xl mx-auto">

            <pre role="img" aria-label="Webochan ascii" className="text-teal-200 leading-none text-[7px] md:text-[10px] overflow-x-auto no-scrollbar">

              {webochanAscii}

            </pre>
            <div className="pb-4">
              <span className="text-teal-200/30 text-md">Conected</span>
            </div>
 
          </div>
        </div>


        <div className="container mx-auto px-4 max-w-4xl border rounded-md">

          <div className="mb-8 border-gray-700 pt-5">
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-semibold px-2 ml-4 text-gray-400">
                Boards
              </legend>
              <div className="md:grid-cols-2 gap-6">
                <Link href="/board/webo" className="cursor-default">
                  <div className="group py-2 px-6  hover:bg-gray-300 active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-cyan-400 group-hover:text-black">webo</span> - para webiar</p>

                  </div>
                </Link>

              
                <Link href="/board/meta" className="cursor-default">
                  <div className="group py-2 px-6  hover:bg-gray-300 active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-purple-400 group-hover:text-black">meta</span> - fback & bugs</p>

                  </div>
                </Link>

            
                <Link href="board/polls" className="cursor-default">
                  <div className="group py-2 px-6  hover:bg-gray-300 active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-pink-400 group-hover:text-black">polls</span> - encuestas</p>
             
                  </div>
                </Link>

                <Link href="/bot" className="cursor-default">
                  <div className="group py-2 px-6  hover:bg-gray-300 active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-teal-400 group-hover:text-black">bot</span> - telegram</p>
                   
                  </div>
                </Link>
              </div>
            </fieldset>
          </div>


          <fieldset className="border  border-gray-300 p-4 rounded-md mb-8">
            <legend className="text-sm font-semibold px-2 ml-4 text-gray-400">
              Info
            </legend>
            <div className="flex items-start">

              <div>
                <p className="mb-4 text-gray-300">
                  Textboard anónimo de la comunidad webo.
                  Publica, responde y observa sin identidad persistente.
                  Los usuarios son identificadores temporales.
                  El contenido es lo único que permanece.</p>

                <p>
                  <a
                    href="https://t.me/encuestaswebo"
                    className="text-sky-400 cursor-default hover:text-black hover:bg-gray-300 active:bg-white active:text-black"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {">"}Canal Webo
                  </a>
                </p>
                <a
                  href="https://t.me/webochanlog"
                  className="cursor-default inline-flex items-center text-lime-500 hover:text-black hover:bg-gray-300 active:bg-white active:text-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-extrabold">{">"}</span>Changelog
                </a>
                <p>
                  <a
                    href="/faq"
                    className="cursor-default inline-flex items-center text-rose-500 hover:text-black hover:bg-gray-300 active:bg-white active:text-black"

                  >
                    <span className="font-extrabold">{">"}</span>Faq
                  </a>
                </p>
              </div>
            </div>
          </fieldset>

        </div>
        <footer className="text-center py-8 text-gray-500 text-sm  border-gray-800 mt-12">
          <p>Webochan © 2025 - {new Date().getFullYear()} • Webo</p>
        </footer>
      </div>
    </>
  );
}