import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISaleRecord extends Document {
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  sizeSold: string;
  channel: 'Walk-in' | 'WhatsApp';
  revenue: number;
  quantity: number;
  note?: string;
  date: Date;
  // Optional linkage to a billed invoice (sales created via the Sales Log).
  // Quick sales logged from Inventory leave these undefined.
  invoiceId?: mongoose.Types.ObjectId;
  invoiceNumber?: string;
}

const SaleRecordSchema = new Schema<ISaleRecord>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
      // Denormalized: kept even if product is deleted, preserving history
    },
    sizeSold: { type: String, required: true },
    channel: {
      type: String,
      enum: ['Walk-in', 'WhatsApp'],
      required: true,
    },
    revenue: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    note: { type: String, maxlength: 280 },
    date: { type: Date, default: Date.now },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    invoiceNumber: { type: String },
  },
  { timestamps: false }
);

// DATABASE INDEXES
SaleRecordSchema.index({ date: -1 });
SaleRecordSchema.index({ productId: 1 });
SaleRecordSchema.index({ channel: 1 });
SaleRecordSchema.index({ invoiceId: 1 });
SaleRecordSchema.index({ date: -1, channel: 1 }); // Compound for analytics

const SaleRecord: Model<ISaleRecord> =
  mongoose.models.SaleRecord ||
  mongoose.model<ISaleRecord>('SaleRecord', SaleRecordSchema);

export default SaleRecord;
