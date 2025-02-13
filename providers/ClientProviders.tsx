'use client';

// react hooks
// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
// next-auth
import {SessionProvider} from 'next-auth/react';
import {useEffect} from 'react';

import {ThemeProvider} from './ThemeProvider';

export function ClientProviders({children}: {children: React.ReactNode}) {
    //for AOS lib(animate on scroll library)
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            delay: 0,
            offset: 100,
            throttleDelay: 50,
            debounceDelay: 0,
        });
    }, []);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
    );
}
