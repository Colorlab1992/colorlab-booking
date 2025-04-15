'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { parseISO, addHours } from 'date-fns'

interface ReservationEvent {
  start: string
  end: string
}

export default function SchedulePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const programId = searchParams.get('program') || ''
  const people = Number(searchParams.get('people') || '1')
  const lang = searchParams.get('lang') || ''

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [blockedSlots, setBlockedSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const normalizeProgram = (id: string): string => {
    if (id.includes('personal-full')) return 'personal-full'
    if (id.includes('personal-semi')) return 'personal-semi'
    if (id.includes('bodytype')) return 'bodytype'
    if (id.includes('total')) return 'total'
    return ''
  }

  const programKey = normalizeProgram(programId)

  const durationMap: Record<string, Record<number, number>> = {
    'personal-full': { 1: 2, 2: 3, 3: 4 },
    'personal-semi': { 1: 2, 2: 3, 3: 4 },
    'bodytype': { 1: 2, 2: 3, 3: 4 },
    'total': { 1: 3, 2: 5 }
  }

  const duration = durationMap[programKey]?.[people] || 1

  const getTimeSlots = (): string[] => {
    const slots: string[] = []
    const lastStart = 21 - duration
    for (let hour = 11; hour <= lastStart; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const timeSlots = getTimeSlots()

  useEffect(() => {
    if (!selectedDate || !programId) return

    const fetchReserved = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/calendar/available', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ program: programId, date: selectedDate }),
        })

        const data = await res.json()
        const reservations: ReservationEvent[] = data.reservations || []

        const blocked: string[] = []

        for (let hour = 11; hour <= 19; hour++) {
          const slotStart = new Date(`${selectedDate}T${hour.toString().padStart(2, '0')}:00:00`)
          const slotEnd = addHours(slotStart, duration)

          if (slotEnd.getHours() > 21) continue

          const overlap = reservations.some((event) => {
            const start = parseISO(event.start)
            const end = parseISO(event.end)
            return start < slotEnd && end > slotStart
          })

          if (overlap) {
            blocked.push(`${hour.toString().padStart(2, '0')}:00`)
          }
        }

        setBlockedSlots(blocked)
      } catch (err) {
        console.error('Failed to load calendar data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReserved()
  }, [selectedDate, programId, duration])

  const handleNext = () => {
    if (!selectedDate || !selectedTime) return

    localStorage.setItem('selectedDate', selectedDate)
    localStorage.setItem('selectedTime', selectedTime)
    localStorage.setItem('program', programId)
    localStorage.setItem('lang', lang)
    localStorage.setItem('people', people.toString())

    router.push('/payment')
  }

  return (
    <main className="p-6 space-y-6">
      <button onClick={() => router.back()} className="text-sm text-blue-600 underline">
        ← Back
      </button>

      <h2 className="text-2xl font-bold">What schedule do you want?</h2>

      <div>
        <label className="block font-medium mb-1">Choose a date:</label>
        <input
          type="date"
          className="border px-4 py-2 rounded w-full max-w-xs"
          value={selectedDate}
          onChange={(e) => {
            setSelectedTime('')
            setSelectedDate(e.target.value)
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="font-medium">Choose a time:</p>
        {isLoading ? (
          <p>Loading available times...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => {
              const disabled = blockedSlots.includes(slot)

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  disabled={disabled}
                  className={`p-4 border rounded-xl transition ${
                    selectedTime === slot ? 'bg-black text-white' : ''
                  } ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
        disabled={!selectedDate || !selectedTime}
      >
        Continue →
      </button>
    </main>
  )
}
