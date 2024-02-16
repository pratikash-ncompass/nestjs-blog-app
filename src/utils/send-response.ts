export class CustomApiResponse<T = any> {
    statusCode: number;
    data: {
      message: string;
      data: T;
    };
    constructor(statusCode: number, message: string, data: T) {
      this.statusCode = statusCode;
      this.data = {
        message,
        data,
      };
    }

  }