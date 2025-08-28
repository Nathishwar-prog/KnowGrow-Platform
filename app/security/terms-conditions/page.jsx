import React from 'react';
import { FileText, UserCheck, Copyright, Ban, LogOut, AlertTriangle, Gavel, RefreshCw } from 'lucide-react';

// A simple functional component for the header, matching the landing page style.
const Header = () => (
  <header className="bg-white/95 backdrop-blur-lg border-b border-green-500/20 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <a href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.22-6.22l-1.58 1.58a6 6 0 108.486 8.486L12 18.75l-1.78-1.78a6 6 0 00-8.486-8.486l1.58-1.58A6 6 0 0112 6.253z" /></svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            KnowGrow
          </span>
        </a>
        <a href="/" className="px-4 py-2 rounded-full font-semibold text-md bg-green-500 text-white hover:bg-green-600 transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  </header>
);

// A simple functional component for the footer.
const Footer = () => (
    <footer className="py-12 border-t border-green-500/20 bg-white/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Growing knowledge through artificial intelligence.</p>
        </div>
    </footer>
);


// Main component for the Terms & Conditions page.
export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">Please read these terms carefully before using our service.</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: August 28, 2025</p>
        </div>

        <div className="space-y-10">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-green-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using the KnowGrow platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). These Terms apply to all visitors, users, and others who access or use the Service. If you disagree with any part of the terms, then you may not access the Service.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-3 text-green-600" />
              2. User Accounts
            </h2>
            <p className="text-gray-700 leading-relaxed">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Copyright className="w-6 h-6 mr-3 text-green-600" />
              3. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of KnowGrow, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks may not be used in connection with any product or service without the prior written consent of KnowGrow, Inc.
            </p>
          </section>
          
          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Ban className="w-6 h-6 mr-3 text-green-600" />
              4. Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to use the Service for any purpose that is illegal or prohibited by these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the Service in any way that could damage, disable, overburden, or impair the Service.</li>
              <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems.</li>
              <li>Use any automated system, including "robots," "spiders," or "offline readers," to access the Service.</li>
              <li>Reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by us.</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <LogOut className="w-6 h-6 mr-3 text-green-600" />
              5. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-green-600" />
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall KnowGrow, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Gavel className="w-6 h-6 mr-3 text-green-600" />
              7. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of Tamil Nadu, India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <RefreshCw className="w-6 h-6 mr-3 text-green-600" />
              8. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          {/* Contact Section */}
          <section>
             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
             <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms, please contact us at <a href="mailto:support@knowgrow.com" className="text-green-600 hover:underline">support@knowgrow.com</a>.
             </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
