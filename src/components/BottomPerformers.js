import React from 'react';
import './BottomPerformers.css';

function BottomPerformers({ data, avgRate }) {
  if (!data || data.length === 0) {
    return <div className="no-data">🎉 所有人员表现都不错！</div>;
  }

  return (
    <div className="bottom-performers">
      <div className="avg-info">
        平均签约率: <strong>{avgRate}%</strong>
      </div>
      <div className="performers-table">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>角色</th>
              <th>总约见</th>
              <th>已签约</th>
              <th>签约率</th>
              <th>低于平均</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person, index) => (
              <tr key={index}>
                <td className="name-cell">{person.name}</td>
                <td className="role-cell">{person.role}</td>
                <td>{person.totalMeetings}</td>
                <td>{person.signedCount}</td>
                <td className="rate-cell warning">{person.signRate}%</td>
                <td className="gap-cell">{(avgRate - person.signRate).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BottomPerformers;