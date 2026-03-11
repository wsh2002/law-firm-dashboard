import React from 'react';
import './TodayReport.css';

function TodayReport({ data }) {
  const { today, yesterday, comparison } = data;

  return (
    <div className="today-report">
      <div className="report-header">
        <h3>📊 今日战报</h3>
        <span className="report-date">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="report-grid">
        <div className="report-item">
          <div className="report-label">今日约见</div>
          <div className="report-value">{today.meetings}</div>
          <div className={`report-change ${comparison.meetings >= 0 ? 'positive' : 'negative'}`}>
            {comparison.meetings >= 0 ? '↑' : '↓'} {Math.abs(comparison.meetings)} 
            <span className="vs-text">vs 昨日</span>
          </div>
        </div>

        <div className="report-item">
          <div className="report-label">今日签约</div>
          <div className="report-value highlight">{today.signed}</div>
          <div className={`report-change ${comparison.signed >= 0 ? 'positive' : 'negative'}`}>
            {comparison.signed >= 0 ? '↑' : '↓'} {Math.abs(comparison.signed)}
            <span className="vs-text">vs 昨日</span>
          </div>
        </div>

        <div className="report-item">
          <div className="report-label">今日签约率</div>
          <div className="report-value">{today.signRate}%</div>
          <div className={`report-change ${comparison.signRate >= 0 ? 'positive' : 'negative'}`}>
            {comparison.signRate >= 0 ? '↑' : '↓'} {Math.abs(comparison.signRate).toFixed(1)}%
            <span className="vs-text">vs 昨日</span>
          </div>
        </div>

        <div className="report-item">
          <div className="report-label">本周累计签约</div>
          <div className="report-value">{data.weekTotal}</div>
          <div className="report-progress">
            <div className="progress-text">本周进度</div>
          </div>
        </div>
      </div>

      {data.topPerformer && (
        <div className="today-mvp">
          <span className="mvp-icon">🏆</span>
          <span className="mvp-text">今日MVP：</span>
          <span className="mvp-name">{data.topPerformer.name}</span>
          <span className="mvp-stat">签约 {data.topPerformer.signed} 单</span>
        </div>
      )}
    </div>
  );
}

export default TodayReport;