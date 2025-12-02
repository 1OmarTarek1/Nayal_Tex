// Convert western digits to Arabic-Indic digits
export const toArabicDigits = (input) => {
  if (input === null || input === undefined) return input;
  const map = { '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩' };
  return String(input).replace(/[0-9]/g, d => map[d]);
};

// Convert Arabic-Indic digits back to Western digits
export const toWesternDigits = (input) => {
  if (input === null || input === undefined) return input;
  const map = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
  return String(input).replace(/[٠-٩]/g, d => map[d]);
};
