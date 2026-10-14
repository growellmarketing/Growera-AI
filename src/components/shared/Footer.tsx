import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                LocalPilot<span className="text-indigo-400">.ai</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-tenant AI business management and Google Business Profile intelligence platform for multi-unit brands, local stores, and digital marketing agencies.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Review Automation
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Multi-Location Sync
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Sentiment Intelligence
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Plans & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#solutions" className="hover:text-white transition-colors">
                  Restaurants & Cafes
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="hover:text-white transition-colors">
                  Salons & Healthcare Clinics
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="hover:text-white transition-colors">
                  Multi-Store Retail
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="hover:text-white transition-colors">
                  Marketing Agencies
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Trust & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy#data-handling" className="hover:text-white transition-colors">
                  Data Handling & Deletion
                </Link>
              </li>
              <li>
                <Link href="/privacy#google-disclosure" className="hover:text-white transition-colors">
                  Google API Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3">
          <p>
            Google and Google Business Profile are registered trademarks of Google LLC. LocalPilot AI is an independent software application that integrates with the official Google Business Profile APIs and is not affiliated with, sponsored by, or endorsed by Google LLC.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} LocalPilot AI. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
