import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState([]);
  const [user, setUser] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    photo: '',
  });

  function handleChange(e) {
    let newUser = { ...user };
    newUser[e.target.name] = e.target.value;
    setUser(newUser);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage([]);
    const newErrorMessage = [];
    // 前端驗證
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailPattern.test(user.email)) {
      newErrorMessage.push({ msg: '請輸入有效的 Email', path: 'email' });
    }
    if (!user.name) {
      newErrorMessage.push({ msg: '請輸入姓名', path: 'name' });
    }
    if (user.password.length < 6) {
      newErrorMessage.push({
        msg: '密碼長度至少為 6 個字元',
        path: 'password',
      });
    }
    if (user.password !== user.confirmPassword) {
      newErrorMessage.push({
        msg: '確認密碼與密碼不符',
        path: 'confirmPassword',
      });
    }
    setErrorMessage(newErrorMessage);

    if (newErrorMessage.length === 0) {
      try {
        await axios.post('http://localhost:5000/auth/register', user);
        navigate('/login');
      } catch (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          console.error(error);
        }
      }
    }
  }

  const findErrorMessage = (v) => {
    const error = errorMessage.find((errorMessage) => errorMessage.path === v);
    return error ? error.msg : '';
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="container d-flex justify-content-center">
      <form
        className="bg-purple-100 rounded-1 row g-3 mt-5 p-4 shadow-sm col-12 col-lg-6"
        onSubmit={handleSubmit}>
        <div className="col-12">
          <h2 className="text-center border-bottom border-2 border-gray pb-2">
            註冊帳戶
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
          <label htmlFor="name" className="form-label">
            姓名
          </label>
          <input
            className="form-control"
            type="text"
            id="name"
            name="name"
            placeholder="輸入姓名..."
            value={user.name}
            onChange={handleChange}
          />
          <div className="text-danger">{findErrorMessage('name')}</div>
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
        <div className="col-12">
          <label htmlFor="password" className="form-label">
            確認密碼
          </label>
          <input
            className="form-control"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="輸入確認密碼..."
            value={user.confirmPassword}
            onChange={handleChange}
          />
          <div className="text-danger">
            {findErrorMessage('confirmPassword')}
          </div>
        </div>
        <div className="col-12 py-4">
          <button className="btn btn-indigo-300 w-100" type="submit">
            註冊
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
            已有帳號?
            <Link
              to="/login"
              className="text-decoration-none text-secondary ps-2"
              activestyle={{ fontWeight: 'bold', color: '#3B82F6' }}>
              登入
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
