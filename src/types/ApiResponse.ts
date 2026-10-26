export interface FieldError {
    field: string;
    message: string;
}

export interface ApiSuccess<T> {
    success: true;
    message: string | null;
    data: T;
}

export interface ApiFailure {
    success: false;
    message: string;
    errors?: FieldError[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface Paginated<T> {
    items: T[];
    page: number;
    perPage: number;
    total: number;
}

export interface PageQuery {
    page?: number;
    perPage?: number;
}
