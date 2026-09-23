import React, { useState } from "react";

const features = [
  {
    icon: "📍",
    title: "Find Available Spaces",
    text: "Locate empty classrooms, libraries, study areas and common spaces.",
    action: "map",
  },
  {
    icon: "📅",
    title: "Discover Relevant Events",
    text: "Find workshops, festivals, clubs and campus activities.",
    action: "events",
  },
  {
    icon: "🎒",
    title: "Lost & Found",
    text: "Report or find lost belongings quickly and easily.",
    action: "lost",
  },
  {
    icon: "👥",
    title: "Connect & Engage",
    text: "Discover clubs, meet students and build your campus network.",
    action: "community",
  },
];

export default function Features() {
  const [modal, setModal] = useState(null);

  const handleExplore = (action) => {
    if (action === "map") {
      document
        .getElementById("campus-map")
        ?.scrollIntoView({ behavior: "smooth" });
    }

    if (action === "events") {
      document
        .getElementById("events")
        ?.scrollIntoView({ behavior: "smooth" });
    }

    if (action === "lost") {
      setModal({
        title: "Lost & Found",
        text: "Lost & Found system will let students report lost items and find reported belongings.",
      });
    }

    if (action === "community") {
      setModal({
        title: "Connect & Engage",
        text: "Community features will let students discover clubs, connect with other students and participate in campus activities.",
      });
    }
  };

  return (
    <>
      <section id="explore" className="section features-section">
        <div className="container">

          <div className="section-heading center">
            <span className="eyebrow">
              EVERYTHING IN ONE PLACE
            </span>

            <h2>
              Make campus life <span>easier.</span>
            </h2>

            <p>
              Four everyday problems. One simple campus companion.
            </p>
          </div>

          <div className="feature-grid">

            {features.map((feature) => (
              <article
                className="feature-card"
                key={feature.title}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

                <button
                  onClick={() =>
                    handleExplore(feature.action)
                  }
                >
                  Explore →
                </button>
              </article>
            ))}

          </div>
        </div>
      </section>

      {modal && (
        <div
          className="feature-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="feature-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModal(null)}
            >
              ×
            </button>

            <h3>{modal.title}</h3>

            <p>{modal.text}</p>

            <button
              className="primary-btn"
              onClick={() => setModal(null)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}