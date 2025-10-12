import bcrypt from "bcrypt";

/**
 * Bcrypt Service
 * ---------------
 * Provides helper methods for securely hashing and verifying passwords
 * using the bcrypt algorithm.
 */
class Bcrypt {
  /**
   * Hashes a plain text password using bcrypt with a salt round of 12.
   *
   * @param {string} password - The plain text password to hash.
   *
   * @example
   * ```ts
   * const hashed = await BcryptInstance.hash("myPassword123");
   * // "$2b$12$9eQvP1..."
   * ```
   *
   * @returns {Promise<string>} The bcrypt-hashed password.
   */
  public async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  /**
   * Compares a plain text password with an encrypted (hashed) password.
   *
   * Useful for verifying user login credentials.
   *
   * @param {string} password - The plain text password provided by the user.
   * @param {string} encryptedPassword - The stored bcrypt hash from the database.
   *
   * @example
   * ```ts
   * const isValid = await BcryptInstance.compare("myPassword123", hashed);
   * // true or false
   * ```
   *
   * @returns {Promise<boolean>} True if passwords match, false otherwise.
   */
  public async compare(
    password: string,
    encryptedPassword: string
  ): Promise<boolean> {
    const isMatchedPassword = await bcrypt.compare(password, encryptedPassword);
    return isMatchedPassword;
  }
}

/**
 * Exported singleton instance of the Bcrypt service.
 * Use this instance across the app for consistent password handling.
 */
export const BcryptInstance = new Bcrypt();
