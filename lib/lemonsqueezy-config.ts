// LemonSqueezy configuration
export const LEMONSQUEEZY_CONFIG = {
  // Replace these with your actual LemonSqueezy values
  PRODUCT_ID: "622519", // Your LemonSqueezy product ID
  STORE_ID: "208288", // Your LemonSqueezy store ID

  // Checkout customization
  CHECKOUT_OPTIONS: {
    button_color: "#ea580c", // Orange color matching your theme
    dark: true, // Use dark theme for checkout
  },

  // Product pricing (for fallback display)
  FALLBACK_PRICE: "$79",
  ORIGINAL_PRICE: "$349",
  DISCOUNT_AMOUNT: "$270 off",

  // Checkout data
  DISCOUNT_CODE: "LAUNCH270", // Optional discount code
};

export const LEMONSQUEEZY_ENDPOINTS = {
  API_BASE: "https://api.lemonsqueezy.com/v1",
  PRODUCTS: "/products",
  VARIANTS: "/variants",
  CHECKOUTS: "/checkouts",
};

export const ENVIRONMENT = {
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  API_KEY: process.env.LEMONSQUEEZY_API_KEY,
  WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
};
