// global.d.ts
import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClient?: mongoose.Mongoose;
    }
  }
}

export {};
