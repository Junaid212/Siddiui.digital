import React, { useState } from "react";
import { SIGNATURE_FRAMEWORKS, CATEGORIES } from "../../Data/SignatureFrameWork";
import CoursesHero from "../../Components/CoursesHero";
import CoursesNav from "../../Components/CoursesNav";
import SignatureSection from "../../Components/SignatureSection";
import CategorySection from "../../Components/CategorySection";
import CourseDetailDialog from "../../Components/CourseDetailDialog";
import BannerHome from "../../Components/Banner";


export default function Courses() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (course) => {
    setSelected(course);
    setOpen(true);
  };

  return (
    <div className="courses-page">
        <BannerHome />
      <CoursesNav categories={CATEGORIES} />

      <main className="courses-main">
        {/* <CoursesHero /> */}

        <div className="separator" />

        <SignatureSection items={SIGNATURE_FRAMEWORKS} onOpen={handleOpen} />

        <div className="separator" />

        {CATEGORIES.map((category, idx) => (
          <div key={category.id}>
            <CategorySection category={category} onOpen={handleOpen} />
            {idx < CATEGORIES.length - 1 && (
              <div className="category-separator" />
            )}
          </div>
        ))}

        <footer className="courses-footer">
          <div className="footer-content">
            <p className="footer-quote">
              One coherent philosophy. Many pathways into it.
            </p>
            <p className="footer-note">
              These broad learning themes represent future offerings and upcoming
              learning areas. Specific availability, formats, and enrolment details
              will be announced in due course.
            </p>
          </div>
        </footer>
      </main>
      <style>{`
      /* CSS Custom Properties (design tokens) – adjust values to match your theme */
:root {
  --background: #ffffff;
  --border: #e5e7eb;
  --muted-foreground: #6b7280;
//   --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//   --font-serif: Georgia, 'Times New Roman', serif;
}

/* Base container */
.courses-page {
  min-height: 100vh;
  background-color: var(--background);
}

/* Main content area */
.courses-main {
  max-width: 90rem;        /* 1280px (Tailwind's max-w-7xl) */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;    /* px-6 = 1.5rem */
  padding-right: 1.5rem;
}

/* Responsive padding for medium screens and up (md:px-10) */
@media (min-width: 768px) {
  .courses-main {
    padding-left: 2.5rem;   /* px-10 = 2.5rem */
    padding-right: 2.5rem;
  }
}

/* Separator lines */
.separator {
  height: 1px;
  background-color: var(--border);
  opacity: 0.7;
  margin-top: 1rem;        /* my-4 = 1rem top+bottom */
  margin-bottom: 1rem;
}

.category-separator {
  height: 1px;
  background-color: var(--border);
  opacity: 0.6;
}

/* Footer styling */
.courses-footer {
  border-top: 1px solid var(--border);
  opacity: 0.6;
  padding-top: 5rem;       /* py-20 = 5rem top+bottom */
  padding-bottom: 5rem;
  margin-top: 2.5rem;      /* mt-10 = 2.5rem */
}

.footer-content {
  max-width: 42rem;        /* max-w-2xl = 42rem */
}

.footer-quote {
//   font-family: var(--font-serif);
//   font-style: italic;
  color: var(--muted-foreground);
  font-size: 1.125rem;     /* text-lg = 1.125rem */
  line-height: 1.625;      /* leading-relaxed = 1.625 */
}

.footer-note {
  margin-top: 1rem;        /* mt-4 = 1rem */
  font-size: 0.875rem;     /* text-sm = 0.875rem */
  color: var(--muted-foreground);
}
      `}</style>

      <CourseDetailDialog
        course={selected}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}