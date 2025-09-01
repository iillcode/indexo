import { NextRequest, NextResponse } from "next/server";

const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;

if (!LEMONSQUEEZY_API_KEY) {
  console.error("LEMONSQUEEZY_API_KEY is not configured");
}

// LemonSqueezy API types
interface LemonSqueezyProduct {
  id: string;
  type: "products";
  attributes: {
    store_id: number;
    name: string;
    slug: string;
    description: string;
    status: string;
    status_formatted: string;
    thumb_url: string;
    large_thumb_url: string;
    price: number;
    price_formatted: string;
    from_price: number | null;
    to_price: number | null;
    pay_what_you_want: boolean;
    buy_now_url: string;
    from_price_formatted: string | null;
    to_price_formatted: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
  relationships: {
    store: {
      links: {
        related: string;
        self: string;
      };
    };
    variants: {
      links: {
        related: string;
        self: string;
      };
    };
  };
  links: {
    self: string;
  };
}

interface LemonSqueezyVariant {
  id: string;
  type: "variants";
  attributes: {
    product_id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    is_subscription: boolean;
    interval: string | null;
    interval_count: number | null;
    has_free_trial: boolean;
    trial_interval: string | null;
    trial_interval_count: number | null;
    pay_what_you_want: boolean;
    min_price: number;
    suggested_price: number;
    status: string;
    status_formatted: string;
    created_at: string;
    updated_at: string;
  };
}

interface CheckoutRequest {
  productId: string;
  userId?: string;
  userEmail?: string;
  customPrice?: number;
  discountCode?: string;
}

interface CheckoutResponse {
  checkoutUrl: string;
  checkoutId: string;
  product: LemonSqueezyProduct;
}

// Get product details from LemonSqueezy
async function getProduct(productId: string): Promise<LemonSqueezyProduct> {
  const response = await fetch(
    `${LEMONSQUEEZY_API_URL}/products/${productId}`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LemonSqueezy product fetch error:", errorText);
    throw new Error(
      `Failed to fetch product: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data;
}

// Get product variants
async function getProductVariants(
  productId: string
): Promise<LemonSqueezyVariant[]> {
  const response = await fetch(
    `${LEMONSQUEEZY_API_URL}/products/${productId}/variants`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LemonSqueezy variants fetch error:", errorText);
    throw new Error(
      `Failed to fetch variants: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data;
}

// Create checkout session
async function createCheckout(
  product: LemonSqueezyProduct,
  variants: LemonSqueezyVariant[],
  request: CheckoutRequest
): Promise<{ checkoutUrl: string; checkoutId: string }> {
  const defaultVariant = variants[0];

  if (!defaultVariant) {
    throw new Error("No variants found for product");
  }

  const checkoutData: any = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_options: {
          button_color: "#ea580c", // Orange color to match the theme
          dark: true,
        },
        checkout_data: {
          custom: {},
        },
        preview: process.env.NODE_ENV === "development", // Preview mode for development
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: product.attributes.store_id.toString(),
          },
        },
        variant: {
          data: {
            type: "variants",
            id: defaultVariant.id,
          },
        },
      },
    },
  };

  // Add custom price if provided
  if (request.customPrice) {
    checkoutData.data.attributes.custom_price = request.customPrice;
  }

  // Add user data to custom fields
  if (request.userId) {
    checkoutData.data.attributes.checkout_data.custom.user_id = request.userId;
  }

  if (request.userEmail) {
    checkoutData.data.attributes.checkout_data.email = request.userEmail;
  }

  // Add discount code if provided
  if (request.discountCode) {
    checkoutData.data.attributes.checkout_data.discount_code =
      request.discountCode;
  }

  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify(checkoutData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LemonSqueezy checkout creation error:", errorText);
    throw new Error(
      `Failed to create checkout: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  return {
    checkoutUrl: data.data.attributes.url,
    checkoutId: data.data.id,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!LEMONSQUEEZY_API_KEY) {
      return NextResponse.json(
        { error: "LemonSqueezy API key not configured" },
        { status: 500 }
      );
    }

    const body: CheckoutRequest = await request.json();

    if (!body.productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    console.log("Creating checkout for product:", body.productId);

    // Fetch product details
    const product = await getProduct(body.productId);
    console.log("Product fetched:", product.attributes.name);

    // Fetch product variants
    const variants = await getProductVariants(body.productId);
    console.log("Variants fetched:", variants.length);

    // Create checkout session
    const checkout = await createCheckout(product, variants, body);
    console.log("Checkout created:", checkout.checkoutId);

    const response: CheckoutResponse = {
      checkoutUrl: checkout.checkoutUrl,
      checkoutId: checkout.checkoutId,
      product,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Checkout API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to create checkout",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!LEMONSQUEEZY_API_KEY) {
      return NextResponse.json(
        { error: "LemonSqueezy API key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch product details
    const product = await getProduct(productId);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product fetch API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
