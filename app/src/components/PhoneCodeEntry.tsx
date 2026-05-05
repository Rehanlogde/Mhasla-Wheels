import React from "react";
import { Button } from "@/components/ui/button";

type PhoneCodeEntryProps = {
  open: boolean;
  code: string;
  error: string;
  loading: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export default function PhoneCodeEntry({
  open,
  code,
  error,
  loading,
  onCodeChange,
  onSubmit,
  onBack,
}: PhoneCodeEntryProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0A0A0A] p-6 text-white shadow-2xl">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-widest text-red-500">
            Code verification
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Enter verification code</h2>
          <p className="mt-2 text-sm text-gray-400">
            We sent a 4 digit code for your phone number verification.
          </p>
        </div>

        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="4 digit code"
          className="w-full rounded-lg border border-gray-700 bg-[#111] p-3 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="rounded-full"
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            className="rounded-full"
            disabled={loading}
          >
            {loading ? "Verifying..." : "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
}
