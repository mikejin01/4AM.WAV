"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import type { MembershipTier } from "./types";
import { updatePhone } from "./actions";

type ProfileContentProps = {
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  phone: string | null;
  membershipTier: MembershipTier;
};

export default function ProfileContent({
  user,
  phone,
  membershipTier,
}: ProfileContentProps) {
  const [editing, setEditing] = useState(false);
  const [phoneValue, setPhoneValue] = useState(phone ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("phone", phoneValue);

    const result = await updatePhone(formData);

    if (result.success) {
      setEditing(false);
      setMessage({ type: "success", text: "Phone number updated" });
    } else {
      setMessage({ type: "error", text: result.error ?? "Failed to save" });
    }

    setSaving(false);
  }

  function handleCancel() {
    setPhoneValue(phone ?? "");
    setEditing(false);
    setMessage(null);
  }

  return (
    <main className="min-h-screen bg-black px-6 pt-28 pb-16 sm:px-10">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-10 text-4xl font-bold text-white">
          Account Settings
        </h1>

        {/* Avatar + Name */}
        <div className="mb-10 flex items-center gap-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-2xl font-bold text-gold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-white">{user.name}</p>
            <p className="text-sm text-white/50">{user.email}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-6">
          {/* Email (read-only) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Email
            </label>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50">
              {user.email}
            </div>
          </div>

          {/* Phone (editable) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Phone
            </label>
            {editing ? (
              <div className="space-y-3">
                <input
                  ref={inputRef}
                  type="tel"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  placeholder="+1 555 123 4567"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gold-light disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-white/50">
                  {phone || "Not set"}
                </span>
                <button
                  onClick={() => {
                    setEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="text-sm font-medium text-gold transition-colors hover:text-gold-light"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Membership */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Membership
            </label>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                {membershipTier === "vip" ? (
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">
                    VIP
                  </span>
                ) : (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/60">
                    Free
                  </span>
                )}
                <span className="text-sm text-white/50">
                  {membershipTier === "vip"
                    ? "You have VIP access"
                    : "Basic account"}
                </span>
              </div>
              {membershipTier === "free" && (
                <button
                  onClick={async () => {
                    setUpgrading(true);
                    setMessage(null);
                    try {
                      const res = await fetch("/api/checkout", { method: "POST" });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        setMessage({ type: "error", text: data.error ?? "Failed to start checkout" });
                        setUpgrading(false);
                      }
                    } catch {
                      setMessage({ type: "error", text: "Something went wrong" });
                      setUpgrading(false);
                    }
                  }}
                  disabled={upgrading}
                  className="rounded-lg bg-gold px-4 py-2 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light disabled:opacity-50"
                >
                  {upgrading ? "Redirecting..." : "Upgrade to VIP"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error message */}
        {message && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </main>
  );
}
