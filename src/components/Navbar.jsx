import React from 'react';
import { Link } from 'react-router-dom';
import farm from '../assets/farm.png'; // adjust if stored in public/

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={farm}
            alt="Farm Logo"
            width="40"
            height="40"
            className="d-inline-block align-top rounded-circle me-2"
          />
          <span className="fw-bold">Farm Records</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Cows</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chicken">Chicken</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/horticulture">Horticulture</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
