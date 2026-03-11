import React from 'react';
import ReactECharts from 'echarts-for-react';

function PersonRanking({ data, type }) {
  const sortedData = [...data].sort((a, b) => b.signedCount - a.signedCount).slice(0, 10);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const item = params[0];
        const person = sortedData[item.dataIndex];
        return `${person.name}<br/>
                签约数: ${person.signedCount}<br/>
                总约见: ${person.totalMeetings}<br/>
                签约率: ${person.signRate}%`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '签约数'
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.name),
      inverse: true
    },
    series: [
      {
        name: '签约数',
        type: 'bar',
        data: sortedData.map(item => ({
          value: item.signedCount,
          itemStyle: {
            color: item.signRate >= 50 ? '#48bb78' : 
                   item.signRate >= 30 ? '#ed8936' : 
                   item.signRate >= 10 ? '#cbd5e0' : '#fc8181'
          }
        })),
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            const item = sortedData[params.dataIndex];
            return `${params.value} (${item.signRate}%)`;
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

export default PersonRanking;