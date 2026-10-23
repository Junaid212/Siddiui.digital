import React from "react";
import { Link } from "react-router-dom";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import "./LegalPage.css";

export default function RefundPolicyPage() {
  return (
    <>
      <HeadTitle title="Refund Policy | Siddiqui.Digital" />
      <BannerInnerSection title="Refund Policy" currentPage="Refund Policy" />
      <div className="legal-page-container">
        <div className="legal-article">
          <div className="legal-meta-bar">
            <span><strong>Effective Date:</strong> October 2026</span>
            <a
              href="/assets/Refund_Policy_Marketing_Reclassified_Final.docx"
              download="Refund_Policy_Marketing_Reclassified_Final.docx"
              className="legal-download-link"
              id="download-refund-docx"
            >
              <i className="fa-solid fa-file-arrow-down" /> Download Official Policy (.docx)
            </a>
          </div>

          <p className="legal-lead">
            We want every reader to be satisfied with their purchase. Because our products are digital and are delivered immediately, refunds are limited to the situations described below. This policy applies to all purchases made on <strong>siddiqui.digital</strong>.
          </p>

          <section className="legal-section">
            <h2>1. What This Policy Covers</h2>
            <ul>
              <li><strong>Online Reading Edition (USD 20):</strong> online access to the complete book, with the Starter Pack.</li>
              <li><strong>Digital Companion Edition (USD 49.99):</strong> online access, a downloadable PDF of the book, the full Companion Pack and access to Ask SID, subject to its usage terms.</li>
              <li><strong>Upgrades:</strong> from the Online Reading Edition to the Digital Companion Edition (USD 29.99 difference).</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. When You Can Receive a Full Refund</h2>
            <div className="legal-subgroup">
              <h3>Change of mind before use</h3>
              <p>You request a refund within 7 days of purchase, and you have not opened the book online, downloaded the PDF or downloaded the Companion Pack.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Access problem we cannot fix</h3>
              <p>You paid but cannot access your purchase, and our support team cannot fix the problem within 5 business days of your report.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Duplicate purchase</h3>
              <p>You were charged twice for the same order, or charged for an edition you already own.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Incorrect charge</h3>
              <p>You were charged an amount different from the price shown at checkout.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Unauthorized payment</h3>
              <p>A payment was made from your card or account without your permission. Please also contact your card issuer.</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. When Refunds Are Not Available</h2>
            <ul>
              <li>After you have opened the book online, downloaded the PDF or downloaded the Companion Pack, except in the specific cases listed in Section 2.</li>
              <li>If you have changed your mind after using the product, or if the content did not meet personal expectations.</li>
              <li>For access suspended because of a breach of the Terms of Use, such as sharing account access or redistributing the book or its companion materials.</li>
              <li>For purchases made with complimentary or promotional codes that reduced the price to zero.</li>
              <li>For any separate part of an edition, such as Ask SID or the Companion Pack, on its own.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Upgrades</h2>
            <ul>
              <li>If you upgrade from the Online Reading Edition ($20) to the Digital Companion Edition ($49.99), you pay only the price difference (USD 29.99).</li>
              <li>An upgrade can be refunded within 7 days if you have not downloaded the PDF or the Companion Pack. Your Online Reading Edition access will continue.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. How to Request a Refund</h2>
            <p>
              Use the <Link to="/contact">Contact Page</Link> on the website or email <a href="mailto:info@siddiqui.digital">info@siddiqui.digital</a>.<br />
              Include your full name, the email address used for the purchase, your order number and the reason for your request. We will reply within 2 business days.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. How Refunds Are Paid</h2>
            <p>
              Approved refunds are returned to the original payment method through PayPal (or Stripe for historical purchases). Banks usually take 5 to 10 business days to show the refund on your statement. When a refund is approved, access to the refunded edition, its downloads and Ask SID ends.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Technical Problems</h2>
            <p>
              If you have trouble reading online, downloading files or logging in, please contact us first. Most problems, such as an expired download link or a forgotten password, can be fixed quickly without a refund. We can restore access, send a new download link or reset your download limit.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Chargebacks</h2>
            <p>
              If you have a problem with your purchase, please contact us before disputing the payment with your bank. We will do our best to resolve it promptly. Access to the book is suspended while a payment dispute is open.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. The version shown on the website at the time of your purchase applies to that purchase.</p>
          </section>

          <section className="legal-section">
            <h2>10. Contact</h2>
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
