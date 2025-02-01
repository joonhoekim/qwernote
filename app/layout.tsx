// default layout
// 모든 페이지에 적용될 레이아웃이므로, 폰트, 테마, 인증/인가 등 전체 페이지에 공통적으로 적용되어야 할 코드들이 포함된다.
// 이러한 분리는 nextjs의 route groups을 활용했으며, 이런 분리가 필요했던 이유는 공통적으로 적용해야 할 코드들이 각 기능별로 달랐기 때문이다.
// 예를 들면, 조회를 위한 사이드바와 편집을 위한 사이드바가 다르다.
import {ClientProviders} from '@/providers/ClientProviders';
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'qwernote',
    description: 'notes for everyone',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClientProviders>
                    <main>{children}</main>
                </ClientProviders>
            </body>
        </html>
    );
}
