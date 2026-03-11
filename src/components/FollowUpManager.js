import React, { useState } from 'react';
import './FollowUpManager.css';

function FollowUpManager({ data }) {
  const [showDetail, setShowDetail] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="followup-card">
        <div className="followup-header">
          <h3>📋 待跟进客户</h3>
          <span className="followup-count success">0</span>
        </div>
        <p className="no-followup">🎉 暂无需跟进客户</p>
      </div>
    );
  }

  const urgentCount = data.filter(item => item.daysElapsed >= 7).length;
  const normalCount = data.filter(item => item.daysElapsed < 7).length;

  const exportFollowUp = () => {
    const csvContent = [
      ['客户信息', '约见日期', '约见律师', '案件类型', '距今天数', '优先级'],
      ...data.map(item => [
        item.location || '-',
        item.date,
        item.lawyer,
        item.caseType || '-',
        `${item.daysElapsed}天`,
        item.daysElapsed >= 7 ? '紧急' : '正常'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `待跟进客户_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  return (
    <div className="followup-card">
      <div className="followup-header">
        <h3>📋 待跟进客户</h3>
        <span className="followup-count">{data.length}</span>
      </div>
      
      <div className="followup-summary">
        <div className="summary-item urgent">
          <span className="summary-label">紧急（≥7天）</span>
          <span className="summary-value">{urgentCount}</span>
        </div>
        <div className="summary-item normal">
          <span className="summary-label">正常（少于7天）</span>
          <span className="summary-value">{normalCount}</span>
        </div>
      </div>

      <div className="followup-actions">
        <button className="btn-detail" onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? '收起列表' : '查看详情'}
        </button>
        <button className="btn-export" onClick={exportFollowUp}>
          导出清单
        </button>
      </div>

      {showDetail && (
        <div className="followup-list">
          <table>
            <thead>
              <tr>
                <th>客户地域</th>
                <th>约见日期</th>
                <th>约见律师</th>
                <th>案件类型</th>
                <th>距今天数</th>
                <th>优先级</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={item.daysElapsed >= 7 ? 'urgent-row' : ''}>
                  <td>{item.location || '-'}</td>
                  <td>{item.date}</td>
                  <td>{item.lawyer}</td>
                  <td>{item.caseType || '-'}</td>
                  <td>{item.daysElapsed}天</td>
                  <td>
                    <span className={`priority-badge ${item.daysElapsed >= 7 ? 'urgent' : 'normal'}`}>
                      {item.daysElapsed >= 7 ? '紧急' : '正常'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FollowUpManager;