"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Loader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
   
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 pointer-events-none">
      <span className="text-6xl font-extrabold text-blue-500 animate-bounce">W</span>
    </div>
  ) : null;
}