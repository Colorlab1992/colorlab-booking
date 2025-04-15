import { Suspense } from 'react'
import SchedulePageInner from './schedulepageinner'

export default function SchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulePageInner />
    </Suspense>
  )
}
