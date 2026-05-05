import React from "react";
import { Button } from "@/components/ui/button";

type PhoneNumberEntryProps = {
  open: boolean;
  phoneNumber: string;
  error: string;
  loading: boolean;
  onPhoneNumberChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function PhoneNumberEntry({
  open,
  phoneNumber,
  error,
  loading,
  onPhoneNumberChange,
  onSubmit,
  onCancel,
}: PhoneNumberEntryProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0A0A0A] p-6 text-white shadow-2xl">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-widest text-red-500">
            Phone verification
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Enter phone number</h2>
          <p className="mt-2 text-sm text-gray-400">
            Add your 10 digit mobile number to continue booking.
          </p>
        </div>

        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phoneNumber}
          onChange={(e) =>
            onPhoneNumberChange(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder="10 digit phone number"
          className="w-full rounded-lg border border-gray-700 bg-[#111] p-3 text-white outline-none placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-full"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            className="rounded-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
}
