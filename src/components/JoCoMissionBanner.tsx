export function JoCoMissionBanner() {
  return (
    <div className="joco-mission-banner">
      <div className="joco-weekly-updates">
        <a
          className="joco-weekly-title"
          href="https://knott.house.gov/media"
          target="_blank"
          rel="noopener noreferrer"
          title="Read the latest from Congressman Brad Knott"
        >
          Weekly Updates from JoCo District 13
        </a>
        <a
          className="joco-media-link"
          href="https://knott.house.gov/media"
          target="_blank"
          rel="noopener noreferrer"
          title="Read the latest from Congressman Brad Knott"
        >
          Media | Congressman Brad Knott
        </a>
        <ul className="joco-updates-list">
          <li className="joco-update-item">
            <span className="joco-update-bullet">Updates from Washington</span>
            <p className="joco-update-text">Signed Vice President's pledge to protect Americans from fraud.</p>
          </li>
          <li className="joco-update-item">
            <span className="joco-update-bullet">Celebrating Johnston County</span>
            <p className="joco-update-text">Congratulating the Johnston County Little League softball team in Archer Lodge!</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
