import { format, parseISO } from "date-fns";

interface EmailParams {
  name: string;
  email: string;
  date: string;
  time: string;
  bookingId: string;
}

export async function sendConfirmationEmail({ name, email, date, time, bookingId }: EmailParams) {
  try {
    const formattedDate = format(parseISO(date), "yyyy-MM-dd");
    
    // Call Vercel Function (API Route)
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        date: formattedDate,
        time,
        bookingId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }
    
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    // Fallback or silently fail (user still sees success UI)
    return false;
  }
}
