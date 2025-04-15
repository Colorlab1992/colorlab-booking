'use client';

import { useState } from 'react';

export default function DatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const isDateValid = (selectedDate: Date): boolean => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2); // 오늘 기준 2일 후부터 예약 가능

    // 시, 분, 초 제거 (날짜만 비교)
    selectedDate.setHours(0, 0, 0, 0);
    minDate.setHours(0, 0, 0, 0);

    return selectedDate >= minDate;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (isDateValid(date)) {
      setSelectedDate(date);
      setError('');
    } else {
      setSelectedDate(null);
      setError('오늘과 내일은 예약할 수 없습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="date" className="font-semibold">예약 날짜 선택</label>
      <input
        type="date"
        id="date"
        onChange={handleDateChange}
        className="border p-2 rounded"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {selectedDate && (
        <p className="text-green-600 text-sm">
          선택한 날짜: {selectedDate.toDateString()}
        </p>
      )}
    </div>
  );
}