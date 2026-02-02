import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Currency = "BRL" | "USD" | "EUR";

// NUMBER FORMATING
export function formatCurrency(value: number, currency?: Currency) {
  return (Math.round(value * 100) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const formatCurrencyNoSymbol = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function getDistanceInDays(to: Date, from?: Date): number {
  const safeFrom = from ? new Date(from) : new Date();
  const safeTo = new Date(to);
  const days = Math.ceil(
    (safeTo.getTime() - safeFrom.getTime()) / (1000 * 3600 * 24),
  );
  return days;
}

export function formatCurrencyToNumber(value: string) {
  // Remove currency symbol, spaces, and any other non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.,]/g, "");

  // Replace comma with dot for decimal point if needed
  const normalizedValue = cleanValue.replace(",", ".");

  // Parse to float and round to 2 decimal places
  const number = parseFloat(normalizedValue);

  // Return NaN if the string couldn't be parsed
  if (isNaN(number)) {
    return 0;
  }

  // Round to 2 decimal places
  return Math.round(number * 100) / 100;
}

// STRING FORMATING
export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\d]/g, ""); // Removes everything except digits
};
export function removeNonNumericalChars(input: string): string {
  return input.replace(/\D/g, "");
}

// CPF AND CNPJ VALIDATORS AND FORMATTERS
export function validateDocumentCode(documentCode: string) {
  const cleanedDocumentCode = removeSpecialCharacters(documentCode);

  if (cleanedDocumentCode.length <= 11) {
    return isValidCPF(cleanedDocumentCode);
  } else {
    return isValidCNPJ(cleanedDocumentCode);
  }
}
export const formatDocumentCode = (value?: string) => {
  if (!value) {
    return;
  }
  const cleanValue = removeSpecialCharacters(value);

  // Format CPF (11 digits)
  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // Format CNPJ (14 digits)
  return cleanValue
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};
export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove special characters

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false; // Invalid if all digits are the same or if length is not 11
  }

  let sum = 0;
  let remainder;

  // Validate first check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true; // CPF is valid
}
export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, ""); // Remove special characters

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false; // Invalid if all digits are the same or if length is not 14
  }

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  // Validate first check digit
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  // Validate second check digit
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true; // CNPJ is valid
}

// CEP VALIDATOR
export function isValidCEP(cep: string): boolean {
  cep = cep.replace(/[^\d]+/g, ""); // Remove special characters

  // A valid CEP must have exactly 8 digits
  if (cep.length !== 8) {
    return false;
  }

  // Check if all digits are the same (e.g., 00000000, 11111111)
  if (/^(\d)\1{7}$/.test(cep)) {
    return false;
  }

  return true; // CEP is valid
}

// PAGE QUERY STRING CONSTRUCTOR
export function constructQueryString(
  filters: Record<string, string>,
  page: number,
  perPage: number,
): string {
  const queryParams = new URLSearchParams({
    ...filters,
    page: String(page),
    perPage: String(perPage),
  });

  return queryParams.toString();
}

/**
 * Checks if a date is within a certain number of days from now.
 * @param expiryDateString - ISO string of the expiry date.
 * @param thresholdDays - Number of days to check against (default is 1).
 * @returns true if the date is within thresholdDays from now, false otherwise.
 */
export const isExpiringSoon = (
  expiryDateString: Date,
  thresholdDays = 1,
): boolean => {
  const expiryDate = new Date(expiryDateString);
  const now = new Date();

  const timeDiff = expiryDate.getTime() - now.getTime();
  const daysToExpire = timeDiff / (1000 * 60 * 60 * 24);

  return daysToExpire <= thresholdDays;
};

export function parseTextToItems(text: string) {
  const sections = text.split(/<\/br>\r\n<\/br>/g);
  return sections.map((section) => {
    const lines = section.trim().split(/<\/br>\r\n/g);
    return lines.map((line) => line.replace(/<\/br>/g, ""));
  });
}

export const formatCEP = (cep: string | undefined) => {
  if (!cep) return "Não informado";
  // Remove any non-digit characters
  const cleanCEP = cep.replace(/\D/g, "");
  // Format as 12345-678
  return cleanCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
};
