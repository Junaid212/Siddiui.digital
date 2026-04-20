import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SignatureCard from "../SignatureCard";
import "./SignatureSection.css";

export default function SignatureSection({ items, onOpen }) {
  return (
    <section id="signature" className="signature-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="section-header"
      >
        <div className="header-badge">
          <Sparkles className="badge-icon" strokeWidth={1.5} />
          <span className="badge-text">Signature Frameworks & Flagship Concepts</span>
        </div>
        <h2 className="section-title">
          Proprietary thinking at the
          <span className="italic"> center of the ecosystem.</span>
        </h2>
        <p className="section-description">
          Three distinctive intellectual assets that anchor the broader
          learning philosophy — shaping how every other area is approached.
        </p>
      </motion.div>

      <div className="signature-grid">
        {items.map((course, i) => (
          <SignatureCard
            key={course.code}
            course={course}
            onOpen={onOpen}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}