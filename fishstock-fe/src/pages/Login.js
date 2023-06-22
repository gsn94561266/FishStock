import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../hooks/checkAuth';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState([]);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  function handleChange(e) {
    e.preventDefault();
    let newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage([]);
    try {
      await axios.post('http://localhost:5000/auth/login', user, {
        withCredentials: true,
      });
      checkAuth(setAuth);
      navigate('../');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error(error);
      }
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const findErrorMessage = (v) => {
    const error = errorMessage.find((errorMessage) => errorMessage.path === v);
    return error ? error.msg : '';
  };

  return (
    <div className="container d-flex justify-content-center">
      <form
        className="bg-purple-100 rounded-1 row g-3 mt-5 mx-2 p-4 shadow-sm col-12 col-lg-6"
        onSubmit={handleLogin}>
        <div className="col-12">
          <h2 className="text-center border-bottom border-2 border-gray pb-2">
            登入帳戶
          </h2>
        </div>
        <div className="col-12">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            className="form-control"
            type="text"
            id="email"
            name="email"
            placeholder="輸入 email..."
            value={user.email}
            onChange={handleChange}
          />
          <div className="text-danger">{findErrorMessage('email')}</div>
        </div>
        <div className="col-12">
          <label htmlFor="password" className="form-label">
            密碼
          </label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            placeholder="輸入密碼..."
            value={user.password}
            onChange={handleChange}
          />
          <div className="text-danger">{findErrorMessage('password')}</div>
        </div>
        <Link to={'/forgot'} className="text-decoration-none text-secondary">
          忘記密碼?
        </Link>
        <div className="col-12 pb-4">
          <button className="btn btn-indigo-300 w-100" type="submit">
            登入
          </button>
          <button
            className="btn btn-light w-100 mt-4"
            type="button"
            onClick={handleGoogleLogin}>
            <img
              src={process.env.PUBLIC_URL + '/images/Google-Icon.png'}
              className="mx-2"
              width="20"
              alt="Google"
            />
            使用 Google 登入
          </button>
          <div className="text-center pt-4">
            沒有帳號?
            <Link
              to="/register"
              className="text-decoration-none text-secondary ps-2"
              activestyle={{ fontWeight: 'bold', color: '#3B82F6' }}>
              註冊
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
