// LemonSqueezy API client
export interface LemonSqueezyProduct {
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

export interface CheckoutRequest {
  productId: string;
  userId?: string;
  userEmail?: string;
  customPrice?: number;
  discountCode?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  checkoutId: string;
  product: LemonSqueezyProduct;
}

export interface ProductResponse {
  product: LemonSqueezyProduct;
}

export class LemonSqueezyService {
  private static baseUrl = "/api/lemonsqueezy";

  /**
   * Fetch product details
   */
  static async getProduct(productId: string): Promise<LemonSqueezyProduct> {
    try {
      const response = await fetch(
        `${this.baseUrl}/checkout?productId=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: ProductResponse = await response.json();
      return data.product;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      throw error;
    }
  }

  /**
   * Create a checkout session
   */
  static async createCheckout(
    request: CheckoutRequest
  ): Promise<CheckoutResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: CheckoutResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to create checkout:", error);
      throw error;
    }
  }

  /**
   * Redirect to LemonSqueezy checkout
   */
  static redirectToCheckout(checkoutUrl: string): void {
    // Open in same window for better UX
    window.location.href = checkoutUrl;
  }

  /**
   * Create checkout and redirect (convenience method)
   */
  static async checkoutAndRedirect(request: CheckoutRequest): Promise<void> {
    try {
      const checkout = await this.createCheckout(request);
      this.redirectToCheckout(checkout.checkoutUrl);
    } catch (error) {
      console.error("Checkout failed:", error);
      throw error;
    }
  }
}
