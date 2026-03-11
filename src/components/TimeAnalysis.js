import React from 'react';
import ReactECharts from 'echarts-for-react';

function TimeAnalysis({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>暂无时间数据</div>;
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['约见数', '签约率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.period)
    },
    yAxis: [
      {
        type: 'value',
        name: '约见数',
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
        name: '约见数',
        type: 'bar',
        data: data.map(item => item.totalMeetings),
        itemStyle: { color: '#667eea' }
      },
      {
        name: '签约率',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.signRate),
        itemStyle: { color: '#48bb78' },
        lineStyle: { width: 3 },
        label: {
          show: true,
          formatter: '{c}%'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

export default TimeAnalysis;