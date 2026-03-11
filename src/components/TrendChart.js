import React from 'react';
import ReactECharts from 'echarts-for-react';

function TrendChart({ data }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['总约见数', '签约数', '签约率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.month)
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        position: 'left'
      },
      {
        type: 'value',
        name: '签约率(%)',
        position: 'right',
        max: 100
      }
    ],
    series: [
      {
        name: '总约见数',
        type: 'line',
        data: data.map(item => item.totalMeetings),
        smooth: true,
        itemStyle: { color: '#667eea' }
      },
      {
        name: '签约数',
        type: 'line',
        data: data.map(item => item.signedCount),
        smooth: true,
        itemStyle: { color: '#48bb78' }
      },
      {
        name: '签约率',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.signRate),
        smooth: true,
        itemStyle: { color: '#ed8936' }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

export default TrendChart;