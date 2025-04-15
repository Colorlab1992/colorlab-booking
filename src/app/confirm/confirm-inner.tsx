'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function ConfirmInner() {
  const searchParams = useSearchParams()
  const reservationNumber = searchParams.get('reservationNumber')
  const router = useRouter()

  return (
    <main className="p-6 space-y-4">
      {/* ✅ 뒤로 가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 underline"
      >
        ← 뒤로 가기
      </button>

      <h2 className="text-2xl font-bold">예약이 완료되었습니다!</h2>

      <div className="space-y-2">
        <p><strong>예약번호:</strong> {reservationNumber}</p>
      </div>

      <p className="text-gray-500">준비사항 및 유의사항은 이메일로 안내드릴 예정입니다.</p>
    </main>
  )
}