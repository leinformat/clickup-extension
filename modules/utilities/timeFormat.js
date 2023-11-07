// Funtion to Time Format
export const convertToTimeFormat = (seconds, format) =>{
  if (!seconds) return "0h";

  if (format == "h") {
    // Calculate hours
    const hours = seconds / 3600000;

    // Return the time in "Xh" format
    return hours.toFixed(2) + "h";
  }
}