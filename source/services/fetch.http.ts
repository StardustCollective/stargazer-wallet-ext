import { DagTypes } from '@stardust-collective/dag4-wallet';

export class FetchRestService {
  invoke(options: DagTypes.RestApiOptionsRequest) {
    return this.makeServiceRequest(this.buildRequest(options));
  }

  buildRequest(options: DagTypes.RestApiOptionsRequest) {
    const paramStr = options.queryParams && this.serialize(options.queryParams);

    if (paramStr) {
      options.url = `${options.url}?${paramStr}`;
    }

    const httpHeaders: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (options.authToken && !options.noAuthHeader) {
      httpHeaders.Authorization = options.authToken;
    }

    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        httpHeaders[key] = options.headers[key];
      });

      if (options.body) {
        if (
          options.headers['Content-Type'] &&
          options.headers['Content-Type'] ===
            'application/x-www-form-urlencoded'
        ) {
          options.body = this.serialize(options.body);
        }
      }
    }

    return {
      url: options.url,
      body: options.body,
      headers: httpHeaders,
      method: options.method,
      transformResponse: options.transformResponse,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  makeServiceRequest(options: DagTypes.RestApiOptionsRequest) {
    return new Promise((resolve, reject) => {
      const promise = fetch(options.url, options);

      promise.then(
        (res) => {
          if (options.transformResponse) {
            resolve(options.transformResponse(res.json()));
          } else {
            resolve(res.json());
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  serialize(obj: any) {
    if (obj) {
      const keyMap = Object.keys(obj).map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      });

      return keyMap.join('&');
    }
    return '';
  }
}
