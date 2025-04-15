// /app/components/ConfirmButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useReservationStore } from '@/lib/store/reservationstore';

export default function ConfirmButton() {
  const router = useRouter();
  const { program, date, people } = useReservationStore();

  const handleConfirm = async () => {
    const res = await fetch('/api/reserve', {
      method: 'POST',
      body: JSON.stringify({ program, date, people }),
    });

    const result = await res.json();

    if (res.ok) {
      router.push(`/confirm?reservationNumber=${result.reservationNumber}`);
    } else {
      alert('예약에 실패했습니다.');
    }
  };

  return (
    <button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded">
      예약 확정
    </button>
  );
}