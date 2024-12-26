import axios, {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse,
} from 'axios';
import { displaySnackbar, displayApiIndicator, displayDialogAlert } from '@/lib/notifications';
import CompanySessionManager from '@/lib/CompanySessionManager';
import PaginatedApiResponse, { ServerErrorResponse } from '@/types/ApiResponse';

const API_URL = `${process.env.VUE_APP_API_URL}/api`;

class ApiWrapper {
  /**
   * Enable/disable session timeout detection.
   */
  public sessionTimeoutDetection: boolean | null = false;

  /**
   * If session timeout is detected, redirect to this URL.
   * If no URL is set, page will refresh.
   */
  public sessionTimeoutRedirect: string | null = null;

  /**
   * Used to limit the number of times we show the timeout alert.
   */
  private sessionTimeoutAlertShown = false;

  /**
   * Indicates whether the app is running in development mode
   * @private
   */
  private devMode: boolean = process.env.NODE_ENV === 'development';

  /**
   * Main Axios instance
   * @private
   */
  private instance: AxiosInstance;

  /**
   * Special routes that do not follow the standard route naming convention of /v3/{route}.
   * Prefix the route with an underscore to indicate that it is special.
   * @private
   */
  private specialRoutes = {
    '_csrf-cookie': '/csrf-cookie',
  };

  /**
   * Initialize the Axios instance using the provided config
   * @param config
   */
  constructor(config?: AxiosRequestConfig) {
    // Initialize Axios instance
    this.instance = axios.create(config);

    this.instance.interceptors.request.use((requestConfigs) => {
      displayApiIndicator.startCall();

      return requestConfigs;
    });

    // Add request interceptors
    this.instance.interceptors.response.use(
      // Handle successful requests with status codes in the 2xx range
      this.handleResponseSuccess,
      // Handle unsuccessful requests with status codes outside the 2xx range
      this.handleResponseError,
    );
  }

  /**
   * Send HTTP GET request
   * @param url
   * @param config
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get<T>(this.resolveRoute(url), config);
    return response.data;
  }

  /**
   * Send HTTP GET request for a binary file.
   */
  public getBlob(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const reqConfig = {
      responseType: 'blob' as const,
      ...config,
    };

    return this.instance.get(this.resolveRoute(url), reqConfig);
  }

  /**
   * Send HTTP GET request to retrieve all pages of paginated data
   * @param url
   * @param config
   */
  public async getAllPages<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (!config || !config.params) {
      throw new Error('getAllPages requires a config.params object');
    }

    const initialResponse: PaginatedApiResponse<{
      meta: any;
      data: T[]; }> = await this.instance.get(this.resolveRoute(url), config);

    const totalPages = initialResponse.data.meta.last_page;
    const currentPageData = initialResponse.data;
    const allRequests = [];

    // Push the initial request's data
    allRequests.push(Promise.resolve(currentPageData.data));

    // Create requests for the remaining pages
    for (let page = 2; page <= totalPages; page += 1) {
      const currentConfig = { ...config, params: { ...config.params, page } };
      const responsePromise = this.instance.get<PaginatedApiResponse<{
        meta: any;
        data: T[]; }>>(this.resolveRoute(url), currentConfig)
        .then((res) => res.data.data); // Extract the 'data' property from the response object
      allRequests.push(responsePromise);
    }

    // Execute all requests concurrently and combine the results
    const allData = (await Promise.all(allRequests)).flat();

    return { data: allData } as T;
  }

  /**
   * Send HTTP POST request
   * @param url
   * @param data
   * @param config
   */
  public async post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse = await this.instance.post(this.resolveRoute(url), data, config);

    return response.data;
  }

  /**
   * Send HTTP PUT request
   * @param url
   * @param data
   * @param config
   */
  public async put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse = await this.instance.put(this.resolveRoute(url), data, config);

    return response.data;
  }

  /**
   * Send HTTP DELETE request
   * @param url
   * @param config
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse = await this.instance.delete(this.resolveRoute(url), config);

    return response.data;
  }

  /**
   * Handle response success and return the response
   * @param response
   */
  private handleResponseSuccess = (response: AxiosResponse): AxiosResponse => {
    displayApiIndicator.endCall();
    return response;
  }

  /**
   * Handle response error
   * @param error
   */
  private handleResponseError = (error: AxiosError<ServerErrorResponse>): Promise<any> => {
    displayApiIndicator.endCall();

    if (error.response) {
      // We received an error response from the server
      const statusPrefix = error.response.status.toString()[0];

      if (statusPrefix === '5') {
        // Server error
        this.logError('Server error');

        const errorMessage = error.response.data?.error?.message || 'An unexpected server error has occurred.';

        // Show modal
        displaySnackbar({
          indefinite: true,
          type: 'is-danger',
          message: `Server error: ${errorMessage}`,
        });
      } else if (statusPrefix === '4') {
        if (this.sessionTimeoutDetection && ApiWrapper.isSessionTimeout(error.response)) {
          if (!this.sessionTimeoutAlertShown) {
            this.showTimeoutAlert();
            this.sessionTimeoutAlertShown = true;
          }
        }

        // Client error
        this.logError('Client error');
        return Promise.reject(error);
      }
    } else if (error.request) {
      // The request was made but no response was received
      this.logError('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      this.logError('Error message:', error.message);
    }

    return Promise.reject(error);
  }

  /**
   * Log error to console if in development mode
   * @param error
   * @private
   */
  private logError(...error: (string | object)[]): void {
    if (this.devMode) {
      console.error(...error);
    }
  }

  /**
   * Resolve routes, defaulting to /v3/{route} if not found in specialRoutes
   * @param route
   * @private
   */
  private resolveRoute(route: string): string {
    if (this.specialRoutes[route]) {
      return this.specialRoutes[route];
    }

    return `/v3${route}`;
  }

  /**
   * Determine if response indicates a session timeout.
   */
  private static isSessionTimeout(response: AxiosResponse): boolean {
    if (
      response.status === 403
      && response.data.error?.message?.toLocaleLowerCase().includes('unauthenticated')
    ) {
      // User was logged in, but now unauthenticated. Probably session timeout.
      return true;
    }

    return false;
  }

  /**
   * Show session timeout alert modal then refresh or redirect to login URL.
   */
  private showTimeoutAlert() {
    displayDialogAlert({
      title: 'Session Timeout',
      message: 'Your session has timed out due to inactivity. Click OK to log in again.',
      confirmCallback: () => {
        if (this.sessionTimeoutRedirect) {
          window.location.href = this.sessionTimeoutRedirect;
        } else {
          window.location.reload();
        }
      },
    });
  }
}

/**
 * Export a new instance of the ApiWrapper class
 */
const $api = new ApiWrapper({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    ...CompanySessionManager.getHeaderConfig(),
  },
});

export default $api;
