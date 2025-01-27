export class CustomError extends Error {
  type: string;
  data: any;

  constructor(type: string, data: any) {
    super("");
    this.type = type;
    this.data = data;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
