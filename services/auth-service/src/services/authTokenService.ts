import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/JWTPalyload';

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const ACCESS_TOKEN_EXPIRY = '30m';
const REFRESH_TOKEN_EXPIRY = '7d';

class TokenService {
  /**
   * Generate an access token
   * @param payload - The payload of type JWTPayload
   */
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  /**
   * Generate a refresh token
   * @param payload - The payload of type JWTPayload
   */
  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  /**
   * Verify a token and return its payload
   * @param token - The token to verify
   * @param isRefreshToken - True if verifying a refresh token
   */
  verifyToken(token: string, isRefreshToken = false): JWTPayload | null {
    try {
      const secret = isRefreshToken
        ? REFRESH_TOKEN_SECRET
        : ACCESS_TOKEN_SECRET;
      return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
      return null; // Return null if verification fails
    }
  }

  /**
   * Refresh an access token using a valid refresh token
   * @param refreshToken - The refresh token
   */
  refreshAccessToken(refreshToken: string): string {
    const payload = this.verifyToken(refreshToken, true);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // Generate a new access token with the same payload
    return this.generateAccessToken(payload);
  }
}

export default new TokenService();
