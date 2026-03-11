import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import OverviewCards from './OverviewCards';
import LawyerRanking from './LawyerRanking';
import LocationChart from './LocationChart';
import TrendChart from './TrendChart';
import MeetingTypeChart from './MeetingTypeChart';
import PersonRanking from './PersonRanking';
import BottomPerformers from './BottomPerformers';
import TargetProgress from './TargetProgress';
import TeamCollaboration from './TeamCollaboration';
import TimeAnalysis from './TimeAnalysis';
import CaseTypeAnalysis from './CaseTypeAnalysis';
import FollowUpManager from './FollowUpManager';
import TodayReport from './TodayReport';
import ExportTools from './ExportTools';
import { processData } from '../utils/dataProcessor';
import { readExcelFile } from '../utils/excelReader';
import rawData from '../data/meetingData';

function Dashboard() {
  const [data, setData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [monthlyTarget, setMonthlyTarget] = useState(50);

  useEffect(() => {
    const processed = processData(rawData);
    setData(processed);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const excelData = await readExcelFile(file);
      const processed = processData(excelData);
      setData(processed);
    } catch (error) {
      alert('读取 Excel 文件失败，请确保文件格式正确');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!data) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>律所约见数据分析看板</h1>
            <p className="subtitle">数据驱动决策，提升签约转化率</p>
          </div>
          <div className="upload-section">
            <div className="target-input">
              <label>月度目标：</label>
              <input 
                type="number" 
                value={monthlyTarget} 
                onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                min="1"
              />
              <span>单</span>
            </div>
            <ExportTools data={data} />
            <label htmlFor="file-upload" className="upload-button">
              📁 上传 Excel 文件
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            {isUploading && <span className="uploading-text">读取中...</span>}
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <OverviewCards data={data.overview} />
        
        {/* 今日战报和客户跟进 */}
        <div className="top-section">
          <div className="section-item">
            <TodayReport data={data.todayReport} />
          </div>
          <div className="section-item">
            <FollowUpManager data={data.followUpList} />
          </div>
        </div>
        
        {/* 签约目标进度 */}
        <div className="chart-card full-width highlight-card">
          <h3>🎯 本月签约目标达成情况</h3>
          <TargetProgress 
            current={data.overview.currentMonthSigned} 
            target={monthlyTarget}
            trend={data.targetTrend}
          />
        </div>

        {/* 团队协作分析 */}
        <div className="chart-card full-width">
          <h3>🤝 团队协作效率分析</h3>
          <TeamCollaboration data={data.collaborationStats} />
        </div>

        <div className="charts-grid">
          {/* 时间段分析 */}
          <div className="chart-card">
            <h3>⏰ 约见时间段效果分析</h3>
            <TimeAnalysis data={data.timeStats} />
          </div>

          {/* 案件类型分析 */}
          <div className="chart-card">
            <h3>📋 案件类型签约率分析</h3>
            <CaseTypeAnalysis data={data.caseTypeStats} />
          </div>

          <div className="chart-card">
            <h3>邀约人业绩排行</h3>
            <PersonRanking data={data.inviterStats} type="邀约人" />
          </div>

          <div className="chart-card">
            <h3>谈案人员业绩排行</h3>
            <PersonRanking data={data.negotiatorStats} type="谈案人员" />
          </div>

          <div className="chart-card">
            <h3>实际约见人业绩排行</h3>
            <PersonRanking data={data.actualPersonStats} type="实际约见人" />
          </div>

          <div className="chart-card">
            <h3>约见律师业绩排行</h3>
            <LawyerRanking data={data.lawyerStats} />
          </div>

          <div className="chart-card">
            <h3>地域分布分析（TOP 10）</h3>
            <LocationChart data={data.locationStats} />
          </div>

          <div className="chart-card">
            <h3>约见方式效果对比</h3>
            <MeetingTypeChart data={data.meetingTypeStats} />
          </div>

          <div className="chart-card full-width">
            <h3>月度趋势分析</h3>
            <TrendChart data={data.monthlyTrend} />
          </div>

          <div className="chart-card full-width warning-card">
            <h3>⚠️ 签约率低于平均水平人员</h3>
            <BottomPerformers data={data.bottomPerformers} avgRate={data.overview.signRate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;