import Link from "next/link";
export default function NotFound(){
    return (
        
        <section>

            <div className="text-center items-center py-20 border m-5 border-dotted border-gray-400 border-4">
                <h1 className="text-4xl text-gray-500 font-bold align-center">
                    Página no encontrada 
                </h1>
                <h3 className="text-cyan-500">error 404</h3>
            </div>
            
            <div className="flex justify-center items center py-10">
                <Link href="/"
                    className="text-2xl text-gray-400 align center border border-dashed border-3 border-gray-400 rounded p-10 hover:bg-white hover:text-black active:bg-white active:text-black">
                    volver
                </Link>
            </div>
        </section>


    );
}