import React, { useState, useEffect } from 'react';
import CandlestickChart from '../components/CandlestickChart';
import ColumnChart from '../components/ColumnCharts';

const FinMind = ({ searchResult, isLoading, setIsLoading }) => {
  const [stockInfo, setStockInfo] = useState([]);
  const [stockPrice, setStockPrice] = useState([]);
  const [stockInvestors, setStockInvestors] = useState([]);
  const [stockNews, setStockNews] = useState([]);
  useEffect(() => {
    if (searchResult) {
      setStockInfo(searchResult.TaiwanStockInfo);
      setStockPrice(searchResult.TaiwanStockPrice);
      setStockInvestors(searchResult.TaiwanStockInstitutionalInvestorsBuySell);
      setStockNews(searchResult.TaiwanStockNews);
      setIsLoading(false);
    }
  }, [searchResult]);

  return (
    <div className="pt-5">
      <div className="container">
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-secondary" role="status"></div>
          </div>
        ) : stockInfo.data?.length === 0 ? (
          <div>請輸入正確的股票代碼</div>
        ) : (
          <div className="row">
            <div className=" col-9">
              {stockInfo && stockInfo.data && stockInfo.data.length > 0 && (
                <h1 className="text-center">
                  {stockInfo.data[0].stock_id}
                  {stockInfo.data[0].stock_name}
                </h1>
              )}
              <div>
                {stockPrice.data && <CandlestickChart data={stockPrice.data} />}
                {stockInvestors.data && (
                  <ColumnChart data={stockInvestors.data} />
                )}
              </div>
            </div>
            {stockNews.data && (
              <div className="col-3 list-group my-5">
                <h2>相關新聞</h2>
                <div className="overflow-auto vh-100">
                  {stockNews.data.reverse().map((v, i) => (
                    <div key={i}>
                      <a
                        href={v.link}
                        className="list-group-item list-group-item-action"
                        target="_blank"
                        rel="noopener noreferrer">
                        {v.title}
                        <div>{v.date}</div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FinMind;
