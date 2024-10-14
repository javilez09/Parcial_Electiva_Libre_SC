
export class Parameters {
  static readonly MONGO_URI = process.env?.MONGO_URI || "test";
  static readonly DATABASE_PORT = process.env?.DATABASE_PORT || "3005";
  static readonly DATABASE_HOST = process.env?.DATABASE_HOST || "test";
}
