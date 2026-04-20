import React from "react";
import "./CoursesNav.css";

export default function CoursesNav({ categories }) {
  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = [
    { id: "signature", label: "Signature" },
    ...categories.map((c) => ({ id: c.id, label: c.title })),
  ];

  return (
    <nav className="courses-nav">
      <div className="nav-container">
        <div className="nav-scroll">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="nav-link"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}