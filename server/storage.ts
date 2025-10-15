// In-memory storage is not needed for S3 file manager
// All data is stored in AWS S3

export interface IStorage {}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
