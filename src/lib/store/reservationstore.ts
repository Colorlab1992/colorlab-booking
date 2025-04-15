// /lib/store/reservationStore.ts
import { create } from 'zustand';

interface ReservationState {
  program: string;
  people: number;
  date: string;
  time: string;
  setReservation: (data: Partial<ReservationState>) => void;
  resetReservation: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  program: '',
  people: 1,
  date: '',
  time: '',
  setReservation: (data) => set((state) => ({ ...state, ...data })),
  resetReservation: () => set({
    program: '',
    people: 1,
    date: '',
    time: '',
  }),
}));