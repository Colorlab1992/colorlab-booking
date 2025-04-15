import { NextRequest, NextResponse } from 'next/server'
import { confirmReservation } from '@/lib/reservation-db'        // ✅ 절대경로로 변경
import { sendMail } from '@/lib/mail/sendmail'                   // ✅ 절대경로로 변경

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('📦 Webhook Received:', JSON.stringify(body, null, 2))

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = body.resource?.id
      const email = body.resource?.payer?.email_address

      // ✅ 결제 상세 정보 로그 (수기 확인용)
      const payer = body.resource?.payer
      const amount = body.resource?.purchase_units?.[0]?.amount?.value
      const program = body.resource?.purchase_units?.[0]?.description

      console.log('✅ 결제 완료됨:')
      console.log('👤 이름:', payer?.name?.given_name, payer?.name?.surname)
      console.log('📧 이메일:', payer?.email_address)
      console.log('💰 금액:', amount)
      console.log('🎯 프로그램:', program)
      console.log('🧾 주문번호:', orderId)

      // ✅ 예약 확정 처리
      confirmReservation(orderId, email)

      // ✅ 메일 알림 전송
      if (email) {
        await sendMail({
          to: email,
          subject: '예약이 확정되었습니다',
          html: `
            <h2>🎉 예약 확정 안내</h2>
            <p>안녕하세요, 고객님!</p>
            <p>아래와 같이 예약이 확정되었습니다.</p>
            <ul>
              <li><strong>예약 번호:</strong> ${orderId}</li>
              <li><strong>확정 시간:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <p>방문해 주셔서 감사합니다.</p>
            <p>Color Lab</p>
          `,
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook 처리 중 오류 발생:', error)
    return new NextResponse('Webhook Error', { status: 500 })
  }
}
