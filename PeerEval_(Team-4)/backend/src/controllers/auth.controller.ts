import jwt from "jsonwebtoken";

// Define a User interface
interface User {
  email: string;
  password: string;
}

// Simulated database (in-memory array)
const users: User[] = [];

/**
 * Registers a new user by storing their email and password.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns The created user object.
 */
export const registerUser = (email: string, password: string): User => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const newUser: User = { email, password }; // In real apps, hash the password
  users.push(newUser);

  return newUser;
};

/**
 * Authenticates a user and generates a JWT token if credentials are valid.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns JWT token string.
 */
export const signInUser = (email: string, password: string): string => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1d" });
  return token;
};

// Example usage (for testing only; comment out in production)
/*
try {
  const user = registerUser("test@example.com", "password123");
  console.log("User registered:", user);

  const token = signInUser("test@example.com", "password123");
  console.log("JWT Token:", token);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}
*/
