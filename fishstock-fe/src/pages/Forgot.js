import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Forgot = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  function handleChange(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage([]);
    try {
      const response = await axios.post(
        'http://localhost:5000/auth/forgot-password',
        { email },
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message[0].msg);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message[0].msg);
      } else {
        console.error(error);
      }
    }
  }

  return (
    <div className="container d-flex justify-content-center">
      <form
        className="bg-purple-100 rounded-1 row g-3 mt-5 mx-2 p-4 shadow-sm col-12 col-lg-6"
        onSubmit={handleLogin}>
        <div className="col-12">
          <h2 className="text-center border-bottom border-2 border-gray pb-2">
            忘記密碼
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
            value={email}
            onChange={handleChange}
          />
          <div className="text-danger">{message}</div>
        </div>
        <div className="col-12 pt-3">
          <button className="btn btn-indigo-300 w-100" type="submit">
            送出
          </button>
          <div className="text-center py-4">
            <Link
              to="/login"
              className="text-decoration-none text-secondary"
              activestyle={{ fontWeight: 'bold', color: '#3B82F6' }}>
              返回
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Forgot;
