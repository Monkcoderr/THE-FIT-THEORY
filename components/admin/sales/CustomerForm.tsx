'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, User, CheckCircle2, Loader2 } from 'lucide-react';
import type { CustomerLookup } from '@/types';
import { isValidMobile, normalizeMobile } from '@/lib/invoice';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';

interface CustomerFormProps {
  customerName: string;
  customerMobile: string;
  onChange: (next: { customerName: string; customerMobile: string }) => void;
}

export default function CustomerForm({
  customerName,
  customerMobile,
  onChange,
}: CustomerFormProps) {
  const [lookup, setLookup] = useState<CustomerLookup | null>(null);
  const [looking, setLooking] = useState(false);
  const lastLooked = useRef<string>('');

  const mobileValid = isValidMobile(customerMobile);

  // Debounced returning-customer lookup once the mobile is valid.
  useEffect(() => {
    const normalized = normalizeMobile(customerMobile);
    if (!isValidMobile(normalized)) {
      setLookup(null);
      lastLooked.current = '';
      return;
    }
    if (normalized === lastLooked.current) return;

    const timer = setTimeout(async () => {
      setLooking(true);
      try {
        const res = await fetch(`/api/customers?mobile=${normalized}`);
        const data = await res.json();
        if (res.ok && data.customer) {
          const c = data.customer as CustomerLookup;
          setLookup(c);
          lastLooked.current = normalized;
          // Auto-fill the name only when the field is currently empty.
          if (c.found && c.customerName && !customerName.trim()) {
            onChange({
              customerMobile,
              customerName: c.customerName,
            });
          }
        }
      } catch {
        // Lookup is best-effort; ignore network errors here.
      } finally {
        setLooking(false);
      }
    }, 450);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerMobile]);

  return (
    <div className="space-y-3">
      <div>
        <Input
          label="Mobile number"
          inputMode="numeric"
          placeholder="10-digit mobile"
          value={customerMobile}
          onChange={(e) =>
            onChange({
              customerName,
              customerMobile: e.target.value.replace(/[^\d+\s-]/g, ''),
            })
          }
          leftElement={<Phone className="h-4 w-4 text-admin-mute" />}
          error={
            customerMobile && !mobileValid
              ? 'Enter a valid 10-digit number'
              : undefined
          }
        />
      </div>

      <div>
        <Input
          label="Customer name (optional)"
          placeholder="e.g. Rahul Sharma"
          value={customerName}
          onChange={(e) =>
            onChange({ customerName: e.target.value, customerMobile })
          }
          leftElement={<User className="h-4 w-4 text-admin-mute" />}
        />
      </div>

      {looking && (
        <p className="flex items-center gap-1.5 text-xs text-admin-mute">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Checking customer history…
        </p>
      )}

      {!looking && lookup?.found && (
        <div className="flex items-start gap-2 rounded-md border border-admin-green/20 bg-admin-green/10 p-2.5">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-admin-green" />
          <div className="text-xs text-admin-text">
            <p className="font-medium">
              Returning customer
              {lookup.customerName ? ` · ${lookup.customerName}` : ''}
            </p>
            <p className="text-admin-text-soft">
              {lookup.previousPurchases} previous purchase
              {lookup.previousPurchases === 1 ? '' : 's'} ·{' '}
              {formatPrice(lookup.totalSpent)} spent
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
