import { removeNonNumericalChars } from "@/lib/utils";

// Client side storage
export const CART_COOKIE_NAME = "dznes_cart";
export const REFRESH_TOKEN = "dzns.ecommerce.user";
export const DATABASE_DOMAIN = "localhost";

// Company information
export const COMPANY_NAME = "Kalli Fashion";
export const COMPANY_CNPJ = "17.685.726/0001-08";
export const SAC_EMAIL = "contato@kallifashion.com.br";
export const COMPANY_TELEPHONE_NUMBER = "(11) 3331-8441";
export const COMPANY_TELEPHONE_NUMBER_2 = "(11) 2291-3800";

export const COMPANY_WHATSAPP_NUMBER = "(11) 99525-8441";
export const COMPANY_WHATSAPP_ASSISTANT = "(11) 91276-8197";
export const WHATSAPP_MESSAGE =
  "Olá, vim da loja virtual e gostaria de falar com uma atendente.";
export const WHATSAPP_URL = `https://api.whatsapp.com/send/?phone=${removeNonNumericalChars(COMPANY_WHATSAPP_NUMBER)}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}&type=phone_number&app_absent=0`;

export const COMPANY_ADDRESS_ZIP_CODE = "03011-011";
export const COMPANY_ADDRESS_STREET = "Rua Miller 231, Brás";
export const COMPANY_ADDRESS_STATE = "SP";
export const COMPANY_ADDRESS_CITY = "SÃO PAULO";
export const COMPANY_COUNTRY = "Brasil";
export const COMPANY_INSTAGRAM = "kallifashion";

// Store settings
export const STORE_URL = "https://kalli.com.br";
export const LOGO_PNG = "/logo.svg";
export const INSTALLMENTS = 5;
export const MINIMUM_INSTALLMENT_VALUE = 200;
export const PIX_DISCOUNT_PERCENTAGE = 0.1;
export const MINIMUM_PURCHASE_ITEM_QUANTITY = 12;
export const UP_LOGO_SVG = "/logo.svg";

export const STANDARD_SIZES = [
  { letter: "P", number: "38" },
  { letter: "M", number: "40" },
  { letter: "G", number: "42" },
  { letter: "GG", number: "44" },
];

export const UNIVERSAL_SIZE = { letter: "UN", number: "0" };
