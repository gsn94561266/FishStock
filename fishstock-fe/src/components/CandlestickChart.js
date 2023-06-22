import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import Indicators from 'highcharts/indicators/indicators';
import EMA from 'highcharts/indicators/ema';
import Exporting from 'highcharts/modules/exporting';

import moment from 'moment';

Indicators(Highcharts);
EMA(Highcharts);
Exporting(Highcharts);

const CandlestickChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      Highcharts.stockChart(chartRef.current, {
        chart: {
          height: 600,
        },
        title: {
          text: '',
        },
        yAxis: [
          {
            height: '80%',
            resize: {
              enabled: true,
            },
          },
          {
            title: {
              text: ' ',
            },
            top: '75%',
            height: '25%',
            offset: 0,
          },
        ],
        xAxis: [
          {
            type: 'datetime',
          },
        ],
        rangeSelector: {
          selected: 1,
        },
        series: [
          {
            type: 'candlestick',
            name: '股價',
            id: 'aapl',
            data: data.map((stock) => [
              moment(stock.date).valueOf(),
              stock.open,
              stock.max,
              stock.min,
              stock.close,
            ]),
            color: '#36BF36',
            upColor: '#E32636',
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            name: '5MA',
            params: {
              period: 5,
            },
            marker: {
              enabled: false,
            },
            color: '#FFA500',
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            name: '10MA',
            params: {
              period: 10,
            },
            marker: {
              enabled: false,
            },
            color: '#00EBEB',
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            name: '20MA',
            params: {
              period: 20,
            },
            marker: {
              enabled: false,
            },
            color: '#7600CC',
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            name: '60MA',
            params: {
              period: 60,
            },
            marker: {
              enabled: false,
            },
            color: '#FF1493',
          },
          {
            type: 'column',
            name: 'Volume',
            data: data.map((stock) => [
              moment(stock.date).valueOf(),
              stock.Trading_Volume,
            ]),
            color: '#004D99',
            yAxis: 1,
          },
        ],
      });
    }
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default CandlestickChart;
