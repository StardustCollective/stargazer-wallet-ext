import {decodeFromBase64} from 'utils/encoding';

export type DeepLinkRoute = 'connect' | 'sign-data';

export type DeepLinkResult = {
  route: DeepLinkRoute;
  callbackUrl: string;
  requestId: string;
  origin: string;
  payload?: string;
  address?: string;
};

export const parseDeepLink = (url: string): DeepLinkResult | null => {
  try {
    if (!url.startsWith('stargazer://')) return null;

    // Manual URL parsing (React Native URL doesn't support pathname)
    const withoutScheme = url.replace('stargazer://', '');
    const [pathPart, queryPart] = withoutScheme.split('?');

    // Validate route
    const validRoutes: DeepLinkRoute[] = ['connect', 'sign-data'];
    if (!validRoutes.includes(pathPart as DeepLinkRoute)) return null;
    if (!queryPart) return null;

    const route = pathPart as DeepLinkRoute;

    // Parse query string manually
    const params: Record<string, string> = {};
    queryPart.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });

    const callbackEncoded = params['callback'];
    const requestId = params['request_id'];

    if (!callbackEncoded || !requestId) return null;

    // Decode base64 callback URL (handle URL-safe base64)
    const normalizedBase64 = callbackEncoded.replace(/-/g, '+').replace(/_/g, '/');
    const callbackUrl = decodeFromBase64(normalizedBase64);

    // Extract origin from callback URL manually
    const originMatch = callbackUrl.match(/^(https?):\/\/([^\/]+)/);
    if (!originMatch) return null;

    const protocol = originMatch[1];
    const hostname = originMatch[2];

    // Validate callback URL (HTTPS only in production)
    if (!__DEV__ && protocol !== 'https') return null;

    const result: DeepLinkResult = {
      route,
      callbackUrl,
      requestId,
      origin: hostname,
    };

    // Parse additional params for sign-data
    if (route === 'sign-data') {
      const address = params['address'];
      if (!address) return null;
      result.address = address;

      const payloadEncoded = params['payload'];
      if (!payloadEncoded) return null;
      // Decode base64 payload
      const normalizedPayload = payloadEncoded.replace(/-/g, '+').replace(/_/g, '/');
      result.payload = decodeFromBase64(normalizedPayload);
    }

    return result;
  } catch {
    return null;
  }
};
