import AuditLog, { AuditAction } from '@/models/AuditLog';

// Fire-and-forget audit writer. Never throws into the caller's flow — a failed
// audit write must not break the underlying business operation.
export async function writeAudit(params: {
  action: AuditAction;
  entityType: string;
  entityId: string;
  actor?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await AuditLog.create({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      actor: params.actor ?? 'Admin',
      meta: params.meta,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error('writeAudit failed:', err);
  }
}
