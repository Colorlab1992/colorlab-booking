// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image' // ✅ 이미지 사용을 위해 추가

export const metadata: Metadata = {
  title: 'My App',
  description: '랜딩페이지 예시',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <header className="p-4 flex justify-between items-center border-b">
          {/* ✅ 로고 텍스트 → 이미지로 변경 */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={73.44} height={70} />
          </Link>

          <nav className="hidden md:flex gap-4">
            <Link href="#contact">Contact Us</Link>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
