export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
