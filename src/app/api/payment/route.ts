import { NextRequest, NextResponse } from 'next/server'

// POST 요청으로만 처리
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. 전달받은 데이터에서 예약 정보와 결제 상태 추출
    const { paymentStatus, reservationInfo } = body

    if (paymentStatus !== 'success') {
      return NextResponse.json(
        { success: false, message: '결제가 실패했습니다.' },
        { status: 400 }
      )
    }

    // 2. 여기서 예약 정보 저장 로직을 넣을 수 있음
    // 예: DB에 저장하거나 로그 출력
    console.log('✅ 예약 확정 처리 완료')
    console.log(reservationInfo)

    // 3. 성공 응답 반환
    return NextResponse.json({ success: true, message: '예약이 확정되었습니다.' })
  } catch (error) {
    console.error('❌ 에러 발생:', error)
    return NextResponse.json({ success: false, message: '서버 에러' }, { status: 500 })
  }
}