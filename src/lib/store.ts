import { Booking } from "./types";

const STORAGE_KEY = "whx_bookings_2026";

export function getBookings(): Booking[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  return newBooking;
}

export function cancelBooking(id: string) {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  saveBookings(filtered);
}

export function updateBooking(id: string, updates: Partial<Booking>) {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    saveBookings(bookings);
  }
}

export function isSlotAvailable(date: string, time: string): boolean {
  const bookings = getBookings();
  // Simple check: is there already a booking at this time?
  // Assuming 1 concurrent booking allowed per slot as per requirement "30 min interval reservation system" usually implies limited capacity.
  // Requirement says "Real-time booking availability display" and "Prevent duplicate booking".
  // Assuming 1 slot = 1 meeting capacity.
  return !bookings.some((b) => b.date === date && b.time === time);
}

export function getBookingsByEmail(email: string): Booking[] {
  const bookings = getBookings();
  return bookings.filter((b) => b.email.toLowerCase() === email.toLowerCase());
}
