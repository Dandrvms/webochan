"use client"
import { useEffect } from 'react'





export default function Navbar() {

    useEffect(() => {
        fetch("/api/csrf-token");
    }, [])

    return (
        <nav className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-none border-b border-gray-800 px-4 py-1">
            <div className="max-w-6xl mx-auto">
                <a className="text-xs text-blue-600 hover:text-white px-2" href="/">[home]</a>
                <a className="text-xs text-blue-600 hover:text-white px-2" href="/board/webo">[webo]</a>
                <a className="text-xs text-blue-600 hover:text-white px-2" href="/board/meta">[meta]</a>
                <a className="text-xs text-blue-600 hover:text-white px-2" href="/board/polls">[polls]</a>
                <a className="text-xs text-blue-600 hover:text-white px-2" href="/faq">[faq]</a>
                <a className="text-xs text-teal-500 hover:text-white px-2" href="https://t.me/webochanbot">[bot]</a>

                <div className="flex items-center justify-between">
                </div>
            </div>
        </nav>
    )
}