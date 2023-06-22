import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { checkAuth } from '../hooks/checkAuth';
import axios from 'axios';

const Navbar = ({ onSearch, setIsLoading }) => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [stockNumber, setStockNumber] = useState('2330');

  const handleSearchClick = (e) => {
    e.preventDefault();
    onSearch(stockNumber);
    navigate('stock');
    setIsLoading(true);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true,
      });
      checkAuth(setAuth);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <nav className="bg-indigo-100 py-2 px-5 d-flex justify-content-between align-items-center shadow-sm">
      <Link to="/" className="text-decoration-none">
        <div className="d-flex align-items-center">
          <img
            src={process.env.PUBLIC_URL + '/images/fish.png'}
            width="50"
            alt="Logo"
          />
          <span className="text-secondary fs-4 mx-3">魚股市</span>
        </div>
      </Link>

      <div className="d-flex align-items-center">
        <NavLink
          to="/"
          className="text-decoration-none py-2 px-3 mx-3 text-secondary fs-5">
          首頁
        </NavLink>
        <NavLink
          to="stock"
          className="text-decoration-none py-2 px-3 mx-3 text-secondary fs-5">
          個股
        </NavLink>
        <NavLink
          to="picking"
          className="text-decoration-none py-2 px-3 mx-3 text-secondary fs-5">
          選股
        </NavLink>
        <NavLink
          to="recording"
          className="text-decoration-none py-2 px-3 mx-3 text-secondary fs-5">
          日誌
        </NavLink>

        <form className="row mx-5" onSubmit={handleSearchClick}>
          <div className="col-auto p-0">
            <label className="visually-hidden">股票代碼</label>
            <input
              type="text"
              className="form-control fs-5"
              placeholder="股票代碼"
              value={stockNumber}
              onChange={(e) => {
                setStockNumber(e.target.value);
              }}
            />
          </div>
          <div className="col-auto p-0">
            <button
              type="submit"
              className="btn btn-indigo-200 fs-5 text-secondary">
              搜尋
            </button>
          </div>
        </form>
        {auth.isAuth && (
          <>
            <span className="p-2">{auth.userName}</span>
            <form onSubmit={handleLogout}>
              <button
                className="btn btn-outline-indigo-100 text-decoration-none  text-secondary fs-5"
                type="submit">
                登出
              </button>
            </form>
          </>
        )}
        {!auth.isAuth && (
          <>
            <NavLink
              to="/login"
              className="text-decoration-none p-2 text-secondary fs-5"
              activestyle={{ fontWeight: 'bold', color: '#3B82F6' }}>
              登入
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
