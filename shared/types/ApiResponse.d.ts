/* eslint-disable camelcase */

interface PaginatedApiResponse<T> extends DataWrap<T> {
  meta: {
    current_page: number,
    from: number,
    last_page: number,
    per_page: number,
    to: number,
    total: number,
  },
}

export interface ServerErrorResponse {
  error: {
    message: string,
    status_code: number,
  }
}

export default PaginatedApiResponse;
