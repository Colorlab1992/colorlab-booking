'use client'

import { Suspense } from 'react'
import ConfirmInner from './confirm-inner'

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="p-6">로딩 중...</div>}>
      <ConfirmInner />
    </Suspense>
  )
}