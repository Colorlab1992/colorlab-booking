'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import Image from 'next/image'

export default function PaymentPage() {
  const router = useRouter()
  const [reservation, setReservation] = useState({
    program: '',
    lang: '',
    people: 1,
    date: '',
    time: '',
  })

  const programNames: Record<string, string> = {
    'personal-full-en': 'Personal Color (Full-package)',
    'personal-semi-en': 'Personal Color (Semi-package)',
    'bodytype-en': 'Body-type Analysis',
    'total-en': 'Total Package',
    'personal-full-zh': 'Personal Color (Full-package)',
    'personal-semi-zh': 'Personal Color (Semi-package)',
    'bodytype-zh': 'Body-type Analysis',
    'total-zh': 'Total Package',
  }

  const languageLabels: Record<string, string> = {
    en: 'English',
    zh: '中文',
  }

  useEffect(() => {
    const program = localStorage.getItem('program') || ''
    const lang = localStorage.getItem('lang') || ''
    const people = Number(localStorage.getItem('people') || '1')
    const date = localStorage.getItem('selectedDate') || ''
    const time = localStorage.getItem('selectedTime') || ''

    const newReservation = { program, lang, people, date, time }
    setReservation(newReservation)

    const registerReservation = async () => {
      try {
        const res = await fetch('/api/calendar/reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReservation),
        })
        if (!res.ok) throw new Error('Failed to register')
      } catch (err) {
        console.error('Error during reservation:', err)
      }
    }

    registerReservation()
  }, [])

  const displayProgram = programNames[reservation.program] || reservation.program
  const displayLanguage = languageLabels[reservation.lang] || reservation.lang
  const totalPrice = reservation.people * 50000

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto text-gray-800">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">🧾 Reservation Summary</h1>

      <div className="space-y-2 text-base">
        <p><strong>Program:</strong> {displayProgram}</p>
        <p><strong>Language:</strong> {displayLanguage}</p>
        <p><strong>People:</strong> {reservation.people}</p>
        <p><strong>Date:</strong> {reservation.date}</p>
        <p><strong>Time:</strong> {reservation.time}</p>
      </div>

      <div className="border-t pt-4 text-xl font-semibold">
        Total Deposit: ₩{totalPrice.toLocaleString()}
        <span className="block text-sm text-gray-500">
          (₩50,000 per person)
        </span>
      </div>

      {(reservation.lang === 'en' || reservation.lang === 'zh') && (
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          }}
        >
          <div className="mt-6">
            <PayPalButtons
              style={{ layout: 'horizontal', color: 'blue', label: 'pay' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'KRW',
                        value: totalPrice.toString(),
                      },
                      description: displayProgram,
                    },
                  ],
                })
              }}
              onApprove={async (data, actions) => {
                await actions.order?.capture()
                alert('✅ Payment successful! Redirecting...')
                router.push('/confirm')
              }}
              onError={(err) => {
                console.error(err)
                alert('❌ PayPal payment failed.')
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}

      {reservation.lang === 'zh' && (
        <div className="text-center mt-6">
          <p className="font-semibold">Or pay with WeChat</p>
          <div className="flex justify-center">
            <Image
              src="/wechat-qr.png"
              alt="WeChat QR Code"
              width={160}
              height={160}
              className="rounded"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-center text-gray-500 mt-4">
        This is a test interface. Real payment system will be integrated soon.
      </p>
    </main>
  )
}
