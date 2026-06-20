// CRITICAL: Singleton with connection caching prevents connection
// exhaustion in Next.js serverless environments.

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.__mongoose_cache ?? { conn: null, promise: null };

global.__mongoose_cache = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGO_URI) {
    throw new Error(
      'MONGO_URI environment variable is not defined. Add it to your .env.local file.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
