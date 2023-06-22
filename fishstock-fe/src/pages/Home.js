import React, { useState, useEffect } from 'react';
import CandlestickChart from '../components/CandlestickChart';
import axios from 'axios';
import moment from 'moment';

const Home = () => {
  const [stockInfo, setStockInfo] = useState();
  const [stockPrice, setStockPrice] = useState([]);
  const currentDate = moment().format('YYYY-MM-DD');
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/finmind/home?stockNo=TAIEX&endDate=${currentDate}`
        );
        setStockInfo(res.data.TaiwanStockInfo);
        setStockPrice(res.data.TaiwanStockPrice);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="pt-5">
      <div className="container">
        {stockInfo && (
          <div className="row">
            <div className="col-12">
              {stockInfo && stockInfo.data && stockInfo.data.length > 0 && (
                <h1 className="text-center">
                  {stockInfo.data[0].stock_id}
                  {stockInfo.data[0].stock_name}
                </h1>
              )}
              <div>
                {stockPrice.data && <CandlestickChart data={stockPrice.data} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
