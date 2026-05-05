import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Mailform() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/functions/mailtosomeonebyadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, message }),
      });
      const data = await res.json();
      setResult(data.message || (data.ok ? "Mail sent!" : "Failed to send mail."));
    } catch (err) {
      setResult("Error sending mail.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRecipient("");
    setMessage("");
    setResult(null);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-[#18181b] p-6 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Send Mail</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Recipient</label>
          <input
            type="email"
            className="w-full p-2 bg-[#222] border border-gray-700 rounded text-white"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            required
            placeholder="Recipient email"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            className="w-full p-2 bg-[#222] border border-gray-700 rounded text-white min-h-[100px]"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            placeholder="Type your message here..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Sending..." : "Send"}</Button>
        </div>
        {result && <div className="mt-2 text-sm text-gray-300">{result}</div>}
      </form>
    </div>
  );
}