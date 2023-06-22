import React, { useState } from 'react';
import axios from 'axios';
import CandlestickChart from '../components/CandlestickChart';

const TWSE = () => {
  const dataDefault = {
    data: [],
    stat: '',
    total: 0,
  };
  const [stocks, setStocks] = useState(dataDefault);
  const [stockNumber, setStockNumber] = useState('');
  const [submit, setSubmit] = useState(false);
  const currentYear = new Date().getFullYear() - 1911; // 取得民國今年的年份
  const currentMonth = new Date().getMonth() + 1; // 取得當前月份（月份從0開始，所以要加1）
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const formatDateString = `${
    parseInt(selectedYear) + 1911
  }${selectedMonth.padStart(2, '0')}01`;

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/twse?date=${formatDateString}&stockNo=${stockNumber}`
      );
      const data = res.data;
      setStocks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmit(true);
    fetchData();
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);

    setSelectedMonth('1');
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const yearOptions = Array.from(
    { length: currentYear - 99 + 1 },
    (_, index) => {
      const year = currentYear - index;
      return {
        value: year.toString(),
        label: `民國 ${year} 年`,
      };
    }
  );

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const month = (index + 1).toString();
    return {
      value: month,
      label: `${month} 月`,
    };
  });

  return (
    <div>
      <div className="m-auto w-75">
        <form className="row g-3 mt-5">
          <div className="col-auto">
            <label className="visually-hidden">年份</label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={handleYearChange}>
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <label className="visually-hidden">月份</label>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={handleMonthChange}>
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <label className="visually-hidden">股票代碼</label>
            <input
              type="text"
              className="form-control"
              placeholder="股票代碼"
              value={stockNumber}
              maxLength={4}
              onChange={(e) => {
                setStockNumber(e.target.value);
              }}
            />
          </div>
          <div className="col-auto">
            <button
              type="text"
              className="btn btn-primary"
              onClick={handleSubmit}>
              搜尋
            </button>
          </div>
        </form>
        <h1 className="fs-2 m-4 text-center">{stocks.title}</h1>
        {stocks.total !== 0 ? (
          <div>
            <table className="table table-striped-columns">
              <thead>
                <tr>
                  <th scope="col">日期</th>
                  <th scope="col">成交股數</th>
                  <th scope="col">成交金額</th>
                  <th scope="col">開盤價</th>
                  <th scope="col">最高價</th>
                  <th scope="col">最低價</th>

                  <th scope="col">收盤價</th>
                  <th scope="col">漲跌價差</th>
                  <th scope="col">成交筆數</th>
                </tr>
              </thead>
              <tbody>
                {stocks.data.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock[0]}</td>
                    <td>{stock[1]}</td>
                    <td>{stock[2]}</td>
                    <td>{stock[3]}</td>
                    <td>{stock[4]}</td>
                    <td>{stock[5]}</td>
                    <td>{stock[6]}</td>
                    <td>{stock[7]}</td>
                    <td>{stock[8]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <CandlestickChart data={stocks.data} />
              {/* <ColumnCharts data={stocks.data} /> */}
            </div>
          </div>
        ) : (
          submit && <h1 className="fs-2 m-5 text-center">{stocks.stat}</h1>
        )}
      </div>
    </div>
  );
};
export default TWSE;
