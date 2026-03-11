import React from 'react';
import ReactECharts from 'echarts-for-react';

function TeamCollaboration({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>暂无协作数据</div>;
  }

  // 取前10个最佳组合
  const topCollabs = [...data].sort((a, b) => b.signRate - a.signRate).slice(0, 10);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const item = topCollabs[params[0].dataIndex];
        return `${item.combination}<br/>
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
      type: 'value',
      name: '签约率(%)',
      max: 100
    },
    yAxis: {
      type: 'category',
      data: topCollabs.map(item => item.combination),
      inverse: true,
      axisLabel: {
        fontSize: 12,
        width: 150,
        overflow: 'truncate'
      }
    },
    series: [
      {
        name: '签约率',
        type: 'bar',
        data: topCollabs.map(item => ({
          value: item.signRate,
          itemStyle: {
            color: item.signRate >= 60 ? '#48bb78' : 
                   item.signRate >= 40 ? '#4299e1' : 
                   item.signRate >= 20 ? '#ed8936' : '#fc8181'
          }
        })),
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            const item = topCollabs[params.dataIndex];
            return `${params.value}% (${item.signedCount}/${item.totalMeetings})`;
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '500px' }} />;
}

export default TeamCollaboration;