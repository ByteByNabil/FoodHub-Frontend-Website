// User types
export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  image?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Provider types
export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  description?: string;
  address: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id?: string;
    name: string;
    email?: string;
  };
  meals?: Meal[];
}

// Category types
export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Meal types
export interface Meal {
  id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
  categoryId: string;
  providerId: string;
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: ProviderProfile;
  reviews?: Review[];
}

export interface MealFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface MealsResponse {
  data: Meal[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// Order types
export type OrderStatus = "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  price: number;
  meal?: Meal;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  totalPrice: number;
  status: OrderStatus;
  address: string;
  paymentStatus: PaymentStatus;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: { name: string };
  provider?: ProviderProfile;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  mealId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { name: string };
}

// Cart types
export interface CartItem {
  meal: Meal;
  quantity: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ message: string; path: string[] }>;
}
