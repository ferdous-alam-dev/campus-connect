import React from "react"

export default function Hero() {
  const scrollToMap = () => {
    document
      .getElementById("campus-map")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCommunity = () => {
    document
      .getElementById("community")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-badge">
            🎓 Your Campus. Your Community.
          </span>

          <h1>
            Campus Life &
            <span> Student Experience</span>
          </h1>

          <p>
            Navigate your campus smarter. Find available spaces,
            discover events, recover lost belongings and connect
            with other students — all in one place.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={scrollToMap}
            >
              Explore Campus →
            </button>

            <button
              className="secondary-btn"
              onClick={scrollToCommunity}
            >
              Join Community
            </button>

          </div>

          <div className="trust-row">
            <span>✓ Built for students</span>
            <span>✓ Fast & simple</span>
            <span>✓ Campus-first</span>
          </div>

        </div>

        <div className="hero-map-wrapper">

          <div className="hero-map-card">

          <iframe
  title="Lovely Professional University Campus Map"
  src="https://www.google.com/maps?q=Lovely+Professional+University+Punjab&output=embed"
  className="hero-map-image"
  loading="lazy"
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
/>  
              
              
              
            

            <div className="map-overlay">

              <div className="map-pin">
                📍
              </div>

              <div>
                <strong>Campus Map</strong>
                <small>Explore your campus</small>
              </div>

            </div>

          </div>

          <div className="floating-card card-space">
            <span>📍</span>

            <div>
              <b>Find Available Spaces</b>
              <small>Study spots nearby</small>
            </div>
          </div>

          <div className="floating-card card-event">
            <span>📅</span>

            <div>
              <b>Discover Events</b>
              <small>Campus events this week</small>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}