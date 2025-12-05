// validation-patterns.ts
export const ValidationPatterns = {
  PHONE: /^\d{0,10}$/,
  PIN_CODE: /^\d{0,6}$/,
  AADHAR: /^\d{4} ?\d{0,8}$/,
  ALPHABETS_ONLY: /^[a-zA-Z\s]*$/,  // alphabets + spaces only (for names)
};
