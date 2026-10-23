import React from "react";
import { Link } from "react-router-dom";
import HeadTitle from "../../Components/Head/HeadTitle";
import BannerInnerSection from "../../Components/Banner/inner";
import "./LegalPage.css";

export default function PrivacyPolicyPage() {
  return (
    <>
      <HeadTitle title="Privacy Policy | Siddiqui.Digital" />
      <BannerInnerSection title="Privacy Policy" currentPage="Privacy Policy" />
      <div className="legal-page-container">
        <div className="legal-article">
          <div className="legal-meta-bar">
            <span><strong>Effective Date:</strong> October 2026</span>
            <a
              href="/assets/Privacy_Policy_Siddiqui_Digital_Final.docx"
              download="Privacy_Policy_Siddiqui_Digital_Final.docx"
              className="legal-download-link"
              id="download-privacy-docx"
            >
              <i className="fa-solid fa-file-arrow-down" /> Download Official Policy (.docx)
            </a>
          </div>

          <p className="legal-lead">
            This policy explains how M. Q. Siddiqui, author and publisher of <strong>siddiqui.digital</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;), handles personal information when you visit siddiqui.digital, create an account, buy our digital publications, use Ask SID, read or comment on our blog, or contact us. We collect only what we need, use it only for the purposes described here, and never sell it.
          </p>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <div className="legal-subgroup">
              <h3>Account details</h3>
              <p>Your name, email address and, if you choose to give it, your phone number.</p>
            </div>
            <div className="legal-subgroup highlighted-subgroup">
              <h3>Google sign-in</h3>
              <p>
                <strong>If you sign in with Google, Google shares only your name and email address with us.</strong> We do not receive your Google password or access to your other Google data.
              </p>
            </div>
            <div className="legal-subgroup">
              <h3>Orders and payments</h3>
              <p>
                What you bought, when, the amount, the edition, your access status and your download history. Payments are processed securely by PayPal (and Stripe for historical purchases); we do not see or store your payment card details.
              </p>
            </div>
            <div className="legal-subgroup">
              <h3>Use of our products</h3>
              <p>Reading progress in the online reader, downloads, and the inquiries you submit to Ask SID.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Comments and messages</h3>
              <p>Comments you post on the blog, and messages you send through our support or contact forms.</p>
            </div>
            <div className="legal-subgroup">
              <h3>Website usage</h3>
              <p>Pages visited, device and browser type, approximate location (country or city) and how you arrived at our site, collected through cookies and analytics.</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To create and manage your account and give you access to what you bought.</li>
              <li>To process payments, send receipts, verify edition ownership, and deliver digital access.</li>
              <li>To provide Ask SID and apply its fair-use limits.</li>
              <li>To answer support requests and resolve access or payment problems.</li>
              <li>To protect our content and customers, including detecting account sharing, misuse and fraud.</li>
              <li>To moderate blog comments before they are published.</li>
              <li>To understand how the site is used and improve our books, tools and articles.</li>
              <li>To send you updates and new articles, only if you have agreed to receive them. You can unsubscribe at any time.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Ask SID</h2>
            <p>
              Ask SID uses an artificial intelligence service to answer your questions about the book. Your questions are sent to that service only to generate an answer. Please do not enter confidential, personal or commercially sensitive information about yourself or others. We may review questions in anonymized form to improve Ask SID and the book.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Who We Share Information With</h2>
            <p>We share information only with trusted service providers who help us run the site, and only as needed:</p>
            <ul>
              <li><strong>PayPal</strong>, our secure payment partner, which processes payments (along with Stripe for historical records).</li>
              <li><strong>Google</strong>, for Google authentication sign-in and website analytics. Google shares only the buyer&rsquo;s name and email with us.</li>
              <li>Our website hosting and email providers.</li>
              <li>Our artificial intelligence provider, for Ask SID.</li>
            </ul>
            <p>These providers may process information outside the United Arab Emirates. We also disclose information when the law requires it. We never sell or rent your personal information to anyone.</p>
          </section>

          <section className="legal-section">
            <h2>5. Cookies</h2>
            <p>
              We use essential cookies to keep you signed in and to run the cart and checkout. With your consent, we also use analytics cookies to understand how visitors use the site. You can accept or decline analytics cookies through the cookie notice and change your choice at any time in your browser settings.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. How Long We Keep Information</h2>
            <ul>
              <li><strong>Account and purchase records:</strong> for as long as your account is active, and afterward as long as needed for legal, tax and accounting purposes.</li>
              <li><strong>Support messages:</strong> up to 2 years.</li>
              <li><strong>Analytics data:</strong> according to our Google Analytics retention settings.</li>
            </ul>
            <p>When information is no longer needed, we delete or anonymize it.</p>
          </section>

          <section className="legal-section">
            <h2>7. Security</h2>
            <p>
              We use secure connections (HTTPS), secure payment processing, restricted administrator access and regular backups to protect your information. No system can be completely secure, but we work to protect your data and will act promptly if a problem occurs.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Your Choices and Rights</h2>
            <ul>
              <li>Access the personal information we hold about you, and correct it if it is wrong.</li>
              <li>Change your email address or password in your account.</li>
              <li>Unsubscribe from updates at any time.</li>
              <li>Ask us to delete your account. Some records, such as invoices, must be kept for legal reasons.</li>
            </ul>
            <p>To make a request, email <a href="mailto:info@siddiqui.digital">info@siddiqui.digital</a>. We will reply within 30 days.</p>
          </section>

          <section className="legal-section">
            <h2>9. Children</h2>
            <p>Our website and products are intended for adults and professionals. We do not knowingly collect information from anyone under 18.</p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to This Policy</h2>
            <p>We may update this policy from time to time. The latest version will always be on this page, with its effective date.</p>
          </section>

          <section className="legal-section">
            <h2>11. Contact</h2>
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
