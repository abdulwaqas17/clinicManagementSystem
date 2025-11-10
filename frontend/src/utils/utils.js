// utils/formatTime.js
export const formatTo12Hour = (time24) => {
  if (!time24) return "";

  // "09:00" → ["09", "00"]
  const [hours, minutes] = time24.split(":").map(Number);

  // 12-hour format calculation
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12; // 0 or 12 ko handle karta hai
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // return final formatted string
  return `${formattedHour.toString().padStart(2, "0")}:${formattedMinutes} ${ampm}`;
};
