export const STATUS_CODES = {
  // 2xx Success
  OK: 200, // Request succeeded
  CREATED: 201, // Resource created successfully
  ACCEPTED: 202, // Request accepted for processing (async)
  NO_CONTENT: 204, // Request succeeded, no content to return (e.g., DELETE)

  // 3xx Redirection
  MOVED_PERMANENTLY: 301, // Resource moved permanently
  FOUND: 302, // Resource found at a different URI (temporary redirect)
  NOT_MODIFIED: 304, // Resource not modified (e.g., cached response)

  // 4xx Client Errors
  BAD_REQUEST: 400, // Invalid request syntax or parameters
  UNAUTHORIZED: 401, // Authentication required or failed
  FORBIDDEN: 403, // Access denied (authorization failed)
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // HTTP method not allowed for this resource
  CONFLICT: 409, // Request conflicts with current state (e.g., duplicate resource)
  GONE: 410, // Resource no longer available
  TOO_MANY_REQUESTS: 429, // Rate limit exceeded
  UNPROCESSABLE_ENTITY: 422, // Syntactically correct but semantically invalid (e.g., validation errors)

  // 5xx Server Errors
  INTERNAL_SERVER: 500, // Unexpected server error
  NOT_IMPLEMENTED: 501, // Server does not support the functionality
  BAD_GATEWAY: 502, // Invalid response from upstream server
  SERVICE_UNAVAILABLE: 503, // Server temporarily unavailable (e.g., maintenance)
  GATEWAY_TIMEOUT: 504, // Upstream server timed out
} as const;

// Optional: TypeScript type for STATUS_CODES keys
export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
