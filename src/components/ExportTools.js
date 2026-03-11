import React, { useState } from 'react';
import './ExportTools.css';

function ExportTools({ data }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert('PDF 导出功能需要安装 jsPDF 库。\n\n运行命令：npm install jspdf jspdf-autotable\n\n然后我会帮你实现完整的 PDF 导出功能。');
      setIsExporting(false);
    }, 500);
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    // 准备导出数据
    const exportData = [
      ['数据分析报表', '', '', '', ''],
      ['导出时间：' + new Date().toLocaleString(), '', '', '', ''],
      ['', '', '', '', ''],
      ['概览数据', '', '', '', ''],
      ['总约见数', data.overview.totalMeetings, '已签约', data.overview.signedCount, '签约率 ' + data.overview.signRate + '%'],
      ['', '', '', '', ''],
      ['律师业绩排行', '', '', '', ''],
      ['姓名', '总约见', '已签约', '签约率', ''],
      ...data.lawyerStats.slice(0, 10).map(lawyer => [
        lawyer.name,
        lawyer.totalMeetings,
        lawyer.signedCount,
        lawyer.signRate + '%',
        ''
      ]),
      ['', '', '', '', ''],
      ['地域分布 TOP 10', '', '', '', ''],
      ['地域', '总约见', '已签约', '签约率', ''],
      ...data.locationStats.map(loc => [
        loc.location,
        loc.totalMeetings,
        loc.signedCount,
        loc.signRate + '%',
        ''
      ])
    ];

    const csvContent = exportData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `律所数据分析_${new Date().toLocaleDateString()}.csv`;
    link.click();
    
    setIsExporting(false);
  };

  const generateReport = (type) => {
    setIsExporting(true);
    
    const reportData = [
      [type === 'week' ? '周报' : '月报', '', '', ''],
      ['报告时间：' + new Date().toLocaleString(), '', '', ''],
      ['', '', '', ''],
      ['核心指标', '', '', ''],
      ['总约见数', data.overview.totalMeetings, '', ''],
      ['已签约数', data.overview.signedCount, '', ''],
      ['签约率', data.overview.signRate + '%', '', ''],
      ['', '', '', ''],
      ['TOP 5 律师', '', '', ''],
      ['排名', '姓名', '签约数', '签约率'],
      ...data.lawyerStats.slice(0, 5).map((lawyer, index) => [
        index + 1,
        lawyer.name,
        lawyer.signedCount,
        lawyer.signRate + '%'
      ])
    ];

    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type === 'week' ? '周报' : '月报'}_${new Date().toLocaleDateString()}.csv`;
    link.click();
    
    setIsExporting(false);
  };

  return (
    <div className="export-tools">
      <button className="export-btn pdf" onClick={exportToPDF} disabled={isExporting}>
        {isExporting ? '导出中...' : '📄 导出 PDF'}
      </button>
      <button className="export-btn excel" onClick={exportToExcel} disabled={isExporting}>
        {isExporting ? '导出中...' : '📊 导出 Excel'}
      </button>
      <button className="export-btn report" onClick={() => generateReport('week')} disabled={isExporting}>
        {isExporting ? '生成中...' : '📝 生成周报'}
      </button>
      <button className="export-btn report" onClick={() => generateReport('month')} disabled={isExporting}>
        {isExporting ? '生成中...' : '📅 生成月报'}
      </button>
    </div>
  );
}

export default ExportTools;