import React from 'react';
import './TargetProgress.css';

function TargetProgress({ current, target, trend }) {
  const progress = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);
  const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
  const dailyNeed = daysLeft > 0 ? (remaining / daysLeft).toFixed(1) : 0;
  
  const status = progress >= 100 ? 'completed' : progress >= 80 ? 'good' : progress >= 50 ? 'warning' : 'danger';
  
  return (
    <div className="target-progress">
      <div className="progress-overview">
        <div className="progress-stats">
          <div className="stat-box">
            <div className="stat-label">当前签约</div>
            <div className="stat-value">{current}单</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">目标</div>
            <div className="stat-value">{target}单</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">完成率</div>
            <div className={`stat-value ${status}`}>{progress.toFixed(1)}%</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">还需签约</div>
            <div className="stat-value">{remaining}单</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">剩余天数</div>
            <div className="stat-value">{daysLeft}天</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">日均需签</div>
            <div className="stat-value highlight">{dailyNeed}单</div>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className={`progress-fill ${status}`} style={{ width: `${progress}%` }}>
              <span className="progress-text">{progress.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {trend && (
          <div className="trend-prediction">
            <div className="prediction-box">
              <span className="prediction-label">📈 按当前趋势预测月底可完成：</span>
              <span className="prediction-value">{trend.predicted}单</span>
              <span className={`prediction-status ${trend.canComplete ? 'success' : 'fail'}`}>
                {trend.canComplete ? '✅ 可达成目标' : '⚠️ 需加速'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TargetProgress;