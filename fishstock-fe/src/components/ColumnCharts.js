import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ColumnChart = ({ data }) => {
  const consolidatedData = [];

  data.forEach((entry) => {
    const { date, name, buy, sell } = entry;

    const existingEntry = consolidatedData.find((item) => item.date === date);
    if (existingEntry) {
      existingEntry[name] = (existingEntry[name] || 0) + (buy - sell);
    } else {
      const newEntry = { date };
      newEntry[name] = buy - sell;
      consolidatedData.push(newEntry);
    }
  });

  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: '三大法人買賣超',
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    xAxis: [
      {
        type: 'datetime',
        labels: {
          formatter: function () {
            return Highcharts.dateFormat('%d %b', this.value);
          },
        },
      },
    ],
    series: [
      {
        name: '外資',
        data: consolidatedData.map((v) => [
          new Date(v.date).getTime(),
          v.Foreign_Investor / 1000,
        ]),
      },
      {
        name: '投信',
        data: consolidatedData.map((v) => [
          new Date(v.date).getTime(),
          v.Investment_Trust / 1000,
        ]),
      },
      {
        name: '自營商',
        data: consolidatedData.map((v) => [
          new Date(v.date).getTime(),
          v.Dealer_self / 1000,
        ]),
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ColumnChart;
