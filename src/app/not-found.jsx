import Link from 'next/link'

export default function NotFound(){
    return (
        
        <section>

            <div className="flex justify-center items-center py-20">
                <h1 className="text-7xl font-bold align-center">
                    <span className="text-blue-500">404</span> | Página no encontrada 
                </h1>
                
            </div>
            <Link href="/">
            <div className="flex justify-center items center py-10">
                <h2 className="text-9xl align center">
                    ⇦
                </h2>
            </div>
            </Link>
        </section>


    );
}