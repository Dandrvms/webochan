import Link from "next/link";
// import Navbar from "@/app/components/Navbar";

export default function Homepage() {
  return (
    <>
      {/* <Navbar /> */}

      <div className="min-h-screen bg-black text-gray-200">
        {/* Hero Section */}
        <div className="text-center pt-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center  px-4 py-2 ">
              {/* <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg> */}
              <span className="text-white text-md">Bienvenid@ a</span>
            </div>

            {/* <h1 className="text-4xl md:text-6xl font-bold mb-2 ">
              <span className="bg-clip-text text-transparent bg-white">
                WEBOchan
              </span>
            </h1> */}

            <img src="/img/photo_2026-01-19_19-58-24.jpg"></img>

            {/* <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comunícate de forma anónima con la comunidad Webo
            </p> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Info Card */}


          {/* Boards Section */}
          <div className="mb-8 border-t border-gray-700 pt-5">
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-2xl font-semibold px-2 ml-4 text-white">
                Tablones
              </legend>
              <div className="md:grid-cols-2 gap-6">
                {/* /webo/ Board */}
                <Link href="/board/webo">
                  <div className="group py-2 px-6 cursor-pointer hover:bg-white active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-cyan-400 group-hover:text-black">webo</span> - para webiar</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      {/* <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Activo ahora</span> */}
                    </div>
                  </div>
                </Link>

                {/* /meta/ Board */}
                <Link href="/board/meta">
                  <div className="group py-2 px-6 cursor-pointer hover:bg-white active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-purple-400 group-hover:text-black">meta</span> - sugerencias y bugs</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      {/* <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Nuevo</span> */}
                    </div>
                  </div>
                </Link>

                {/* /polls/ Board */}
                <Link href="board/polls">
                  <div className="group py-2 px-6 cursor-pointer hover:bg-white active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-pink-400 group-hover:text-black">polls</span> - Encuestas</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      {/* <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Nuevo</span> */}
                    </div>
                  </div>
                </Link>

                <Link href="https://t.me/webochanbot">
                  <div className="group py-2 px-6 cursor-pointer hover:bg-white active:bg-white">
                    <p className="text-gray-400 group-hover:text-black group-active:text-black"><span className="text-teal-400 group-hover:text-black">bot</span> - telegram</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      {/* <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Nuevo</span> */}
                    </div>
                  </div>
                </Link>
              </div>
            </fieldset>
          </div>

         
            <fieldset className="border border-dotted border-4 border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-semibold px-2 ml-4 text-gray-400">
                Info
              </legend>
              <div className="flex items-start">
                {/* <svg className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg> */}
                <div>
                  <p className="mb-4 text-gray-300">
                    Webochan es el tablón de mensajes anónimos oficial de{" "}
                    <a
                      href="https://t.me/encuestaswebo"
                      className="font-bold text-blue-400 hover:text-black hover:bg-white active:bg-white active:text-black"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Webo
                    </a>. Por ahora el formato es de solo texto. Anímate a crear hilos, hacer encuestas y decir cosas. Aceptamos sugerencias de todos los usuarios.
                  </p>
                  <a
                    href="https://t.me/webochanlog"
                    className="inline-flex items-center font-bold text-blue-400 hover:text-black hover:bg-white active:bg-white active:text-black transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <path d="M21 5L2 12.5L9 13.5M21 5L18.5 21L9 13.5M21 5L9 13.5M9 13.5V19L12.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg> */}
                    {"Changelog"}
                  </a>
                </div>
              </div>
            </fieldset>
         

          {/* Features Section */}
          <div className="border-t border-gray-800 pt-12 pb-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Encuentra lo que buscas</h2>
            <div className=" md:grid-cols-3 gap-6">
              {/* <div className="bg-gray-800/30 rounded-xl p-5 text-center transition-transform hover:scale-[1.02]">
                <div className="bg-blue-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none">
                    <path d="M19 10C19 11.5913 18.3679 13.1174 17.2426 14.2426C16.1174 15.3679 14.5913 16 13 16C11.4087 16 9.88258 15.3679 8.75736 14.2426C7.63214 13.1174 7 11.5913 7 10C7 8.4087 7.63214 6.88258 8.75736 5.75736C9.88258 4.63214 11.4087 4 13 4C14.5913 4 16.1174 4.63214 17.2426 5.75736C18.3679 6.88258 19 8.4087 19 10Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2" className="opacity-30"/>
                    <path d="M3 20C4.5765 18.153 6.5855 16.657 8.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Anonimato</h3>
                <p className="text-gray-400 text-sm">Publica sin revelar tu identidad</p>
              </div> */}
              {/* <Link href="#">
              <div className="bg-gray-800/30 rounded-xl p-5 text-center transition-transform hover:scale-[1.02]">
                <div className="bg-purple-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Comunidad</h3>
                <p className="text-gray-400 text-sm">Conecta con otros miembros</p>
              </div>
              </Link> */}
              <Link href="/faq">
                <div className="group p-5 text-center hover:bg-white active:bg-white">
                  {/* <div className="bg-cyan-900/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div> */}
                  <h3 className="group-hover:text-black font-bold text-lg mb-2 group-active:text-black">FAQ</h3>
                  <p className="group-hover:text-black text-gray-400 text-sm group-active:text-black">¿Preguntas?</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-800 mt-12">
            <p>Webochan © {new Date().getFullYear()} - Comunidad Webo</p>
          </footer>
        </div>
      </div>
    </>
  );
}