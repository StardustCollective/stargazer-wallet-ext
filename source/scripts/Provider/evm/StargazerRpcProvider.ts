import * as ethers from 'ethers';
import { deepCopy } from '@ethersproject/properties';
import { ConnectionInfo, fetchJson } from '@ethersproject/web';
import { Networkish } from '@ethersproject/networks';
import store from 'state/store';
import { requestToken } from 'utils/httpRequests/interceptors';
import { X_LATTICE_REQ_TOKEN, X_LATTICE_SIG } from 'utils/httpRequests/constants';
import { generateHmac } from 'utils/httpRequests/signature';
import { EXTERNAL_REQUESTS_BASE_URL } from 'constants/index';

class StargazerRpcProvider extends ethers.providers.JsonRpcProvider {
  private service: string;
  private isRefreshing: boolean;
  private subscribers: ((token: string) => void)[];

  constructor(url?: ConnectionInfo | string, network?: Networkish) {
    const proxyUrl = `${EXTERNAL_REQUESTS_BASE_URL}/${url}/?`;

    const connectionInfo: ConnectionInfo = {
      url: proxyUrl,
    };

    super(connectionInfo, network);

    this.service = url as string;
    this.isRefreshing = false;
    this.subscribers = [];
  }

  private getResult(payload: {
    error?: { code?: number; data?: any; message?: string };
    result?: any;
  }): any {
    if (payload.error) {
      // @TODO: not any
      const error: any = new Error(payload.error.message);
      error.code = payload.error.code;
      error.data = payload.error.data;
      throw error;
    }

    return payload.result;
  }

  private async getToken(): Promise<string> {
    const { external } = store.getState().auth;

    let token = external?.token ?? '';

    if (!token) {
      token = await requestToken();
      if (!token) throw new Error('Failed to request token');
    }

    return token;
  }

  private async generateSignature(
    service: string,
    token: string,
    body: any
  ): Promise<string> {
    const path = '/';
    const searchParams = '?';

    const signature = await generateHmac(token, service, path, searchParams, body);
    if (!signature) throw new Error('Failed to generate signature');

    return signature;
  }

  // Helper function to add subscribers
  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.subscribers.push(callback);
  }

  // Helper function to notify all subscribers when the token is refreshed
  private onRefreshed(newToken: string) {
    this.subscribers.forEach((callback) => callback(newToken));
    this.subscribers = [];
  }

  // Method to make the actual fetch request with error handling
  private async makeRequest(
    connectionObject: ConnectionInfo,
    request: any
  ): Promise<any> {
    return fetchJson(connectionObject, JSON.stringify(request), this.getResult)
      .then((result) => {
        this.emit('debug', {
          action: 'response',
          request,
          response: result,
          provider: this,
        });
        return result;
      })
      .catch(async (error) => {
        // Check if token is expired and if the error status is 403
        if (error.status === 403) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const newToken = await requestToken();
              this.onRefreshed(newToken);
              this.isRefreshing = false;
            } catch (refreshError) {
              this.isRefreshing = false;
              throw refreshError;
            }
          }

          // Wait for the new token
          return new Promise((resolve) => {
            this.subscribeTokenRefresh(async (newToken: string) => {
              // Retry the request with the new token and updated signature
              const newSignature = await this.generateSignature(
                this.service,
                newToken,
                request
              );
              connectionObject.headers[X_LATTICE_REQ_TOKEN] = newToken;
              connectionObject.headers[X_LATTICE_SIG] = newSignature;

              resolve(
                fetchJson(connectionObject, JSON.stringify(request), this.getResult)
              );
            });
          });
        }

        // Other errors
        throw error;
      });
  }

  async send(method: string, params: Array<any>): Promise<any> {
    const request = {
      method: method,
      params: params,
      id: this._nextId++,
      jsonrpc: '2.0',
    };

    this.emit('debug', {
      action: 'request',
      request: deepCopy(request),
      provider: this,
    });

    // We can expand this in the future to any call, but for now these
    // are the biggest wins and do not require any serializing parameters.
    const cache = ['eth_chainId', 'eth_blockNumber'].indexOf(method) >= 0;
    if (cache && this._cache[method]) {
      return this._cache[method];
    }

    // Request token
    const token = await this.getToken();

    // Generate the new signature
    const signature = await this.generateSignature(this.service, token, request);

    const connectionObject: ConnectionInfo = {
      ...this.connection,
      headers: {
        ...this.connection.headers,
        [X_LATTICE_REQ_TOKEN]: token,
        [X_LATTICE_SIG]: signature,
      },
    };

    const result = await this.makeRequest(connectionObject, request);

    // Cache the fetch, but clear it on the next event loop
    if (cache) {
      this._cache[method] = result;
      setTimeout(() => {
        this._cache[method] = null;
      }, 0);
    }

    return result;
  }
}

export default StargazerRpcProvider;
