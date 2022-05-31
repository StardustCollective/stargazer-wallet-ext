type StargazerEncodedProxyRequest = {
  reqId: string;
  once: string;
  request: StargazerProxyRequest;
};

type StargazerProxyRequest =
  | {
      type: 'general';
    }
  | { type: 'rpc' };

type StargazerEncodedProxyResponse = {
  reqId: string;
  once: string;
  response: StargazerProxyResponse;
};

type StargazerProxyResponse =
  | {
      type: 'error';
      error: { type: 'general'; message: string } | { type: 'rpc'; message: string; code: number; data: unknown };
    }
  | { type: 'response'; data: unknown };

export type {
  StargazerEncodedProxyRequest,
  StargazerProxyRequest,
  StargazerEncodedProxyResponse,
  StargazerProxyResponse,
};
