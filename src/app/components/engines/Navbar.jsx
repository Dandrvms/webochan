"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'





export default function Navbar() {
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/csrf-token");
                if (!response.ok) {
                    console.error("Failed to fetch CSRF token");
                }
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
            }
        }

        fetchData()
    }, [])

    return (
        <nav className="flex sticky top-0 z-50 w-full border border-2 bg-gray-800/50 border-gray-800 pr-4 py-1">
            <div className="max-w-6xl">
                <a className="text-xs hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200 px-2" href="/">[home]</a>
                <a className="text-xs hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200" href="/board/webo">[webo]</a>
                <a className="text-xs hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200 px-2" href="/board/meta">[meta]</a>
                <a className="text-xs hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200" href="/board/polls">[polls]</a>
                <a className="text-xs hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200 px-2" href="/faq">[faq]</a>
                {/* <a className="text-xs text-teal-500 hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200" href="/fs">[fs]</a> */}
                <a className="text-xs text-teal-500 hover:text-black hover:bg-gray-200 active:text-black active:bg-gray-200 px-2" href="/bot">[bot]</a>
            </div>
            {/* <button 
            onClick={() => router.push("/webin")}
            className="ml-auto cursor-pointer text-gray-600">_</button> */}

        </nav>
    )
}