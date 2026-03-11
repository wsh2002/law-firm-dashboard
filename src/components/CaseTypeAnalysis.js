import React from 'react';
import ReactECharts from 'echarts-for-react';

function CaseTypeAnalysis({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>暂无案件类型数据</div>;
  }

  const sortedData = [...data].sort((a, b) => b.signRate - a.signRate);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const item = sortedData[params[0].dataIndex];
        return `${item.caseType}<br/>
                总约见: ${item.totalMeetings}<br/>
                已签约: ${item.signedCount}<br/>
                签约率: ${item.signRate}%`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => item.caseType),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
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
        data: sortedData.map(item => item.totalMeetings),
        itemStyle: { color: '#667eea' }
      },
      {
        name: '签约率',
        type: 'line',
        yAxisIndex: 1,
        data: sortedData.map(item => item.signRate),
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

export default CaseTypeAnalysis;