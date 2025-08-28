import React from 'react';
import { ShieldCheck, Lock, Database, User } from 'lucide-react';

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


// Main component for the Privacy Policy page.
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">Your trust and privacy are paramount to us.</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: August 28, 2025</p>
        </div>

        <div className="space-y-10">
          {/* Introduction Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShieldCheck className="w-6 h-6 mr-3 text-green-600" />
              Our Commitment to Your Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to KnowGrow. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our Sites and our services.
            </p>
          </section>

          {/* Data Collection Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-3 text-green-600" />
              What Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform or otherwise when you contact us.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Personal Information:</strong> Name, email address, password, and contact preferences.</li>
              <li><strong>Learning Data:</strong> Your progress, course completions, quiz results, and performance analytics to personalize your learning path.</li>
              <li><strong>Usage Data:</strong> Information about how you use our platform, such as features you use and time spent on the site. This is collected automatically.</li>
            </ul>
          </section>

          {/* Data Security Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-3 text-green-600" />
              How We Secure Your Data
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. These include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using SSL/TLS. Passwords and other sensitive information are hashed in our database.</li>
              <li><strong>Access Control:</strong> We limit access to personal information to employees, contractors, and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations.</li>
              <li><strong>Regular Audits:</strong> We regularly review our information collection, storage, and processing practices, including physical security measures, to guard against unauthorized access to systems.</li>
            </ul>
          </section>

          {/* User Rights Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-6 h-6 mr-3 text-green-600" />
              Your Data Protection Rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to access, correct, update, or request deletion of your personal information. You can review and change your information by logging into your account and visiting your account profile page. You may also send us an email at <a href="mailto:privacy@knowgrow.com" className="text-green-600 hover:underline">privacy@knowgrow.com</a> to request access to, correct, or delete any personal information that you have provided to us.
            </p>
          </section>
          
          {/* Contact Section */}
          <section>
             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
             <p className="text-gray-700 leading-relaxed">
                If you have questions or comments about this policy, you may email us at <a href="mailto:support@knowgrow.com" className="text-green-600 hover:underline">support@knowgrow.com</a> or by post to:
             </p>
             <address className="mt-2 not-italic text-gray-700">
                KnowGrow, Inc.<br />
                123 Learning Lane<br />
                Coimbatore, Tamil Nadu, 641001<br />
                India
             </address>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
