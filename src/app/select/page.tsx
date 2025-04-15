'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SelectPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const isDateValid = (value: string) => {
    const selected = new Date(value)
    const today = new Date()
    const minDate = new Date()
    minDate.setDate(today.getDate() + 2)

    selected.setHours(0, 0, 0, 0)
    minDate.setHours(0, 0, 0, 0)

    return selected >= minDate
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (isDateValid(value)) {
      setSelectedDate(value)
      setError('')
    } else {
      setSelectedDate('')
      setError('오늘과 내일은 예약할 수 없습니다.')
    }
  }

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) {
      setError('날짜를 먼저 선택해주세요.')
      return
    }
    router.push(`/payment?date=${selectedDate}&time=${time}`)
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      {/* ✅ 뒤로 가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 underline"
      >
        ← 뒤로 가기
      </button>

      <h1 className="text-2xl font-bold">날짜 및 시간 선택</h1>

      {/* 날짜 선택 */}
      <div className="mb-4">
        <label htmlFor="date" className="block font-semibold mb-2">
          날짜 선택
        </label>
        <input
          type="date"
          id="date"
          onChange={handleDateChange}
          className="border p-2 rounded w-full"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {selectedDate && (
          <p className="text-green-600 text-sm mt-1">
            선택된 날짜: {selectedDate}
          </p>
        )}
      </div>

      {/* 시간 선택 */}
      <div className="grid grid-cols-2 gap-4">
        {['10:00', '13:00', '15:00', '17:00'].map((time) => (
          <button
            key={time}
            className="border rounded p-4 hover:bg-gray-100"
            onClick={() => handleTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </main>
  )
}