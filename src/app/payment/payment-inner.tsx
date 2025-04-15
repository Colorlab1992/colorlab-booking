'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function PaymentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [method, setMethod] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)
  const [error, setError] = useState(false)

  // ✅ URL에서 날짜와 시간 가져오기
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const handlePayment = async () => {
    if (!method) {
      alert('결제 수단을 선택해주세요!')
      return
    }

    if (!date || !time) {
      alert('날짜와 시간을 다시 선택해주세요.')
      return
    }

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify({
          paymentStatus: isSuccess ? 'success' : 'fail',
          reservationInfo: {
            name: '홍길동',
            date,
            time,
            program: '1:1 컨설팅',
            method,
          },
        }),
      })

      if (!res.ok) throw new Error('결제 실패')

      const data = await res.json()
      console.log(data)

      if (data.success) {
        router.push('/confirm')
      } else {
        throw new Error('결제 실패 응답')
      }
    } catch (err) {
      console.error('❌ 결제 실패:', err)
      setError(true)
    }
  }

  return (
    <main className="p-6 space-y-6">
      {/* ✅ 뒤로 가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 underline"
      >
        ← 뒤로 가기
      </button>

      <h2 className="text-2xl font-bold">결제 수단을 선택하세요</h2>

      {/* 선택된 날짜와 시간 표시 */}
      <div className="text-gray-800 text-md">
        <p>📅 예약 날짜: <strong>{date || '미선택'}</strong></p>
        <p>⏰ 예약 시간: <strong>{time || '미선택'}</strong></p>
      </div>

      {/* 결제 수단 버튼 */}
      <div className="flex gap-4">
        {['PayPal', 'WeChat', 'Wise'].map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`border rounded-xl px-4 py-2 ${
              method === m ? 'bg-black text-white' : ''
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 성공/실패 테스트 버튼 */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setIsSuccess(true)}
          className={`border rounded-lg px-3 py-1 ${
            isSuccess ? 'bg-green-600 text-white' : ''
          }`}
        >
          성공 테스트
        </button>
        <button
          onClick={() => setIsSuccess(false)}
          className={`border rounded-lg px-3 py-1 ${
            !isSuccess ? 'bg-red-600 text-white' : ''
          }`}
        >
          실패 테스트
        </button>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        className="bg-black text-white px-6 py-3 rounded-xl mt-6"
      >
        결제 시도
      </button>

      {/* 결제 실패 메시지 */}
      {error && (
        <div className="text-red-600 mt-4">
          ❌ 결제가 실패했습니다. 다시 시도하거나 아래로 문의해주세요.<br />
          <br />
          📩 이메일: example@email.com <br />
          📱 인스타그램: @your_instagram <br />
          🧧 샤오홍슈: @your_xhs <br />
          💬 위챗: your_wechat_id
        </div>
      )}
    </main>
  )
}