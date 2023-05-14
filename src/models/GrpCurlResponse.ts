import { getMessagePathFromRequest } from '../deserialization/message';

export default class GrpCurlResponse {
  private readonly request: string;

  private readonly error: string;

  private readonly data: string;

  constructor(request: string, error = '', data = '') {
    this.request = request;
    this.error = error;
    this.data = data;
  }

  getError(): string {
    return this?.error;
  }

  getData(): string {
    return this.data;
  }

  hasError(): boolean {
    return this?.error?.length > 0;
  }

  public getPathFromRequest(): string {
    return getMessagePathFromRequest(this.request);
  }
}
