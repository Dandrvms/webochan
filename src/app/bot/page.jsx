import Link from "next/link";
export default function NotFound() {
    return (
        <section>
            <div className="flex flex-col items-center w-full h-full pb-20">
                <fieldset className="flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                    <legend className="text-lg font-bold text-gray-300 mt-5 px-2 text-center">Utiliza nuestro bot de telegram</legend>
                    <a href="https://t.me/webochanbot">
                        <img src="/img/ascii-art-text.png" className="border-dashed border-b-4 border-gray-400 hover:border-b-3 active:border-b-3 py-4">
                        </img>
                    </a>
                    <ul className="list-disc list-inside text-sm md:text-lg pl-5">
                        <li className="text-gray-400 mt-5">Recibe <span className="text-green-400">notificaciones</span> de posts en los tablones de tu preferencia.</li>
                        <li className="text-gray-400 mt-5"><span className="text-fuchsia-400">Sigue</span> las respuestas de los hilos que te interesan.</li>
                        <li className="text-gray-400 mt-5">Próximamente funciones para que puedas <span className="text-sky-400">postear</span> y <span className="text-orange-500">responder</span> desde el bot.</li>

                    </ul>
                </fieldset>
            </div>
        </section>
    );
}