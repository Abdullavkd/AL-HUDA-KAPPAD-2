import React from 'react';
import { Quote } from 'lucide-react';
import Container from '../common/Container';

export default function MissionVision({ mission = {}, vision = {} }) {
  return (
    <section className="mission-section">
      <Container>
        <div className="mission-intro"><span className="section-heading__eyebrow">OUR DIRECTION</span><h2>A clear purpose.<br /><em>A lasting impact.</em></h2></div>
        <div className="mission-grid">
          <article><span className="mission-label">01 · MISSION</span><h3>{mission.title || 'Education with purpose.'}</h3><p>{mission.text || 'To create opportunities for education, personal growth, care and meaningful service.'}</p></article>
          <article><span className="mission-label">02 · VISION</span><h3>{vision.title || 'A stronger future for every learner.'}</h3><p>{vision.text || 'To build institutions that positively shape individuals, families and the wider community.'}</p></article>
          <div className="mission-quote"><Quote size={28} /><p>“The future is built by the values we nurture today.”</p><small>Al Huda Trust</small></div>
        </div>
      </Container>
    </section>
  );
}
