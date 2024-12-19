/**
 * Extracts the email from a Supabase JWT token
 * @param token Supabase JWT token
 * @param secret Secret key for JWT verification
 * @returns email address from the token
 */
import { jwtVerify } from 'jose';

export interface JWTPayload {
    email: string;
    exp: number;
    [key: string]: any;
}

export async function getEmailFromToken(token: string, secret: string): Promise<string> {
    try {
        const encoder = new TextEncoder();
        const { payload } = await jwtVerify(token, encoder.encode(secret));
        const jwtPayload = payload as JWTPayload;
        
        if (!jwtPayload.email) {
            throw new Error('No email found in token');
        }
        
        return jwtPayload.email;
    } catch (error) {
        console.error('Error extracting email from token:', error);
        throw new Error('Invalid or expired token');
    }
}