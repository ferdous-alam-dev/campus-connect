import React from "react";
const events = [
  ["🎤", "Campus Fest 2026", "Apr 18 · Main Ground", "Music, food, games & student activities"],
  ["💡", "Tech Innovation Meetup", "Apr 21 · Block 32", "Build, pitch and connect with innovators"],
  ["🏆", "Sports Championship", "Apr 25 · Sports Complex", "Inter-school competition & finals"]
];
export default function Events({ onView = () => {} }) {
  return <section id="events" className="section events-section"><div className="container">
    <div className="section-heading split"><div><span className="eyebrow">WHAT'S HAPPENING</span><h2>Upcoming <span>events.</span></h2></div><button className="outline-btn" onClick={() => onView("All events")}>View all events →</button></div>
    <div className="event-grid">{events.map(([icon,title,date,desc])=><article className="event-card" key={title}><div className="event-icon">{icon}</div><div className="event-date">{date}</div><h3>{title}</h3><p>{desc}</p><button onClick={()=>onView(title)}>View Event →</button></article>)}</div>
  </div></section>;
}