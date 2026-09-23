import React from "react";
const quotes = [
  ["“I can finally find a quiet place to study without walking across half the campus.”", "Aarav", "Computer Science student"],
  ["“The events section makes it much easier to discover things outside my department.”", "Meera", "Management student"],
  ["“Lost & Found is such a simple idea, but it solves a real everyday problem.”", "Rohan", "Engineering student"]
];
export default function Testimonials() {
  return <section className="section testimonials"><div className="container"><div className="section-heading center"><span className="eyebrow">STUDENT VOICES</span><h2>Made for real <span>campus life.</span></h2></div><div className="quote-grid">{quotes.map(([q,n,r])=><article className="quote-card" key={n}><div className="stars">★★★★★</div><p>{q}</p><strong>{n}</strong><small>{r}</small></article>)}</div></div></section>;
}