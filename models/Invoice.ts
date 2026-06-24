import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Other';
export type InvoiceStatus = 'completed' | 'cancelled';

// A single line item on an invoice (the "Sale Items" table, embedded).
export interface IInvoiceItem {
  productId: mongoose.Types.ObjectId | null;
  productName: string; // denormalized — survives product deletion
  size: string;
  quantity: number;
  mrp: number; // catalog price at time of sale (for reference)
  sellingPrice: number; // actual per-unit price charged
  costPrice: number; // supplier cost per unit, snapshotted at sale time
  totalPrice: number; // sellingPrice * quantity
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  customerName?: string;
  customerMobile: string;
  items: IInvoiceItem[];
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  totalCost: number; // sum of costPrice * quantity (snapshot)
  profit: number; // finalAmount - totalCost (snapshot)
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  createdBy: string;
  note?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productName: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0, default: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, trim: true, maxlength: 120 },
    customerMobile: { type: String, required: true, trim: true },
    items: {
      type: [InvoiceItemSchema],
      required: true,
      validate: {
        validator: (v: IInvoiceItem[]) => v.length > 0,
        message: 'An invoice must contain at least one item.',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, required: true, min: 0, default: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, required: true, min: 0, default: 0 },
    profit: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card', 'Other'],
      required: true,
      default: 'Cash',
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled'],
      default: 'completed',
    },
    createdBy: { type: String, required: true, default: 'Admin' },
    note: { type: String, maxlength: 280 },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

// DATABASE INDEXES (search & analytics performance)
// invoiceNumber uniqueness index is created by `unique: true` on the field.
InvoiceSchema.index({ customerMobile: 1 });
InvoiceSchema.index({ createdAt: -1 });
InvoiceSchema.index({ status: 1, createdAt: -1 });
InvoiceSchema.index({ 'items.productName': 1 });

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ||
  mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
