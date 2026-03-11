import React from 'react';
import './OverviewCards.css';

function OverviewCards({ data }) {
  const cards = [
    {
      title: '总约见数',
      value: data.totalMeetings,
      icon: '📅',
      color: '#667eea'
    },
    {
      title: '已签约',
      value: data.signedCount,
      icon: '✅',
      color: '#48bb78'
    },
    {
      title: '签约率',
      value: `${data.signRate}%`,
      icon: '📊',
      color: '#ed8936'
    },
    {
      title: '本月约见',
      value: data.currentMonthMeetings,
      icon: '📈',
      color: '#9f7aea'
    }
  ];

  return (
    <div className="overview-cards">
      {cards.map((card, index) => (
        <div key={index} className="overview-card" style={{ borderTopColor: card.color }}>
          <div className="card-icon" style={{ background: `${card.color}20` }}>
            <span>{card.icon}</span>
          </div>
          <div className="card-content">
            <p className="card-title">{card.title}</p>
            <h2 className="card-value" style={{ color: card.color }}>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OverviewCards;