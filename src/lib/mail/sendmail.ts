import nodemailer from 'nodemailer'

type MailOptions = {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: MailOptions) {
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env

  if (!EMAIL_SERVICE || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    console.error('❌ 이메일 환경 변수가 누락되었습니다.')
    throw new Error('이메일 설정이 올바르지 않습니다.')
  }

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })

    console.log('✅ 이메일 전송 완료:', info.messageId)
  } catch (err) {
    console.error('❌ 이메일 전송 실패:', err)
    throw new Error('메일 전송 실패')
  }
}
