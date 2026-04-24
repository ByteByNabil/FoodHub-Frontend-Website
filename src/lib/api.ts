import type {
  ApiResponse,
  Category,
  Meal,
  MealFilters,
  MealsResponse,
  Order,
  ProviderProfile,
  Review,
  User,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PaymentResponseShape =
  | ApiResponse<{
      url?: string;
      checkoutUrl?: string;
      sessionUrl?: string;
      session?: {
        url?: string;
      };
    }>
  | {
      success?: boolean;
      message?: string;
      url?: string;
      checkoutUrl?: string;
      sessionUrl?: string;
      data?: {
        url?: string;
        checkoutUrl?: string;
        sessionUrl?: string;
        session?: {
          url?: string;
        };
      };
      session?: {
        url?: string;
      };
    };

function hasDirectPaymentUrlFields(
  response: PaymentResponseShape,
): response is Exclude<PaymentResponseShape, ApiResponse<unknown>> {
  return (
    "url" in response ||
    "checkoutUrl" in response ||
    "sessionUrl" in response ||
    "session" in response
  );
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  }

  // Auth endpoints
  async getSession() {
    return this.request<{ user: User | null }>("/api/auth/get-session");
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request("/api/categories");
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return this.request(`/api/categories/${id}`);
  }

  async createCategory(data: { name: string }): Promise<ApiResponse<Category>> {
    return this.request("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: { name: string }): Promise<ApiResponse<Category>> {
    return this.request(`/api/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request(`/api/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Meals
  async getMeals(filters?: MealFilters): Promise<ApiResponse<MealsResponse>> {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters?.page) params.set("page", filters.page.toString());
    if (filters?.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    return this.request(`/api/meals${queryString ? `?${queryString}` : ""}`);
  }

  async getMealById(id: string): Promise<ApiResponse<Meal>> {
    return this.request(`/api/meals/${id}`);
  }

  // Provider Meals
  async getMyMeals(): Promise<ApiResponse<Meal[]>> {
    return this.request("/api/meals/my/meals");
  }

  async getMyMealById(id: string): Promise<ApiResponse<Meal>> {
    return this.request(`/api/meals/my/meals/${id}`);
  }

  async createMeal(data: Partial<Meal>): Promise<ApiResponse<Meal>> {
    return this.request("/api/meals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMeal(id: string, data: Partial<Meal>): Promise<ApiResponse<Meal>> {
    return this.request(`/api/meals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteMeal(id: string): Promise<ApiResponse<Meal>> {
    return this.request(`/api/meals/${id}`, {
      method: "DELETE",
    });
  }

  // Providers
  async getProviders(): Promise<ApiResponse<ProviderProfile[]>> {
    return this.request("/api/providers");
  }

  async getProviderById(id: string): Promise<ApiResponse<ProviderProfile>> {
    return this.request(`/api/providers/${id}`);
  }

  async getMyProvider(): Promise<ApiResponse<ProviderProfile>> {
    return this.request("/api/providers/me");
  }

  async createProvider(data: Partial<ProviderProfile>): Promise<ApiResponse<ProviderProfile>> {
    return this.request("/api/providers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProvider(data: Partial<ProviderProfile>): Promise<ApiResponse<ProviderProfile>> {
    return this.request("/api/providers/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async approveProvider(id: string): Promise<ApiResponse<ProviderProfile>> {
    return this.request(`/api/providers/${id}/approve`, {
      method: "PATCH",
    });
  }

  // Orders
  async createOrder(data: {
    items: { mealId: string; quantity: number }[];
    address: string;
  }): Promise<ApiResponse<Order>> {
    return this.request("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return this.request("/api/orders");
  }

  async getProviderOrders(): Promise<ApiResponse<Order[]>> {
    return this.request("/api/orders/provider");
  }

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<Order>> {
    return this.request(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Reviews
  async createReview(data: {
    mealId: string;
    rating: number;
    comment?: string;
  }): Promise<ApiResponse<Review>> {
    return this.request("/api/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMealReviews(mealId: string): Promise<ApiResponse<Review[]>> {
    return this.request(`/api/reviews/meal/${mealId}`);
  }

  async getMealRating(mealId: string): Promise<ApiResponse<{ _avg: { rating: number }; _count: { rating: number } }>> {
    return this.request(`/api/reviews/meal/${mealId}/rating`);
  }

  // Admin
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.request("/api/admin/users");
  }

  async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
    return this.request(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return this.request("/api/admin/orders");
  }

  // Payments
  async createPayment(orderId: string): Promise<ApiResponse<{ url: string }>> {
    const response = await this.request<PaymentResponseShape>("/api/payments", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    });

    const url =
      response.data?.url ||
      response.data?.checkoutUrl ||
      response.data?.sessionUrl ||
      response.data?.session?.url ||
      (hasDirectPaymentUrlFields(response)
        ? response.url ||
          response.checkoutUrl ||
          response.sessionUrl ||
          response.session?.url
        : undefined);

    if (!url) {
      throw new Error(
        response.message ||
          "Payment session was created, but no Stripe checkout URL was returned",
      );
    }

    return {
      success: response.success ?? true,
      message: response.message,
      data: { url },
    };
  }
}

export const api = new ApiClient(API_URL);
