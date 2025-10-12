import Ean from "ean-generator";

/**
 * Barcode Service
 * ----------------
 * Provides utilities to generate valid EAN-13 barcodes,
 * either individually or in bulk.
 *
 * Uses the `ean-generator` library under the hood.
 */
class Barcode {
  /**
   * Instance of the EAN generator.
   * Initialized with a prefix (default: "900").
   *
   * EAN prefixes usually represent a country or organization code.
   * You can modify this prefix based on your business needs.
   */
  private ean: Ean;

  constructor() {
    this.ean = new Ean(["900"]);
  }

  /**
   * Generates a single valid EAN-13 barcode.
   *
   * @example
   * ```ts
   * const barcode = BarcodeService.generateEAN13();
   * // "9001234567890"
   * ```
   *
   * @returns {string} A valid 13-digit EAN barcode.
   */
  public generateEAN13(): string {
    return this.ean.create();
  }

  /**
   * Generates a batch of multiple valid EAN-13 barcodes.
   *
   * Useful for creating barcodes for multiple products at once.
   *
   * @param {number} count - The number of barcodes to generate (must be greater than 0).
   *
   * @example
   * ```ts
   * const barcodes = BarcodeService.generateBatch(5);
   * // ["9001234567890", "9009876543210", ...]
   * ```
   *
   * @throws {Error} If `count` is less than or equal to zero.
   * @returns {string[]} An array of valid EAN-13 barcode strings.
   */
  public generateBatch(count: number): string[] {
    if (count <= 0) {
      throw new Error("Batch size must be greater than zero");
    }

    return this.ean.createMultiple({ size: count });
  }
}

/**
 * Exported singleton instance of the Barcode service.
 * Provides consistent barcode generation across the application.
 */
export const BarcodeService = new Barcode();
