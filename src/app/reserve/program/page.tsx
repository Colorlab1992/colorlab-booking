'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!

const allPrograms = {
  en: [
    { id: 'personal-full-en', name: 'Personal color (Full-package)', maxPeople: 3, calendarId: CALENDAR_ID },
    { id: 'personal-semi-en', name: 'Personal color (Semi-package)', maxPeople: 3, calendarId: CALENDAR_ID },
    { id: 'bodytype-en', name: 'Body-type Analysis', maxPeople: 3, calendarId: CALENDAR_ID },
    { id: 'total-en', name: 'Total Package', maxPeople: 2, calendarId: CALENDAR_ID },
  ],
  zh: [
    { id: 'personal-full-zh', name: 'Personal color (Full-package)', maxPeople: 3, calendarId: CALENDAR_ID },
    { id: 'personal-semi-zh', name: 'Personal color (Semi-package)', maxPeople: 3, calendarId: CALENDAR_ID },
    { id: 'bodytype-zh', name: 'Body-type Analysis', maxPeople: 3, calendarId: CALENDAR_ID },
    { id: 'total-zh', name: 'Total Package', maxPeople: 2, calendarId: CALENDAR_ID },
  ],
}

export default function ProgramSelectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'en'

  const programs = allPrograms[lang as 'en' | 'zh']
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [peopleCount, setPeopleCount] = useState(1)

  const handleNext = () => {
    if (!selectedProgram) return
    const query = `/reserve/schedule?program=${selectedProgram.id}&lang=${lang}&people=${peopleCount}&calendar=${selectedProgram.calendarId}`
    router.push(query)
  }

  return (
    <main className="p-6 space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">What program do you want?</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program) => (
          <div
            key={program.id}
            className={`border rounded p-4 cursor-pointer transition-all ${
              selectedProgram?.id === program.id ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              setSelectedProgram(program)
              setPeopleCount(1)
            }}
          >
            <h2 className="font-semibold text-lg">{program.name}</h2>
            <p className="text-sm text-gray-600">Maximum: {program.maxPeople} people</p>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <div className="space-y-2">
          <label className="block font-medium">Number of people:</label>
          <select
            className="border px-4 py-2 rounded"
            value={peopleCount}
            onChange={(e) => setPeopleCount(Number(e.target.value))}
          >
            {Array.from({ length: selectedProgram.maxPeople }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleNext}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:bg-gray-400"
        disabled={!selectedProgram}
      >
        Continue →
      </button>
    </main>
  )
}
