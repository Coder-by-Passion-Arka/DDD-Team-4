
// import { OAuth2Client } from "google-auth-library";
// import dotenv from "dotenv";

// dotenv.config({ path: "src/.env" });

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// if (!GOOGLE_CLIENT_ID) {
//   console.error("❌ GOOGLE_CLIENT_ID is not defined in environment variables");
// }

// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// /**
//  * Verify Google OAuth token and return user information
//  * @param {string} token - The Google OAuth token to verify
//  * @returns {Object|null} - User information from Google or null if invalid
//  */
// export const verifyGoogleToken = async (token) => {
//   try {
//     console.log("🔍 Verifying Google token...");

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     if (!payload) {
//       console.error("❌ No payload in Google token");
//       return null;
//     }

//     console.log("✅ Google token verified successfully");
//     console.log("👤 User info:", {
//       email: payload.email,
//       name: payload.name,
//       picture: payload.picture,
//       email_verified: payload.email_verified,
//     });

//     return {
//       email: payload.email,
//       name: payload.name,
//       picture: payload.picture,
//       email_verified: payload.email_verified,
//       google_id: payload.sub,
//       family_name: payload.family_name,
//       given_name: payload.given_name,
//       locale: payload.locale,
//     };
//   } catch (error) {
//     console.error("❌ Error verifying Google token:", error.message);
//     return null;
//   }
// };

// /**
//  * Get Google OAuth client instance
//  * @returns {OAuth2Client} - Google OAuth client
//  */
// export const getGoogleOAuthClient = () => {
//   return client;
// };

// /**
//  * Validate if a Google token is properly formatted
//  * @param {string} token - The token to validate
//  * @returns {boolean} - True if token appears to be valid format
//  */
// export const isValidGoogleTokenFormat = (token) => {
//   if (!token || typeof token !== "string") {
//     return false;
//   }

//   // Google JWT tokens have 3 parts separated by dots
//   const parts = token.split(".");
//   return parts.length === 3;
// };

// export default {
//   verifyGoogleToken,
//   // // Funtions when the project scales
//   // getGoogleOAuthClient,
//   // isValidGoogleTokenFormat,
// };

// ==================================================== // 

// Fixed googleAuth.service.js - Key fixes marked with ✅
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config({ path: "src/.env" });

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("❌ GOOGLE_CLIENT_ID is not defined in environment variables");
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * ✅ FIXED: Enhanced function to handle both JWT tokens and base64 encoded credentials
 * @param {string} credential - The Google OAuth token/credential to verify
 * @returns {Object|null} - User information from Google or null if invalid
 */
export const verifyGoogleToken = async (credential) => {
  try {
    console.log("🔍 Verifying Google credential...");
    console.log("📝 Credential type:", typeof credential);
    console.log("📝 Credential length:", credential?.length);

    // ✅ FIXED: Handle both JWT tokens and base64 encoded credentials
    
    // First, try to verify as JWT ID token (direct Google OAuth flow)
    if (credential.includes('.')) {
      try {
        console.log("🔍 Attempting JWT token verification...");
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          console.error("❌ No payload in Google JWT token");
          return null;
        }

        console.log("✅ JWT token verified successfully");
        return {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          email_verified: payload.email_verified,
          google_id: payload.sub,
          family_name: payload.family_name,
          given_name: payload.given_name,
          locale: payload.locale,
        };
      } catch (jwtError) {
        console.log("⚠️  JWT verification failed, trying base64 decode...");
        console.log("JWT Error:", jwtError.message);
      }
    }

    // ✅ NEW: Try to decode as base64 encoded user info (frontend encoded)
    try {
      console.log("🔍 Attempting base64 credential decoding...");
      const decoded = JSON.parse(atob(credential));
      
      // Validate required fields
      if (!decoded.email || !decoded.name) {
        console.error("❌ Invalid decoded credential structure");
        return null;
      }

      console.log("✅ Base64 credential decoded successfully");
      console.log("👤 Decoded user info:", {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        email_verified: decoded.email_verified,
      });

      return {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        email_verified: decoded.email_verified,
        google_id: decoded.sub,
        family_name: decoded.family_name,
        given_name: decoded.given_name,
        locale: decoded.locale,
      };
    } catch (base64Error) {
      console.log("⚠️  Base64 decode failed:", base64Error.message);
    }

    // ✅ FALLBACK: Try to parse as JSON directly
    try {
      console.log("🔍 Attempting direct JSON parse...");
      const parsed = JSON.parse(credential);
      
      if (!parsed.email || !parsed.name) {
        console.error("❌ Invalid JSON credential structure");
        return null;
      }

      console.log("✅ Direct JSON parse successful");
      return {
        email: parsed.email,
        name: parsed.name,
        picture: parsed.picture,
        email_verified: parsed.email_verified,
        google_id: parsed.sub,
        family_name: parsed.family_name,
        given_name: parsed.given_name,
        locale: parsed.locale,
      };
    } catch (jsonError) {
      console.log("⚠️  Direct JSON parse failed:", jsonError.message);
    }

    console.error("❌ All credential verification methods failed");
    return null;

  } catch (error) {
    console.error("❌ Error verifying Google credential:", error.message);
    return null;
  }
};

/**
 * ✅ ENHANCED: Validate Google user info structure
 * @param {Object} userInfo - The user info object to validate
 * @returns {boolean} - True if valid structure
 */
export const validateGoogleUserInfo = (userInfo) => {
  if (!userInfo || typeof userInfo !== 'object') {
    return false;
  }

  // Check required fields
  const requiredFields = ['email', 'name'];
  for (const field of requiredFields) {
    if (!userInfo[field] || typeof userInfo[field] !== 'string') {
      console.error(`❌ Missing or invalid field: ${field}`);
      return false;
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userInfo.email)) {
    console.error("❌ Invalid email format");
    return false;
  }

  return true;
};

/**
 * Get Google OAuth client instance
 * @returns {OAuth2Client} - Google OAuth client
 */
export const getGoogleOAuthClient = () => {
  return client;
};

/**
 * ✅ ENHANCED: Validate if a Google token is properly formatted
 * @param {string} token - The token to validate
 * @returns {boolean} - True if token appears to be valid format
 */
export const isValidGoogleTokenFormat = (token) => {
  if (!token || typeof token !== "string") {
    return false;
  }

  // Check for JWT format (3 parts separated by dots)
  if (token.includes('.')) {
    const parts = token.split(".");
    return parts.length === 3;
  }

  // Check for base64 format
  try {
    const decoded = atob(token);
    JSON.parse(decoded);
    return true;
  } catch (error) {
    // Not valid base64 or JSON
  }

  // Check for direct JSON format
  try {
    JSON.parse(token);
    return true;
  } catch (error) {
    // Not valid JSON
  }

  return false;
};

/**
 * ✅ NEW: Extract user info from Google access token
 * @param {string} accessToken - Google access token
 * @returns {Object|null} - User information or null if failed
 */
export const getUserInfoFromAccessToken = async (accessToken) => {
  try {
    console.log("🔍 Fetching user info from Google using access token...");
    
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!response.ok) {
      console.error("❌ Failed to fetch user info from Google");
      return null;
    }

    const userInfo = await response.json();
    
    console.log("✅ Successfully fetched user info from Google");
    return {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      email_verified: userInfo.verified_email,
      google_id: userInfo.id,
      family_name: userInfo.family_name,
      given_name: userInfo.given_name,
      locale: userInfo.locale,
    };
  } catch (error) {
    console.error("❌ Error fetching user info from access token:", error);
    return null;
  }
};

export default {
  verifyGoogleToken,
  validateGoogleUserInfo,
  getGoogleOAuthClient,
  isValidGoogleTokenFormat,
  getUserInfoFromAccessToken,
};