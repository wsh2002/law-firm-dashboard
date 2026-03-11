import React from 'react';
import ReactECharts from 'echarts-for-react';

function LocationChart({ data }) {
  const sortedData = [...data].sort((a, b) => b.totalMeetings - a.totalMeetings);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const item = sortedData[params.dataIndex];
        return `${item.location}<br/>
                总约见: ${item.totalMeetings}<br/>
                已签约: ${item.signedCount}<br/>
                签约率: ${item.signRate}%`;
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: sortedData.map(item => item.location)
    },
    series: [
      {
        name: '地域分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: sortedData.map(item => ({
          value: item.totalMeetings,
          name: item.location
        }))
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

export default LocationChart;