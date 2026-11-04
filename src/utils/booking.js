export const TIME_SLOTS = {
  morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
  afternoon: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
  evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"],
};

export function to24Hour(time12) {
  if (!time12) return "";
  const [time, period] = String(time12).trim().split(" ");
  let [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "";
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatLocalDate(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateDisabled(date) {
  if (!date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today || date.getDay() === 6;
}

export function isSlotInPast(date, displayTime) {
  if (!date || !displayTime) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (selected < today) return true;
  if (selected > today) return false;
  return to24Hour(displayTime) <= `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function validateBookingForm(formData) {
  const errors = {};
  const name = (formData.name || "").trim();
  const email = (formData.email || "").trim();
  const phone = (formData.phone || "").trim();

  if (!name) errors.name = "Name is required";
  else if (name.length < 2) errors.name = "Enter a valid name";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";

  if (!phone) errors.phone = "Phone number is required";
  else {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a valid phone number";
  }

  return errors;
}

export function getBookingApiBase() {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  return isLocalhost ? "http://localhost:5000/api" : (import.meta.env.VITE_API_URL || "/api");
}
