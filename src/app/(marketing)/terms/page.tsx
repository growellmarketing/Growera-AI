import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: October 14, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> 1. Agreement to Terms
              </h2>
              <p>
                By registering for an account, accessing, or using LocalPilot AI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company, marketing agency, or other legal entity, you represent that you have the authority to bind such entity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">2. Customer Responsibilities & Authorized Use</h2>
              <p>
                You agree to only connect Google Business Profile accounts that you own or for which you have received express written authorization from the account owner. You must not:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Attempt to scrape, reverse engineer, or bypass any API rate limits or security mechanisms.</li>
                <li>Use AI-generated content to publish fraudulent, defamatory, discriminatory, or harassing responses to genuine customer reviews.</li>
                <li>Share account credentials or allow unauthorized third parties access to your workspace.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">3. Third-Party Integrations & Google Policies</h2>
              <p>
                LocalPilot AI interacts with external services, including Google Business Profile APIs and OpenAI APIs. Your use of the Service is conditioned upon compliance with Google&apos;s Business Profile policies. We are not responsible for account suspensions, verification revocations, or restrictions imposed by Google LLC resulting from violation of Google terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">4. AI-Generated Output & Editorial Responsibility</h2>
              <p>
                AI review replies are suggestions provided for your convenience. You are solely responsible for reviewing and editing all AI-generated drafts prior to publication. LocalPilot AI shall not be liable for commitments, warranties, or statements made in replies published by you or your authorized team members.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, in no event shall LocalPilot AI or its suppliers be liable for any indirect, incidental, punitive, or consequential damages arising out of the use or inability to use the Service.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
