import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Reset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const [errorMessage, setErrorMessage] = useState([]);
  const [newPassword, setNewPassword] = useState({
    token,
    password: '',
    confirmPassword: '',
  });

  function handleChange(e) {
    e.preventDefault();
    let newObject = { ...newPassword };
    newObject[e.target.name] = e.target.value;
    setNewPassword(newObject);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage([]);
    try {
      await axios.post(
        'http://localhost:5000/auth/reset-password',
        newPassword,
        {
          withCredentials: true,
        }
      );
      navigate('../login');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error(error);
      }
    }
  }

  const findErrorMessage = (v) => {
    const error = errorMessage.find((errorMessage) => errorMessage.path === v);
    return error ? error.msg : '';
  };

  return (
    <div className="container d-flex justify-content-center">
      <form
        className="bg-purple-100 rounded-1 row g-3 mt-5 mx-2 p-4 shadow-sm col-12 col-lg-6"
        onSubmit={handleSubmit}>
        <div className="col-12">
          <h2 className="text-center border-bottom border-2 border-gray pb-2">
            重置密碼
          </h2>
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
            value={newPassword.password}
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
            value={newPassword.confirmPassword}
            onChange={handleChange}
          />
          <div className="text-danger">
            {findErrorMessage('confirmPassword')}
          </div>
        </div>
        <div className="text-danger">{findErrorMessage('resetMessage')}</div>
        <div className="col-12 pb-3">
          <button className="btn btn-indigo-300 w-100" type="submit">
            送出
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reset;
