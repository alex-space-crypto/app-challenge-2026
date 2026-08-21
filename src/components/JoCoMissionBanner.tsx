import { CORE_VALUES } from '../joco';
import * as React from 'react';

const MISSION_QUOTE =
  'To provide visionary leadership and strategic guidance that promotes effective and efficient County government that seeks to enhance the quality of life for the present and future generations of the people of Johnston County in a fiscally responsible manner.';

export function JoCoMissionBanner() {
  const [showValues, setShowValues] = React.useState(false);
  return (
    <div className="joco-mission-banner">
      <p className="joco-mission-quote">
        <a className="joco-mission-link" href="https://www.johnstonnc.gov/content.cfm?id=2" target="_blank" rel="noopener noreferrer" title="Read the official mission statement">
          Johnston County Mission
        </a>
        &nbsp;&mdash;&nbsp;&ldquo;{MISSION_QUOTE}&rdquo;&nbsp;
        <button className="joco-values-inline-toggle" onClick={() => setShowValues(s => !s)}>
          {showValues ? 'Hide core values' : 'See core values'}
        </button>
      </p>
      {showValues && (
        <div className="joco-values-grid">
          {CORE_VALUES.map(v => (
            <div key={v.title} className="joco-value-card">
              <span className="joco-value-icon">{v.icon}</span>
              <div>
                <span className="joco-value-title">{v.title}</span>
                <p className="joco-value-blurb">{v.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
