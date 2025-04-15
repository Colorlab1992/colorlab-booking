import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import path from 'path'
import { readFileSync } from 'fs'

// ✅ 환경변수 기반 calendarMap
const calendarMap: Record<string, string> = {
  'personal-full-en': process.env.CALENDAR_ID_PERSONAL_FULL_EN!,
  'personal-semi-en': process.env.CALENDAR_ID_PERSONAL_SEMI_EN!,
  'bodytype-en': process.env.CALENDAR_ID_BODYTYPE_EN!,
  'total-en': process.env.CALENDAR_ID_TOTAL_EN!,

  'personal-full-zh': process.env.CALENDAR_ID_PERSONAL_FULL_ZH!,
  'personal-semi-zh': process.env.CALENDAR_ID_PERSONAL_SEMI_ZH!,
  'bodytype-zh': process.env.CALENDAR_ID_BODYTYPE_ZH!,
  'total-zh': process.env.CALENDAR_ID_TOTAL_ZH!,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { program, lang, people, date, time } = body

    if (!program || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const calendarId = calendarMap[program]
    if (!calendarId) {
      return NextResponse.json({ error: 'Unknown program' }, { status: 400 })
    }

    // 🔐 서비스 계정 키 파일 불러오기
    const keyPath = path.join(process.cwd(), 'credentials', 'google-service-account.json')
    const keyFile = readFileSync(keyPath, 'utf-8')
    const credentials = JSON.parse(keyFile)

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // 🕒 시작/종료 시간 계산
    const startDateTime = new Date(`${date}T${time}:00+09:00`)
    const endDateTime = new Date(startDateTime.getTime() + people * 60 * 60 * 1000)

    // 📅 구글 캘린더에 일정 등록
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `예약: ${program}`,
        description: `언어: ${lang} / 인원: ${people}명`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Seoul',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Seoul',
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Google Calendar 예약 실패:', err)
    return NextResponse.json({ error: 'Failed to register reservation' }, { status: 500 })
  }
}
