const express = require('express');
const router = express();
const axios = require('axios');
// /twse
router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date;
    const stockNo = req.query.stockNo;
    const response = await axios.get(
      `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=${date}&stockNo=${stockNo}&response=json&_=1686590132282`
    );
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
