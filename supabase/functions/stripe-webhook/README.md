# Payment Webhook Handler (Stripe & LemonSqueezy)

This Supabase Edge Function handles webhook events from both Stripe and LemonSqueezy for payment processing and subscription management.

## Supported Events

### Stripe Events

- `checkout.session.completed` - Updates payment status when checkout is completed
- `payment_intent.succeeded` - Handles successful payment intents
- `payment_intent.payment_failed` - Handles failed payment intents
- `invoice.payment_succeeded` - Records successful subscription payments
- `invoice.payment_failed` - Records failed subscription payments
- `customer.subscription.created` - Creates new subscription records
- `customer.subscription.updated` - Updates existing subscription records
- `customer.subscription.deleted` - Marks subscriptions as canceled

### LemonSqueezy Events

- `order_created` - Creates new order and payment records
- `order_refunded` - Updates order refund status
- `subscription_created` - Creates new subscription records
- `subscription_updated` - Updates existing subscription records
- `subscription_cancelled` - Marks subscriptions as canceled

## Setup Instructions

### 1. Deploy the Edge Function

```bash
# Deploy to Supabase
supabase functions deploy stripe-webhook

# Or rename to payment-webhook for clarity
supabase functions deploy payment-webhook
```

### 2. Environment Variables

Set the following environment variables in your Supabase project:

```bash
# Required for Stripe
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Required for LemonSqueezy
LEMONSQUEEZY_WEBHOOK_SECRET=your_lemonsqueezy_webhook_secret_here

# Required for both
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Configure Webhooks

#### Stripe Webhook

1. Go to your Stripe Dashboard
2. Navigate to Webhooks
3. Add a new webhook endpoint pointing to:
   ```
   https://your-project.supabase.co/functions/v1/stripe-webhook
   ```
4. Select the events you want to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

#### LemonSqueezy Webhook

1. Go to your LemonSqueezy Dashboard
2. Navigate to Settings > Webhooks
3. Add a new webhook endpoint pointing to:
   ```
   https://your-project.supabase.co/functions/v1/stripe-webhook
   ```
4. Select the events you want to listen to:
   - `affiliate_activated`
   - `order_created`
   - `order_refunded`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_expired`
   - `subscription_paused`
   - `subscription_unpaused`
   - `subscription_payment_failed`
   - `subscription_payment_success`
   - `subscription_payment_recovered`
   - `subscription_payment_refunded`
   - `subscription_plan_changed`
   - `license_key_created`
   - `license_key_updated`

### 4. Database Schema

The function expects the following tables:

#### Updated Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID,
  plan_id TEXT,
  plan_name TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  session_id TEXT,
  payment_intent_id TEXT,
  payment_method TEXT DEFAULT 'stripe_checkout',
  customer_email TEXT,
  stripe_customer_id TEXT,
  -- LemonSqueezy specific fields
  order_id TEXT,
  order_number BIGINT,
  identifier TEXT,
  store_id BIGINT,
  lemon_customer_id BIGINT,
  product_id BIGINT,
  variant_id BIGINT,
  product_name TEXT,
  variant_name TEXT,
  price_id BIGINT,
  quantity INTEGER DEFAULT 1,
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  tax_rate DECIMAL(5,4),
  tax_name TEXT,
  tax_inclusive BOOLEAN DEFAULT FALSE,
  discount_total DECIMAL(10,2),
  setup_fee DECIMAL(10,2),
  refunded BOOLEAN DEFAULT FALSE,
  refunded_amount DECIMAL(10,2),
  refunded_at TIMESTAMP WITH TIME ZONE,
  test_mode BOOLEAN DEFAULT FALSE,
  currency_rate DECIMAL(12,8),
  total_formatted TEXT,
  subtotal_formatted TEXT,
  tax_formatted TEXT,
  discount_formatted TEXT,
  setup_fee_formatted TEXT,
  refunded_amount_formatted TEXT,
  receipt_url TEXT,
  provider TEXT DEFAULT 'stripe',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

#### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id TEXT UNIQUE,
  customer_id TEXT,
  status TEXT NOT NULL,
  plan_id TEXT,
  plan_name TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## Security Features

- **Webhook Signature Verification**: Validates both Stripe and LemonSqueezy webhook signatures to prevent unauthorized requests
- **Multi-Provider Support**: Automatically detects and handles webhooks from different payment providers
- **Row Level Security**: Uses Supabase RLS policies to ensure data access control
- **Error Handling**: Comprehensive error handling and logging for both providers

## Usage Example

The webhook handler automatically processes events from both Stripe and LemonSqueezy and updates your database. You can query the data like:

```sql
-- Get user's payments (from both providers)
SELECT * FROM payments WHERE user_id = auth.uid();

-- Get user's subscriptions
SELECT * FROM subscriptions WHERE user_id = auth.uid();

-- Filter by provider
SELECT * FROM payments WHERE provider = 'lemonsqueezy' AND user_id = auth.uid();
SELECT * FROM payments WHERE provider = 'stripe' AND user_id = auth.uid();
```

## Testing

You can test the webhook using Stripe CLI or LemonSqueezy webhook testing:

### Stripe Testing

```bash
# Forward webhooks to your local function
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

### LemonSqueezy Testing

```bash
# Use LemonSqueezy's webhook testing tools or manually send test payloads
# to your webhook endpoint with proper signatures
```

## Error Handling

The function includes comprehensive error handling for both providers:

- Invalid signatures return 400 status
- Database errors are logged and handled gracefully
- Unhandled events are logged for debugging
- Provider-specific error handling for different webhook formats

## Monitoring

Monitor webhook activity through:

- Supabase function logs
- Stripe webhook dashboard
- LemonSqueezy webhook logs
- Database records in payments/subscriptions tables
