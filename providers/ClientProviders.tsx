"use client";

// react hooks
import { useEffect } from "react";

// next-auth
import { SessionProvider } from "next-auth/react";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  console.log("ClientProviders rendering");

  //for AOS lib(animate on scroll library)
  useEffect(() => {
    console.log("AOS init start");
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
      delay: 0,
      offset: 100,
      throttleDelay: 50,
      debounceDelay: 0,
    });
    console.log("AOS init end");
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
