import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { AuthProvider } from './hooks/useAuth';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Stock from './pages/FinMind';
import Picking from './pages/Picking';
import Recording from './pages/Recording';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import NotFound from './pages/NotFound';

const App = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = moment().format('YYYY-MM-DD');

  const handleSearch = async (stockNumber) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/finmind?stockNo=${stockNumber}&endDate=${currentDate}`
      );
      setSearchResult(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/finmind?stockNo=2330&endDate=${currentDate}`
        );
        setSearchResult(res.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar onSearch={handleSearch} setIsLoading={setIsLoading} />
        <Routes>
          <Route
            path="/"
            exact
            element={<Home searchResult={searchResult} />}
          />
          <Route
            path="stock"
            exact
            element={
              <Stock
                searchResult={searchResult}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
          />
          <Route path="picking" element={<Picking />} />
          <Route path="recording" element={<Recording />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="reset" element={<Reset />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
