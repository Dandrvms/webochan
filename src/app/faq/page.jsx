// import Link from "next/link";
// import Navbar from "@/app/components/Navbar";

// export default function NotFound() {
//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar />

//       <section className="max-w-6xl mx-auto px-4">
//         {/* Encabezado con imagen de portada */}
//         <div className="relative mt-8">
//           {/* Contenedor flexible con tamaño controlado */}
//           <div 
//             className="w-full bg-[url('/img/webo_clave.jpg')] bg-contain bg-no-repeat bg-center"
//             style={{
//               height: "30vh",  // Altura relativa a la pantalla
//               minHeight: "200px",  // Altura mínima para móviles
//               maxHeight: "400px"   // Altura máxima para escritorio
//             }}
//           ></div>

//           {/* Círculo de perfil centrado */}
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="bg-black border-4 border-white rounded-full w-32 h-32 md:w-40 md:h-40 flex flex-col justify-center items-center shadow-xl">
//               <span className="text-3xl md:text-4xl font-bold text-blue-500">Webo</span>
//               <span className="text-xl md:text-2xl font-bold">chan</span>
//             </div>
//           </div>
//         </div>

//         {/* Contenido principal */}
//         <div className="mt-24 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Webo Chan</h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
//             Webéate a gusto
//           </p>

//           <div className="flex justify-center gap-4 mb-12">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105">
//               Bot
//             </button>
//             <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 transform hover:scale-105">
//               Changelog
//             </button>
//              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
//               Webo
//             </button>
//           </div>
//         </div>

//         {/* Sección de estadísticas */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
//             <div className="text-4xl font-bold text-blue-500">1.2K</div>
//             <div className="text-gray-400">Usuarios</div>
//           </div>
//           <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
//             <div className="text-4xl font-bold text-purple-500">348</div>
//             <div className="text-gray-400">Posts</div>
//           </div>
//           <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
//             <div className="text-4xl font-bold text-green-500">87</div>
//             <div className="text-gray-400">Versiones</div>
//           </div>
//         </div>

//         {/* Sección de proyectos */}
//         <div className="mb-12">
//           <h2 className="text-3xl font-bold mb-6 text-center">Hilos Destacados</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl transform transition duration-300 hover:-translate-y-2">
//                 <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold mb-2">Telegram {item}</h3>
//                   <p className="text-gray-400 mb-4">Descripción breve...</p>
//                   <div className="flex justify-between">
//                     <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">React</span>
//                     <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">Next.js</span>
//                     <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">Tailwind</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pie de página */}
//         <footer className="text-center py-8 border-t border-gray-800 text-gray-500">
//           <p>© 2025 Webochan. Todos los derechos reservados.</p>
//           <div className="flex justify-center space-x-4 mt-4">
//             <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//               Twitter
//             </a>
//             <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//               GitHub
//             </a>
//             <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//               LinkedIn
//             </a>
//             <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//               Instagram
//             </a>
//           </div>
//         </footer>
//       </section>
//     </div>
//   );
// }


// import Navbar from "@/app/components/Navbar";

export default function FAQ() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center w-full h-full pt-10">
        <div className="flex flex-col flex-grow w-full max-w-xl border border-gray-800 rounded-full items-center p-5">
          <p className="text-2xl font-bold text-gray-500 leading-none">Preguntas Frecuentes</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto border border-cyan-900 rounded-br-4xl mt-5">
        <div className="inline-block p-2 border border-cyan-900 bg-cyan-600 rounded-br-xl ">
          <h className="text-sm font-bold">Sobre Webochan</h>
        </div>
        <div className="p-4">
          <p className="text-gray-300">Webochan es un tablón de mensajes anónimos donde puedes compartir tus pensamientos, ideas y preguntas con la comunidad. Es un lugar para interactuar, aprender y divertirse.</p>
          <p className="text-gray-300 mt-5">Tenemos nuestro basamento en la comunidad de <a className="font-bold text-cyan-400" href="https://t.me/encuestaswebo">Encuetas Webo</a>.</p>
          <p className="text-gray-300 mt-5">Puedes publicar mensajes, responder a otros usuarios y participar en discusiones sobre una variedad de temas.</p>
          <p className="text-gray-300 mt-5">Webochan es un proyecto en constante evolución. Siempre estamos buscando formas de mejorar la experiencia del usuario.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto border border-cyan-900 rounded-br-4xl mt-5">
        <div className="inline-block p-2 border border-cyan-900 bg-cyan-600 rounded-br-xl ">
          <h className="text-sm font-bold">¿Anónimo?</h>
        </div>
        <div className="p-4">
          <p className="text-gray-300">Sí, Webochan es completamente anónimo. No se requiere ninguna información personal para participar.</p>
          <p className="text-gray-300 mt-5">Queremos que te sientas seguro al compartir tus pensamientos y opiniones.</p>
          <p className="text-gray-300 mt-5">Sin embargo, es importante que sepas que, al enviar cualquier tipo de mensaje, se crean dos cookies en tu navegador que permiten que edites y borres tus mensajes. Estas cookies se borran automáticamente al cabo de un mes y son necesarias para que puedas interactuar con tus mensajes de manera efectiva.</p>
          {/* <p className="text-gray-300 mt-5">Para saber más de esto puedes leer nuestros <a href="#" className="font-bold text-rose-400">Términos y Condiciones</a>.</p> */}
          <p className="text-gray-300 mt-5">Si quieres interactuar de manera más personal, puedes unirte a nuestro grupo de Telegram <a className="font-bold text-cyan-400" href="https://t.me/+Aazr9iuLR6s5ZGJh">Encuestados</a>.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto border border-cyan-900 rounded-br-4xl mt-5">
        <div className="inline-block p-2 border border-cyan-900 bg-cyan-600 rounded-br-xl ">
          <h className="text-sm font-bold">El tablón</h>
        </div>
        <div className="p-4" id="board">
          <h className="text-teal-500 font-bold text-xl">Posts</h>
          <ul className="list-disc list-inside mt-4">
            <li className="text-gray-300 mt-2">Los posts que haces en Webochan, a excepción de las encuestas, se ocultan al cabo de 1 semana para dar paso a nuevos posts.</li>
            <li className="text-gray-300 mt-2">Los posts que son comentados reciben "bumps" que hacen que suban hasta el tope del tablón. En este sentido, los posts se ordenan, primero, según la fecha de su último comentario o, segundo, según su fecha de creación.</li>
            <li className="text-gray-300 mt-2 mb-7">Si quieres comentar un post, pero no quieres que suba hasta el tope, puedes marcar el check "sage" en el campo de texto.</li>

          </ul>
          <h className="text-teal-500 font-bold text-xl">Formato</h>
          <p className="text-gray-300 mt-2">Puedes formatear el texto con caracteres especiales:</p>
          <ul className="list-disc list-inside mt-4">
            <li className="text-gray-300">Para poner un texto en negrita, debes encerrarlo entre dos asteriscos dobles, por ejemplo: </li> <p className="text-gray-300 ml-10 my-3">**negrita** se verá como <span className="font-bold">negrita</span>.</p>
            <li className="text-gray-300">Para hacer un greentext, debes comenzar la línea con un símbolo de mayor que ({">"}), por ejemplo: </li> <p className="text-gray-300 ml-10 my-3"> {">"}esto es un greentext se verá como <span className="text-green-500">{">"}esto es un greentext</span>.</p>
            <li className="text-gray-300">Para hacer un redtext, debes comenzar la línea con un símbolo de menor que ({"<"}), por ejemplo: </li> <p className="text-gray-300 ml-10 my-3"> {"<"}esto es un redtext se verá como <span className="text-pink-700">{"<"}esto es un redtext</span>.</p>
            <li className="text-gray-400">Esto no funciona al crear una encuesta</li>
          </ul>


        </div>
      </div>


      <div className="max-w-3xl mx-auto border border-cyan-900 rounded-br-4xl mt-5">
        <div className="inline-block p-2 border border-cyan-900 bg-cyan-600 rounded-br-xl ">
          <h className="text-sm font-bold">Sugerencias</h>
        </div>
        <div className="p-4" id="board">
          <p className="text-gray-300 text-md">¿Le falta algo a Webochan? ¿Hay un error y quieres informar? ¿Quieres que cambie algo? ¿Tienes una idea?</p>
          <p className="text-gray-300 my-5 ml-10">Háznoslo saber en el tablón <a href="/board/meta" className="font-bold text-cyan-400 ">/meta</a>. O bien, envíalo al privado del canal <a href="https://t.me/webochanlog" className="font-bold text-cyan-400">Changelog</a>. Estamos abiertos a todas las sugerencias.</p>
          <p className="text-gray-300 text-md">¿Quieres contribuir en el desarrollo de Webochan?</p>
          <p className="text-gray-300 my-5 ml-10">Por ahora no aceptamos contribuciones, pero podrías acercarte al <a href="https://t.me/+Aazr9iuLR6s5ZGJh" className="font-bold text-cyan-400">chat</a>. Existe la posibilidad de que eso cambie entonces.</p>
          <p className="text-gray-300 text-md">¿Webochan es de código abierto? ¿Deseas ver el código?</p>
          <p className="text-gray-300 my-5 ml-10">Por el momento el código de webochan no está abierto, pero en breve estaremos publicando el enlace público al repositorio para que esté al alcance de todos. </p>

        </div>
      </div>

      <div className="max-w-3xl mx-auto border-t  border-cyan-900 my-5">
        <div className="flex justify-center items-center space-x-3">
          <a className="font-bold text-cyan-600 border-cyan-900 border px-2" href="/">home</a>
        </div>
      </div>
    </>
  );
}