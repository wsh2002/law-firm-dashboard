import React from 'react';
import ReactECharts from 'echarts-for-react';

function MeetingTypeChart({ data }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['总约见数', '签约数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.type)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '总约见数',
        type: 'bar',
        data: data.map(item => item.totalMeetings),
        itemStyle: { color: '#667eea' }
      },
      {
        name: '签约数',
        type: 'bar',
        data: data.map(item => item.signedCount),
        itemStyle: { color: '#48bb78' },
        label: {
          show: true,
          position: 'top',
          formatter: function(params) {
            const item = data[params.dataIndex];
            return `${item.signRate}%`;
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}

export default MeetingTypeChart;