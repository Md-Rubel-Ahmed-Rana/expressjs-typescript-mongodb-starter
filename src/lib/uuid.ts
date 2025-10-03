import { v4 as uuidv4 } from "uuid";

class Service {
  public generateFull(): string {
    return uuidv4();
  }

  public generateFirstPart(): string {
    return uuidv4().split("-")[0];
  }

  public generateLastPart(): string {
    const parts = uuidv4().split("-");
    return parts[parts.length - 1];
  }

  public generateWithoutDash(): string {
    return uuidv4().replace(/-/g, "");
  }

  public generateCustom(length: number = 8): string {
    return this.generateWithoutDash().slice(0, length);
  }
}

export const UUIDService = new Service();
