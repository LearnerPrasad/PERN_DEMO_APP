import { useState } from 'react';

type NavbarProps = {
  onLogout: () => void;
};

export default function Navbar({ onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-brand">Contact Manager</div>

      <div className="profile-menu">
        <button
          type="button"
          className="profile-button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span className="profile-avatar" aria-hidden="true">
            P
          </span>
          <span>My Account</span>
          <span aria-hidden="true">▾</span>
        </button>

        {menuOpen && (
          <div className="profile-dropdown">
            <button
              type="button"
              onClick={() => {
                setShowProfile(true);
                setMenuOpen(false);
              }}
            >
              View Profile
            </button>

            <button
              type="button"
              className="logout-option"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {showProfile && (
        <div
          className="modal-backdrop"
          onClick={() => setShowProfile(false)}
        >
          <section
            className="profile-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close profile"
              onClick={() => setShowProfile(false)}
            >
              ×
            </button>

            <h2 id="profile-title">My Profile</h2>
            <p>Your account details will appear here once connected to your profile API.</p>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowProfile(false)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </header>
  );
}
