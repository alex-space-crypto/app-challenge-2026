import * as React from 'react';

export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <div className="level-info-overlay" onClick={onClose}>
      <div className="level-info-modal" onClick={e => e.stopPropagation()}>
        <button className="welcome-skip" onClick={onClose}>Close ✕</button>
        <div className="level-info-hero">
          <span className="level-info-big-title">Privacy Policy</span>
        </div>

        <div className="privacy-policy-content">
          <h4>Your data stays on your device</h4>
          <p>
            Thrive JoCo 13 stores your goals, logs, badges, and community posts locally in your browser.
            Your habit data is not uploaded to any server unless you create an account.
          </p>

          <h4>Verification records</h4>
          <p>
            Each log includes the verifier's name, location, date, and time. This information stays on your device.
            Self-verification is blocked — a parent, teacher, or friend must confirm your activity.
          </p>

          <h4>Private locations</h4>
          <p>
            You can mark any goal's location as private. Private locations are hidden from the map and never shared.
            We recommend this for goals at home or other personal places.
          </p>

          <h4>Community posts</h4>
          <p>
            Posts to the District 13 community board are visible to other users. Your display name (not your real name
            unless you choose) is shown with your posts. You can delete your posts at any time. You can report
            inappropriate posts for moderator review.
          </p>

          <h4>Safety for minors</h4>
          <p>
            If you are under 13, ask a parent or guardian before using this app. Do not share your home address,
            school name, or other identifying information in community posts. Use a nickname as your display name.
          </p>

          <h4>Help board</h4>
          <p>
            Posts to the Help Board (requests and offers) are stored securely and visible to neighbors who can help.
            Volunteer counts are tracked to show community progress.
          </p>

          <h4>No tracking or ads</h4>
          <p>
            Thrive JoCo 13 does not use tracking pixels, advertising cookies, or third-party analytics.
            We do not sell your data. This app was built for the Congressional App Challenge to serve Johnston County.
          </p>
        </div>

        <button className="btn-primary" onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
}
