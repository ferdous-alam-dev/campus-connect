import React from "react";
const steps = [
  ["01", "Search", "Tell CampusConnect what you need — a space, event, item or club."],
  ["02", "Discover", "See relevant options around campus with clear, useful details."],
  ["03", "Connect", "Take action: attend, report, reserve, or connect with people."]
];
export default function HowItWorks() {
  return <section className="section how-section"><div className="container">
    <div className="section-heading center"><span className="eyebrow">HOW IT WORKS</span><h2>From search to <span>solved.</span></h2></div>
    <div className="steps">{steps.map(([n,t,d],i)=><div className="step" key={n}><div className="step-number">{n}</div><div><h3>{t}</h3><p>{d}</p></div>{i<2 && <div className="step-line" />}</div>)}</div>
  </div></section>;
}