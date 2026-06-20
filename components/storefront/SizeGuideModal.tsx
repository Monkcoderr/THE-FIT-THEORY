'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Ruler, X } from 'lucide-react';

// Generic apparel size chart (cm). Static reference table.
const SIZE_CHART = [
  { size: 'XS', chest: '86–91', waist: '71–76', length: '66' },
  { size: 'S', chest: '91–96', waist: '76–81', length: '69' },
  { size: 'M', chest: '96–101', waist: '81–86', length: '72' },
  { size: 'L', chest: '101–106', waist: '86–91', length: '74' },
  { size: 'XL', chest: '106–111', waist: '91–96', length: '76' },
  { size: 'XXL', chest: '111–116', waist: '96–101', length: '78' },
];

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-nike-ink underline underline-offset-2 hover:opacity-70">
          <Ruler className="h-4 w-4" />
          Size guide
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 animate-scale-in">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-nike-ink">
              Size guide
            </Dialog.Title>
            <Dialog.Close
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-nike-cloud"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-nike-ink" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="mb-4 text-sm text-nike-mute">
            Measurements in centimeters. For the best fit, measure a garment you
            already own and compare.
          </Dialog.Description>

          <div className="overflow-hidden rounded-lg border border-nike-hairline-soft">
            <table className="w-full text-sm">
              <thead className="bg-nike-cloud text-nike-ink">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium">Size</th>
                  <th className="px-4 py-2.5 font-medium">Chest</th>
                  <th className="px-4 py-2.5 font-medium">Waist</th>
                  <th className="px-4 py-2.5 font-medium">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nike-hairline-soft">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size}>
                    <td className="px-4 py-2.5 font-medium text-nike-ink">
                      {row.size}
                    </td>
                    <td className="px-4 py-2.5 text-nike-charcoal">
                      {row.chest}
                    </td>
                    <td className="px-4 py-2.5 text-nike-charcoal">
                      {row.waist}
                    </td>
                    <td className="px-4 py-2.5 text-nike-charcoal">
                      {row.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
