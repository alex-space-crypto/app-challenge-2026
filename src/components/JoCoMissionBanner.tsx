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
        <ul className="joco-updates-list">
          <li className="joco-update-item">
            <div className="joco-update-row">
              <span className="joco-update-icon">🏛️</span>
              <a
                className="joco-update-bullet-link"
                href="https://x.com/RepKnott/status/2110788709666922591"
                target="_blank"
                rel="noopener noreferrer"
                title="Read the full post on X"
              >
                Updates from Washington
              </a>
              <span className="joco-update-text-inline">Signed Vice President's pledge to protect Americans from fraud.</span>
            </div>
          </li>
          <li className="joco-update-item">
            <div className="joco-update-row">
              <span className="joco-update-icon">🏟️</span>
              <a
                className="joco-update-bullet-link"
                href="https://www.facebook.com/RepKnott/posts/it-was-my-honor-to-attend-the-archer-lodge-town-council-meeting-to-recognize-the/122181170612715800"
                target="_blank"
                rel="noopener noreferrer"
                title="Read the full post on Facebook"
              >
                Celebrating Johnston County
              </a>
              <span className="joco-update-text-inline">Congratulating the Johnston County Little League softball team in Archer Lodge!</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
