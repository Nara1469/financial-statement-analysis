import React from 'react';

function NavTabs({ currentPage, handlePageChange }) {
  return (
    <ul className="nav justify-content-end nav-tabs">
      <li className="nav-item">
        <a
          href="#profile"
          onClick={() => handlePageChange('Profile')}
          className={currentPage === 'Profile' ? 'nav-link active' : 'nav-link'}
        >
          Profile
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#summary"
          onClick={() => handlePageChange('Financial Summary')}

          className={currentPage === 'Financial Summary' ? 'nav-link active' : 'nav-link'}
        >
          Financial Summary
        </a>
      </li>
      <li className="nav-item">
        <a
          href="#statement"
          onClick={() => handlePageChange('Financial Statement')}
          className={currentPage === 'Financial Statement' ? 'nav-link active' : 'nav-link'}
        >
          Financial Statement
        </a>
      </li>
    </ul>
  );
}

export default NavTabs;
