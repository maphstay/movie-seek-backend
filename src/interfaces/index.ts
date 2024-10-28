export interface IPaginationMetaData {
  page: number;
  limit: number;
  totalItens: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  metadata: IPaginationMetaData;
  data: T[];
}

export interface IBaseResponse {
  message: string;
}
