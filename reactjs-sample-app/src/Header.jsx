import React, { memo } from "react";

const Header = memo(({ title, userInfo, onLogout, showUserInfo = true }) => {
  return (
    <div className="search-header">
      <h3>{title}</h3>
      {showUserInfo && userInfo && (
        <div className="user-info">
          <p>{userInfo.name}</p>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
