import React from "react";

function CampusMap() {
  return (
    <section className="campus-map-section" id="campus-map">
      <div className="container">

        <div className="campus-map-heading">
          <div>
            <span className="section-label">EXPLORE CAMPUS</span>

            <h2>
              Find Your Way Around <span>Campus</span>
            </h2>

            <p>
              Explore important locations, buildings, events, and facilities
              around your campus.
            </p>
          </div>
        </div>

        <div className="campus-map-card">

          <iframe
            title="Lovely Professional University Campus Map"
            src="https://www.google.com/maps?q=Lovely+Professional+University+Punjab&output=embed"
            width="100%"
            height="520"
            style={{
              border: 0,
              display: "block",
              width: "100%",
              height: "520px",
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>

      </div>
    </section>
  );
}

export default CampusMap;