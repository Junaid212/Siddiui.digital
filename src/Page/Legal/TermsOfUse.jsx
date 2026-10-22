import React from "react";
import { Link } from "react-router-dom";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import "./LegalPage.css";

export default function TermsOfUsePage() {
  return (
    <>
      <HeadTitle title="Terms of Use | Siddiqui.Digital" />
      <BannerInnerSection title="Terms of Use" currentPage="Terms of Use" />
      <div className="legal-page-container">
        <div className="legal-article">
          <div className="legal-meta-bar">
            <span><strong>Effective Date:</strong> October 2026</span>
            <a
              href="/assets/Terms_of_Use_Siddiqui_Digital_Final.docx"
              download="Terms_of_Use_Siddiqui_Digital_Final.docx"
              className="legal-download-link"
              id="download-terms-docx"
            >
              <i className="fa-solid fa-file-arrow-down" /> Download Official Terms (.docx)
            </a>
          </div>

          <p className="legal-lead">
            By using <strong>siddiqui.digital</strong>, creating an account or buying a product, you agree to these Terms of Use, our <Link to="/privacy-policy">Privacy Policy</Link> and our <Link to="/refund-policy">Refund Policy</Link>. Please read them carefully.
          </p>

          <section className="legal-section">
            <h2>1. About Us</h2>
            <p>
              siddiqui.digital is operated by M. Q. Siddiqui, author and publisher of <em>Marketing Reclassified: From Promotion to Governed Strategic Intelligence</em>, together with related companion materials, the Ask SID book companion, articles and advisory information. M. Q. Siddiqui, siddiqui.digital, United Arab Emirates. Email: <a href="mailto:info@siddiqui.digital">info@siddiqui.digital</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Your Account</h2>
            <ul>
              <li>You must be at least 18 years old to create an account.</li>
              <li>Provide accurate information and keep your login details secure.</li>
              <li>Your account is personal. Do not share it or let others use it.</li>
              <li>Accounts may be used on a limited number of devices at the same time.</li>
              <li>You are responsible for activity on your account. Tell us at once if you think it has been used without permission.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. What You Buy</h2>
            <div className="legal-subgroup">
              <h3>Online Reading Edition ($20)</h3>
              <p>Online access to the complete book through our protected reader, and the Starter Pack.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Digital Companion Edition ($49.99)</h3>
              <p>Online access, a downloadable PDF of the book, the full Companion Pack and access to Ask SID under its usage limits.</p>
            </div>
            <ul>
              <li>Access begins once payment is confirmed.</li>
              <li>Prices are shown in US dollars (USD). Taxes, where they apply, are shown at checkout.</li>
              <li>Payments are processed securely via Stripe.</li>
              <li>If you own the Online Reading Edition, you may upgrade to the Digital Companion Edition by paying only the price difference (USD 29.99).</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Your License</h2>
            <p>
              When you buy a product, you receive a personal, non-exclusive, non-transferable license to read and use it for your own professional development and within your own organization.
            </p>
            <p><strong>You may:</strong></p>
            <ul>
              <li>Read the book online or on your own devices;</li>
              <li>Print pages for your personal use, where printing is permitted;</li>
              <li>Use the Companion Pack worksheets in your own organization&rsquo;s meetings and planning.</li>
            </ul>
            <p><strong>You may not:</strong></p>
            <ul>
              <li>Share, sell, rent, lend, upload or distribute the book, the PDF or the companion materials, in whole or in part;</li>
              <li>Share your account or your download links;</li>
              <li>Remove or alter copyright notices, watermarks or protection;</li>
              <li>Copy content to create competing products, courses or publications;</li>
              <li>Use the content, or Ask SID, to train artificial intelligence systems, or extract content automatically.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Intellectual Property</h2>
            <p>
              All content on this site, including the book, companion materials, articles, images and design, is owned by M. Q. Siddiqui and protected by copyright. The Sid Philosophy, the Sid Approach, the Sid definition of marketing, the Value Drift Index (VDI) and the Adaptive Value Framework (AVF) are the author&rsquo;s original frameworks. Short quotations with clear credit to the author and the book are welcome.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Ask SID</h2>
            <ul>
              <li>Ask SID is an AI-powered companion that helps you explore the ideas in the book.</li>
              <li>Its answers may contain errors. It does not replace professional, legal, financial or management advice, and you remain responsible for decisions you make.</li>
              <li>Usage is subject to fair-use limits shown in your account, which we may adjust.</li>
              <li>Do not enter confidential or personal information about yourself or others.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Blog and Comments</h2>
            <p>
              Comments are reviewed before they are published, and we may decline or remove any comment. Do not post content that is unlawful, offensive, misleading, promotional or that infringes the rights of others.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Suspension and Termination</h2>
            <p>
              We may suspend or close an account, without refund, if it is used in breach of these terms, including sharing access, redistributing content, fraud or abuse of Ask SID.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Refunds</h2>
            <p>Refunds are handled under our <Link to="/refund-policy">Refund Policy</Link>, which forms part of these terms.</p>
          </section>

          <section className="legal-section">
            <h2>10. Information Only</h2>
            <p>
              Our books, tools and articles share ideas and frameworks for general information and professional development. They are not professional advice for your specific situation. Results depend on how ideas are applied.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Availability</h2>
            <p>
              We work to keep the site and the reader available, but we cannot guarantee uninterrupted access. We may carry out maintenance or update features, and we will try to give notice of planned interruptions.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the site or our products. Our total liability for any claim relating to a purchase is limited to the amount you paid for it.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United Arab Emirates. Any dispute will be handled by the competent courts of the United Arab Emirates, unless the law requires otherwise.
            </p>
          </section>

          <section className="legal-section">
            <h2>14. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. The version in force when you make a purchase applies to that purchase. Continued use of the site after changes means you accept the updated terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>15. Contact</h2>
            <p>
              <strong>M. Q. Siddiqui</strong>, siddiqui.digital, United Arab Emirates.<br />
              Email: <a href="mailto:info@siddiqui.digital">info@siddiqui.digital</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
