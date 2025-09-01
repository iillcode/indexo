# LemonSqueezy Integration Guide

This guide explains how to set up and use the LemonSqueezy integration in your Next.js application.

## Overview

The integration provides:

- Product fetching from LemonSqueezy API
- Checkout session creation
- Webhook handling for payment events
- User association for orders

## Setup Instructions

### 1. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# LemonSqueezy API Configuration
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Update Product Configuration

Edit `/lib/lemonsqueezy-config.ts` and update:

```typescript
export const LEMONSQUEEZY_CONFIG = {
  PRODUCT_ID: "YOUR_PRODUCT_ID", // Replace with your actual product ID
  STORE_ID: "YOUR_STORE_ID", // Replace with your actual store ID
  // ... other configurations
};
```

### 3. Get Your LemonSqueezy Credentials

1. **API Key**: Go to Settings > API in your LemonSqueezy dashboard
2. **Product ID**: Found in your product URL (e.g., `/products/123456`)
3. **Store ID**: Found in your store settings
4. **Webhook Secret**: Created when setting up webhooks

## API Endpoints

### GET `/api/lemonsqueezy/checkout?productId={id}`

Fetches product details from LemonSqueezy.

**Response:**

```json
{
  "product": {
    "id": "123456",
    "attributes": {
      "name": "Product Name",
      "price": 9999,
      "price_formatted": "$99.99",
      "description": "Product description"
      // ... other product attributes
    }
  }
}
```

### POST `/api/lemonsqueezy/checkout`

Creates a checkout session.

**Request:**

```json
{
  "productId": "123456",
  "userId": "user_123", // Optional
  "userEmail": "user@example.com", // Optional
  "customPrice": 9999, // Optional, price in cents
  "discountCode": "DISCOUNT10" // Optional
}
```

**Response:**

```json
{
  "checkoutUrl": "https://checkout.lemonsqueezy.com/...",
  "checkoutId": "checkout_123",
  "product": {
    /* product details */
  }
}
```

## Usage Examples

### Basic Checkout

```typescript
import { LemonSqueezyService } from "@/lib/lemonsqueezy";

// Create checkout and redirect
const handleCheckout = async () => {
  try {
    await LemonSqueezyService.checkoutAndRedirect({
      productId: "123456",
    });
  } catch (error) {
    console.error("Checkout failed:", error);
  }
};
```

### Checkout with User Data

```typescript
const handleCheckout = async () => {
  try {
    await LemonSqueezyService.checkoutAndRedirect({
      productId: "123456",
      userId: currentUser.id,
      userEmail: currentUser.email,
      discountCode: "LAUNCH50",
    });
  } catch (error) {
    console.error("Checkout failed:", error);
  }
};
```

### Fetching Product Details

```typescript
import { LemonSqueezyService } from "@/lib/lemonsqueezy";

const loadProduct = async () => {
  try {
    const product = await LemonSqueezyService.getProduct("123456");
    console.log("Product:", product.attributes.name);
    console.log("Price:", product.attributes.price_formatted);
  } catch (error) {
    console.error("Failed to load product:", error);
  }
};
```

## Webhook Integration

The webhook handler at `/supabase/functions/stripe-webhook` already supports LemonSqueezy events:

- `order_created` - Creates order and payment records
- `order_refunded` - Updates refund status
- `subscription_*` - Handles subscription events
- `license_key_*` - Manages license keys

### Webhook Setup in LemonSqueezy

1. Go to Settings > Webhooks in your LemonSqueezy dashboard
2. Add webhook URL: `https://your-domain.com/functions/v1/stripe-webhook`
3. Select events you want to handle
4. Set the webhook secret in your environment variables

## Database Schema

The integration uses these tables:

- `payments` - Stores payment records
- `lemon_orders` - Stores LemonSqueezy-specific order data
- `subscriptions` - Stores subscription data

User association is handled automatically via email lookup.

## Error Handling

The integration includes comprehensive error handling:

- API errors are caught and logged
- User-friendly error messages are displayed
- Fallback values are used when API calls fail
- Loading states are managed during API calls

## Security Considerations

- API keys are server-side only
- Webhook signatures are verified
- User data is handled securely
- CORS is properly configured

## Testing

For testing, the integration automatically uses LemonSqueezy's test mode in development environment.

## Troubleshooting

### Common Issues

1. **"Product not found"** - Check your product ID in the configuration
2. **"API key not configured"** - Ensure `LEMONSQUEEZY_API_KEY` is set
3. **"Checkout creation failed"** - Verify your store ID and product variants
4. **"Webhook signature invalid"** - Check your webhook secret configuration

### Debug Mode

Set `NODE_ENV=development` to enable preview mode and detailed logging.

## Support

For issues with the LemonSqueezy API, refer to their [official documentation](https://docs.lemonsqueezy.com/).
