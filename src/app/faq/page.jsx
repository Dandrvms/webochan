export default function FAQ() {
  return (
    <>
      <div className="flex flex-col items-center w-full h-full pt-5">
        <div className="flex flex-col flex-grow w-full max-w-xl items-center p-5">
          <p className="text-2xl font-bold text-gray-500 leading-none">Preguntas Frecuentes</p>
        </div>
      </div>
      <fieldset className="max-w-3xl mx-auto border border-cyan-900 border-2 rounded-md">

        <legend className="text-xl text-cyan-300 font-bold px-2 ml-4">Sobre Webochan</legend>

        <div className="p-4">
          <p className="text-gray-300 mb-5">Webochan es un textboard anónimo orientado a la comunicación textual sin identidad persistente.</p>

          <p className="mb-5">No utiliza cuentas ni perfiles. Cada usuario interactúa mediante una sesión temporal identificada por el sistema.</p>

          <p className="mb-5">El proyecto explora interfaces no convencionales, incluyendo interacción estilo terminal, como alternativa a las interfaces sociales tradicionales.</p>

         
        </div>
      </fieldset>

      <fieldset className="max-w-3xl mx-auto border border-cyan-900  border-2 rounded-md mt-5">

        <legend className="text-xl text-cyan-300 font-bold px-2 ml-4">Anonimato</legend>

        <div className="p-4">
          <p className="text-gray-300">Webochan es completamente anónimo. No se requiere ninguna información.</p>
          <p className="text-gray-300 mt-5">Para que puedas editar y borrar tus propios posts, se te asignan cookies que se borran al cabo de 30 días.</p>
        </div>
      </fieldset>

      <fieldset className="max-w-3xl mx-auto border border-cyan-900  border-2 rounded-md mt-5">

        <legend className="text-xl text-cyan-300 font-bold px-2 ml-4">Uso</legend>

        <div className="p-4" id="board">
          <h className="text-teal-500 font-bold text-xl">Posts</h>
          <ul className="list-disc list-inside">
            <li className="text-gray-300 mt-2">Los posts que son comentados suben hasta el tope del tablón. Se ordenan por fecha o por comentario reciente.</li>
            <li className="text-gray-300 mt-2 mb-3">Marca sage antes de comentar si no quieres que el post suba.</li>

          </ul>
          <h className="text-teal-500 font-bold text-xl">Formato</h>
          <ul className="list-disc list-inside">
            <li className="text-gray-300">Para negrita, usa dos asteriscos dobles: </li> <p className="text-gray-300 ml-10 my-3">**negrita** se verá como <span className="font-bold">negrita</span>.</p>
            <li className="text-gray-300">Para greentext, usa mayor que ({">"}), por ejemplo: </li> <p className="text-gray-300 ml-10 my-3"><span className="text-green-500">{">"}esto es un greentext</span>.</p>
            <li className="text-gray-300">Para redtext, usa menor que ({"<"}), por ejemplo: </li> <p className="text-gray-300 ml-10 my-3"><span className="text-pink-700">{"<"}esto es un redtext</span>.</p>
            <li className="text-gray-300 mb-3">Esto no funciona al crear una encuesta</li>
          </ul>

          <h className="text-teal-500 font-bold text-xl">Encuestas</h>
          <p className="text-gray-300 mt-2">Antes de hacer encuestas en webochan:</p>
          <ul className="list-disc list-inside mt-4">
            <li className="text-gray-300">Las encuestas no admiten el formato de texto.</li>
            <li className="text-gray-300">Por ahora no se puede modificar el voto.</li>
            <li className="text-gray-300">Las encuestas no se pueden editar ni borrar. Piensa bien antes de hacer una.</li>
            <li className="text-gray-300">Las encuestas se cierran al cabo de 5 días.</li>
            <li className="text-gray-300">Si te interesa que se abra una encuesta contacta a <span className="text-indigo-300">root</span>.</li>


          </ul>


        </div>
      </fieldset>


      <fieldset className="max-w-3xl mx-auto border border-cyan-900 border-2 rounded-md my-5">
        <legend className="text-xl text-cyan-300 font-bold px-2 ml-4">Sugerencias</legend>

        <div className="p-4" id="board">
          <p className="text-gray-300 my-5 mx-5">Postea sugerencias y errores en el tablón <a href="/board/meta" className="font-bold text-purple-400 hover:bg-white hover:text-black cursor-default">/meta</a> o en el privado del <a href="https://t.me/webochanlog" className="font-bold text-cyan-400 hover:bg-white hover:text-black cursor-default">Changelog</a>.</p>
          <p className="text-gray-300 my-5 mx-5">El código de webochan lo puedes encontrar en <a href="https://github.com/dandrvms/webochan" className="font-bold text-cyan-400 hover:bg-white hover:text-black cursor-default">github</a>.</p>

        </div>
      </fieldset>
    </>
  );
}