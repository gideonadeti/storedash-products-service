export interface JWTPayload {
  id: string; // User ID
  role: 'admin' | 'driver' | 'distributor' | 'retailer'; // Enum for user roles
}
