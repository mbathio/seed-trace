// backend/src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
