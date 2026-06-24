import mongoose, { Schema, Model } from 'mongoose';

// Atomic sequence counter — used to generate unique, gap-tolerant invoice
// numbers without race conditions across concurrent serverless invocations.
export interface ICounter {
  _id: string; // e.g. "invoice-2026"
  seq: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { _id: false, versionKey: false }
);

const Counter: Model<ICounter> =
  mongoose.models.Counter ||
  mongoose.model<ICounter>('Counter', CounterSchema);

/**
 * Atomically increment the counter for a key and return the next value.
 * Uses findOneAndUpdate with upsert so the very first call creates the doc.
 */
export async function nextSequence(key: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  return doc?.seq ?? 1;
}

export default Counter;
