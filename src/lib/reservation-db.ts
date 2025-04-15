type ReservationStatus = 'pending' | 'confirmed'

interface Reservation {
  orderId: string
  status: ReservationStatus
  email?: string
}

export const reservationDB: Reservation[] = []

export function confirmReservation(orderId: string, email?: string) {
  const existing = reservationDB.find((r) => r.orderId === orderId)
  if (existing) {
    existing.status = 'confirmed'
    if (email) existing.email = email
  } else {
    reservationDB.push({ orderId, status: 'confirmed', email })
  }
}
