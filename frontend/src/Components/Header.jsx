import React, { useState } from "react";
import "../css/Header.scss";
import logo from "../assets/img/Ambienti-Moderne-NoBG.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Implement login logic
    //setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img
            src={logo}
            alt="KBZ Development Inc."
            className="header__logo-image"
          />
          <div className="header__title">
            <h1>Warehouse</h1>
            <h2>Inventory</h2>
          </div>
        </div>

        <nav className="header__nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/3d-view">3D View</a>
            </li>
            <li>
              <a href="/inventory">Inventory</a>
            </li>

            <li>
              <a href="/search">Search</a>
            </li>
            <li>
              <a href="/add">Add</a>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          {!isLoggedIn ? (
            <>
              <Link>
              <button className="header__login-btn" onClick={handleLogin}>
                Login
              </button></Link>
              <Link to="/signup">
              <button className="header__signup-btn" onClick={handleLogin}>
                Signup
              </button>
              </Link>
              
            </>
          ) : (
            <div className="header__user-profile">
              <span>Welcome, User</span>
              <button className="header__logout-btn" onClick={handleLogin}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
