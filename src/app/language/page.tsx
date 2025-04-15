'use client'

import { useRouter } from 'next/navigation'

export default function LanguageSelectPage() {
  const router = useRouter()

  const handleSelect = (lang: string) => {
    router.push(`/reserve/program?lang=${lang}`)
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Please select your language.</h1>
      <div className="flex gap-4">
        <button
          onClick={() => handleSelect('en')}
          className="px-6 py-3 bg-black text-white rounded-xl"
        >
          English
        </button>
        <button
          onClick={() => handleSelect('zh')}
          className="px-6 py-3 bg-black text-white rounded-xl"
        >
          中文
        </button>
      </div>
    </main>
  )
}
