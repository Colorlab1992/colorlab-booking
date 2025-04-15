// /app/api/reserve/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  if (!data.program || !data.date || !data.people) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  // 실제로는 DB 저장이 들어가야 함 (임시로 콘솔에 출력)
  console.log('[예약 데이터]', data);

  const reservationNumber = `RSV-${Date.now()}`;
  return NextResponse.json({ reservationNumber });
}