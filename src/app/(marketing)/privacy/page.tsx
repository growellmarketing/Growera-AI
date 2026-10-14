import React from "react";
import Link from "next/link";
import { Shield, Lock, Trash2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Data Handling
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: October 14, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> 1. Commitment to Privacy
              </h2>
              <p>
                LocalPilot AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates a multi-tenant business presence management software designed to assist merchants and agencies in managing Google Business Profile locations and customer reviews. We respect your privacy and are committed to protecting the business and customer data you entrust to us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" /> 2. Google API Services User Data Policy Disclosure
              </h2>
              <p id="google-disclosure">
                LocalPilot AI accesses Google Business Profile data exclusively through Google&apos;s official OAuth 2.0 authorization code flow with the scope <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs">https://www.googleapis.com/auth/business.manage</code>.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong>Data Accessed:</strong> Authorized location metadata (location name, address, store code, categories), review ratings, review comments, reviewer public display names, and merchant reply timestamps.
                </li>
                <li>
                  <strong>How Data is Used:</strong> Data is synchronized strictly to render your authorized workspace dashboard, calculate aggregate metrics, and allow your authorized team to draft and post replies.
                </li>
                <li>
                  <strong>No Selling or Advertising:</strong> We never sell your Google Business data, trade it to data brokers, or use it for third-party advertising.
                </li>
                <li>
                  <strong>Limited Use Compliance:</strong> LocalPilot AI&apos;s use and transfer of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">3. Artificial Intelligence & OpenAI Processing</h2>
              <p>
                When you request an AI draft reply or sentiment analysis, review text and star ratings are processed through the official OpenAI API using server-side endpoints.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>We do not transmit personal customer contact details (phone numbers, private email addresses) to the AI.</li>
                <li>OpenAI does not use data submitted via our enterprise API calls to train their foundation models.</li>
                <li>All AI-generated responses are saved as internal drafts and require explicit human review and approval before publication to Google.</li>
              </ul>
            </section>

            <section id="data-handling" className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-indigo-600" /> 4. Data Deletion & Disconnection Rights
              </h2>
              <p>
                You retain complete ownership and control over your business data at all times:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong>Disconnecting Google Account:</strong> You can disconnect your Google Business Profile at any time from Workspace Settings. Disconnection immediately deletes all stored OAuth access tokens and encrypted refresh tokens from our active database.
                </li>
                <li>
                  <strong>Revoking Google Access:</strong> You can also revoke LocalPilot AI access directly in your Google Account security permissions at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-indigo-600 underline">myaccount.google.com/permissions</a>.
                </li>
                <li>
                  <strong>Account Deletion:</strong> You can request full deletion of your workspace and all associated review caches, draft records, and member lists by emailing <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">privacy@localpilot.ai</code> or clicking &quot;Delete Workspace&quot; in Workspace Settings. All data is purged within 30 days.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">5. Security Measures</h2>
              <p>
                We employ industry-standard encryption, including TLS 1.3 in transit and AES-256-GCM encryption at rest for OAuth refresh tokens. Every database query is safeguarded by PostgreSQL Row-Level Security (RLS) to enforce strict isolation between customer workspaces.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">6. Contact Information</h2>
              <p>
                If you have questions regarding this Privacy Policy or wish to exercise data access rights, please contact our Data Protection Officer at:
                <br />
                <strong>Email:</strong> privacy@localpilot.ai
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
