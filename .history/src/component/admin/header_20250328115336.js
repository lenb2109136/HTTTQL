// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <div className="title">Samsung Admin Dashboard</div>
      <div className="stats">
        <div>
          <h3>$1,920,829.00</h3>
          <p>Unassigned</p>
        </div>
        <div>
          <h3>$2,028,075.00</h3>
          <p>New</p>
        </div>
        <div>
          <h3>$1,961,444.00</h3>
          <p>Under Review</p>
        </div>
        <div>
          <h3>$1,519,843.00</h3>
          <p>Demo</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
