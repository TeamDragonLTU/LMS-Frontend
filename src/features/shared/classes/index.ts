export class CustomError extends Error {
  errorCode: number;
    errors?: Record<string, string[]>;
  title?: string;

    constructor(message: string, status: number, errors?: Record<string, string[]>, title?: string) {
    super(message);
    this.name = 'CustomError';
    this.errorCode = status;
    this.errors = errors;
    this.title = title;
  }

  // constructor(errorCode: number, message: string) {
  //   super(message);
  //   this.errorCode = errorCode;
  //   this.name = 'CustomError';
  // }
}
