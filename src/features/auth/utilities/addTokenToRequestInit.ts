export function addTokenToRequestInit(accessToken?: string, options?: RequestInit): RequestInit {
  const requestObject: RequestInit = { ...options };

  if (accessToken) {
    requestObject.headers = { ...options?.headers, Authorization: `Bearer ${accessToken}` };
  }

  return requestObject;
}
