"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FieldErrors = {
  email?: string[];
  productUrl?: string[];
  productDescription?: string[];
};

export function ValidateForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [upgrade, setUpgrade] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    setUpgrade(false);

    try {
      const res = await fetch("/api/submit-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productUrl: productUrl || null,
          productDescription: productDescription || null,
        }),
      });
      const data = await res.json();

      if (res.status === 402) {
        setUpgrade(true);
        setError(data.message ?? "You've used your free validations");
        return;
      }

      if (res.status === 429) {
        setError(data.message ?? "Please wait a few minutes before trying again.");
        return;
      }

      if (!res.ok) {
        setFieldErrors(data.fields ?? {});
        setError(data.message ?? "Could not submit validation");
        return;
      }

      router.push(`/request/${data.id}`);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="validate-form" onSubmit={onSubmit} noValidate>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@store.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email?.[0] && <em className="field-error">{fieldErrors.email[0]}</em>}
      </label>

      <label className="field">
        <span>Product URL (optional)</span>
        <input
          type="url"
          name="productUrl"
          placeholder="https://..."
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
        />
        {fieldErrors.productUrl?.[0] && (
          <em className="field-error">{fieldErrors.productUrl[0]}</em>
        )}
      </label>

      <label className="field">
        <span>Or describe the product</span>
        <textarea
          name="productDescription"
          rows={4}
          placeholder="e.g. Portable neck fan for outdoor workers, USB-C, under $25 landed"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        {fieldErrors.productDescription?.[0] && (
          <em className="field-error">{fieldErrors.productDescription[0]}</em>
        )}
      </label>

      {error && (
        <div className={`form-banner ${upgrade ? "is-upgrade" : "is-error"}`} role="alert">
          <p>{error}</p>
          {upgrade && (
            <Link className="btn" href="/pricing">
              Go to payment options →
            </Link>
          )}
        </div>
      )}

      <button className="btn btn-lg" type="submit" disabled={submitting}>
        {submitting ? "Starting research…" : "Run free validation →"}
      </button>

      <p className="form-note">
        We’re checking Reddit, Google Trends, and ad activity for this product — usually about a
        minute. Max 3 free validations per email.
      </p>
    </form>
  );
}
