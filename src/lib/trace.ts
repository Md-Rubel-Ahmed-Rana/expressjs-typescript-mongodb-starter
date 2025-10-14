import { UUIDService } from "./uuid";

class Service {
  generateAPIRequestTraceId(): string {
    return UUIDService.generateFull();
  }
}

export const TraceService = new Service();
