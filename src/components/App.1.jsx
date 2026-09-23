import React from "react";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Events from "./Events";
import Testimonials from "./Testimonials";
import CampusMap from "./CampusMap";
import Community from "./Community";

export default function App() {
 const handleCommunityJoin = async () => {
  const savedUser = localStorage.getItem("campusUser");

  if (!savedUser) {
    alert("Please Login or Sign Up first to join the community.");
    return;
  }

  try {
    const user = JSON.parse(savedUser);

    const response = await fetch(
      "http://localhost:5000/api/community/join",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Could not join community.");
      return;
    }

    alert(data.message);
  } catch (error) {
    console.error("Community join error:", error);
    alert("Backend server se connection nahi ho raha.");
  }
};

  const handleEventView = (eventName) => {
    alert(`${eventName}\n\nEvent details will be available here.`);
  };

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Features />

        <HowItWorks />

        <Events onView={handleEventView} />

        <Testimonials />

        <CampusMap />
        
        <Community />
        
        {/* =====================================
            COMMUNITY
        ====================================== */}
        <section id="community" className="cta-section">
          <div className="container">
            <div className="cta-box">
              <span className="section-label">
                JOIN CAMPUSCONNECT
              </span>

              <h2>
                Make your campus feel like <span>home.</span>
              </h2>

              <p>
                Connect with students, discover campus events,
                find useful spaces and make campus life easier.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={handleCommunityJoin}
              >
                Join Community →
              </button>
            </div>
          </div>
        </section>

        {/* =====================================
            ABOUT
        ====================================== */}
        <section id="about" className="section about-section">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">ABOUT CAMPUSCONNECT</span>

              <h2>
                Your campus, <span>one simple platform.</span>
              </h2>

              <p>
                CampusConnect brings together campus spaces, events,
                lost &amp; found and student community into one
                easy-to-use experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================
          FOOTER
      ====================================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <a href="#" className="logo">
                🎓 Campus<span>Connect</span>
              </a>

              <p>
                Making campus life easier for every student.
              </p>
            </div>

            <div className="footer-links">
              <a href="#">Home</a>
              <a href="#explore">Explore</a>
              <a href="#events">Events</a>
              <a href="#community">Community</a>
              <a href="#campus-map">Campus Map</a>
              <a href="#about">About</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 CampusConnect. Built for students.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
