import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { formatISO, startOfDay, endOfDay } from 'date-fns' // ⛔ addHours 제거됨
import path from 'path'
import { readFileSync } from 'fs'

// ✅ 환경변수 기반 calendarId 매핑
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
    const { program, date } = body

    const calendarId = calendarMap[program]
    if (!calendarId) {
      return NextResponse.json({ error: 'Unknown program' }, { status: 400 })
    }

    // ✅ 서비스 계정 키 파일 로드
    const keyPath = path.join(process.cwd(), 'credentials', 'google-service-account.json')
    const keyFile = readFileSync(keyPath, 'utf-8')
    const credentials = JSON.parse(keyFile)

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    const timeMin = formatISO(startOfDay(new Date(date)))
    const timeMax = formatISO(endOfDay(new Date(date)))

    const eventsRes = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = eventsRes.data.items || []

    const reservations = events.map((event) => ({
      start: event.start?.dateTime || '',
      end: event.end?.dateTime || '',
    }))

    return NextResponse.json({ reservations })
  } catch (err) {
    console.error('Error fetching calendar:', err)
    return NextResponse.json({ error: 'Failed to load calendar' }, { status: 500 })
  }
}
