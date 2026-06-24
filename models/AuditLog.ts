import mongoose, { Schema, Document, Model } from 'mongoose';

export type AuditAction =
  | 'invoice.create'
  | 'invoice.edit'
  | 'invoice.cancel'
  | 'invoice.resend';

// Append-only audit trail for sales/billing actions.
export interface IAuditLog extends Document {
  action: AuditAction;
  entityType: string; // e.g. "Invoice"
  entityId: string; // invoiceNumber or document id
  actor: string; // staff member / "Admin"
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    actor: { type: String, required: true, default: 'Admin' },
    meta: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
