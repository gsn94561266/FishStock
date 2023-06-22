const express = require('express');
const router = express();
const axios = require('axios');
// /finmind
router.get('/home', async (req, res, next) => {
  try {
    const stockNo = req.query.stockNo;
    const endDate = req.query.endDate;
    const apiKey = process.env.FINMIND_API_KEY;
    const datasets = [
      { dataset: 'TaiwanStockInfo', startDate: endDate, endDate: endDate },
      {
        dataset: 'TaiwanStockPrice',
        startDate: getStartDate(120),
        endDate: endDate,
      },
    ];

    const responseData = {};
    await Promise.all(
      datasets.map(async ({ dataset, startDate, endDate }) => {
        const { data } = await axios.get(
          'https://api.finmindtrade.com/api/v4/data',
          {
            params: {
              dataset: dataset,
              data_id: stockNo,
              start_date: startDate,
              end_date: endDate,
              token: apiKey,
            },
          }
        );
        responseData[dataset] = data;
      })
    );

    res.send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json('發生錯誤');
  }
});
router.get('/', async (req, res, next) => {
  try {
    const stockNo = req.query.stockNo;
    const endDate = req.query.endDate;
    const apiKey = process.env.FINMIND_API_KEY;
    const datasets = [
      { dataset: 'TaiwanStockInfo', startDate: endDate, endDate: endDate },
      {
        dataset: 'TaiwanStockPrice',
        startDate: getStartDate(120),
        endDate: endDate,
      },
      {
        dataset: 'TaiwanStockInstitutionalInvestorsBuySell',
        startDate: getStartDate(30),
        endDate: endDate,
      },
      {
        dataset: 'TaiwanStockNews',
        startDate: getStartDate(5),
        endDate: endDate,
      },
    ];

    const responseData = {};

    await Promise.all(
      datasets.map(async ({ dataset, startDate, endDate }) => {
        const { data } = await axios.get(
          'https://api.finmindtrade.com/api/v4/data',
          {
            params: {
              dataset: dataset,
              data_id: stockNo,
              start_date: startDate,
              end_date: endDate,
              token: apiKey,
            },
          }
        );
        responseData[dataset] = data;
      })
    );

    res.send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json('發生錯誤');
  }
});

const getStartDate = (daysAgo) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);
  return startDate.toISOString().split('T')[0];
};

module.exports = router;
