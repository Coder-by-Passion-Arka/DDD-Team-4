import jwt from "jsonwebtoken";

// Simulated database (in-memory array)
const users = [];

/**
 * Registers a new user by storing their email and password.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {object} - The created user object.
 */
export const registerUser = (email, password) => {
    // Basic validation
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        throw new Error("User already exists.");
    }

    // Store user (in a real app, hash the password before storing)
    const newUser = { email, password };
    users.push(newUser);

    return newUser;
};

/**
 * Authenticates a user and generates a JWT token if credentials are valid.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {string} - JWT token.
 */
export const signInUser = (email, password) => {
    // Basic validation
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    // Find user in the database
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1d" });
    return token;
};

// Example usage (remove or comment out in production)
/*
try {
    const user = registerUser("test@example.com", "password123");
    console.log("User registered:", user);

    const token = signInUser("test@example.com", "password123");
    console.log("JWT Token:", token);
} catch (error) {
    console.error("Error:", error.message);
}
*/