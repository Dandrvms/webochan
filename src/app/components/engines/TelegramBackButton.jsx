"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function TelegramBackButton() {
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    
    const tg = window.Telegram?.WebApp;

    if (tg) {
      const backButton = tg.BackButton;

      
      if (pathname === "/") {
        backButton.hide();
      } else {
        backButton.show();
      }

      
      const handleBackButtonClick = () => {
        router.back();
      };

      backButton.onClick(handleBackButtonClick);

      return () => {
        backButton.offClick(handleBackButtonClick);
      };
    }
  }, [pathname, router]); 

  return null; 
}