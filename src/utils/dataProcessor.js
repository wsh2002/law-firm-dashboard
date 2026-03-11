export function processData(rawData) {
  const totalMeetings = rawData.length;
  const signedCount = rawData.filter(item => item.status === '已签约').length;
  const signRate = totalMeetings > 0 ? parseFloat(((signedCount / totalMeetings) * 100).toFixed(1)) : 0;
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const currentMonthData = rawData.filter(item => {
    if (!item.date) return false;
    const [year, month] = item.date.split('-');
    return parseInt(year) === currentYear && parseInt(month) === currentMonth;
  });
  
  const currentMonthMeetings = currentMonthData.length;
  const currentMonthSigned = currentMonthData.filter(item => item.status === '已签约').length;

  // 通用统计函数
  function calculatePersonStats(fieldName) {
    const personMap = {};
    rawData.forEach(item => {
      const name = item[fieldName];
      if (!name || name === '-') return;
      
      if (!personMap[name]) {
        personMap[name] = {
          name: name,
          totalMeetings: 0,
          signedCount: 0
        };
      }
      personMap[name].totalMeetings++;
      if (item.status === '已签约') {
        personMap[name].signedCount++;
      }
    });

    return Object.values(personMap)
      .map(person => ({
        ...person,
        signRate: person.totalMeetings > 0 
          ? parseFloat(((person.signedCount / person.totalMeetings) * 100).toFixed(1))
          : 0
      }))
      .filter(person => person.totalMeetings > 0);
  }

  const inviterStats = calculatePersonStats('inviter');
  const negotiatorStats = calculatePersonStats('negotiator');
  const actualPersonStats = calculatePersonStats('actualPerson');
  const lawyerStats = calculatePersonStats('lawyer');

  // 团队协作分析
  const collaborationMap = {};
  rawData.forEach(item => {
    if (!item.inviter || !item.lawyer || item.inviter === '-' || item.lawyer === '-') return;
    
    const key = `${item.inviter} → ${item.lawyer}`;
    if (!collaborationMap[key]) {
      collaborationMap[key] = {
        combination: key,
        totalMeetings: 0,
        signedCount: 0
      };
    }
    collaborationMap[key].totalMeetings++;
    if (item.status === '已签约') {
      collaborationMap[key].signedCount++;
    }
  });

  const collaborationStats = Object.values(collaborationMap)
    .map(collab => ({
      ...collab,
      signRate: collab.totalMeetings > 0 
        ? parseFloat(((collab.signedCount / collab.totalMeetings) * 100).toFixed(1))
        : 0
    }))
    .filter(collab => collab.totalMeetings >= 3);

  // 时间段分析
  const timeMap = {
    '工作日': { period: '工作日', totalMeetings: 0, signedCount: 0 },
    '周末': { period: '周末', totalMeetings: 0, signedCount: 0 }
  };

  rawData.forEach(item => {
    if (!item.date) return;
    const date = new Date(item.date);
    const day = date.getDay();
    const period = (day === 0 || day === 6) ? '周末' : '工作日';
    
    timeMap[period].totalMeetings++;
    if (item.status === '已签约') {
      timeMap[period].signedCount++;
    }
  });

  const timeStats = Object.values(timeMap)
    .map(time => ({
      ...time,
      signRate: time.totalMeetings > 0 
        ? parseFloat(((time.signedCount / time.totalMeetings) * 100).toFixed(1))
        : 0
    }))
    .filter(time => time.totalMeetings > 0);

  // 案件类型分析
  const caseTypeMap = {};
  rawData.forEach(item => {
    if (!item.caseType || item.caseType === '-') return;
    
    if (!caseTypeMap[item.caseType]) {
      caseTypeMap[item.caseType] = {
        caseType: item.caseType,
        totalMeetings: 0,
        signedCount: 0
      };
    }
    caseTypeMap[item.caseType].totalMeetings++;
    if (item.status === '已签约') {
      caseTypeMap[item.caseType].signedCount++;
    }
  });

  const caseTypeStats = Object.values(caseTypeMap)
    .map(type => ({
      ...type,
      signRate: type.totalMeetings > 0 
        ? parseFloat(((type.signedCount / type.totalMeetings) * 100).toFixed(1))
        : 0
    }))
    .filter(type => type.totalMeetings > 0);

  // 目标趋势预测
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const currentDay = new Date().getDate();
  const daysElapsed = currentDay;
  const daysRemaining = daysInMonth - currentDay;
  
  const dailyAverage = daysElapsed > 0 ? currentMonthSigned / daysElapsed : 0;
  const predictedTotal = Math.round(currentMonthSigned + (dailyAverage * daysRemaining));
  
  const targetTrend = {
    predicted: predictedTotal,
    dailyAverage: dailyAverage.toFixed(2),
    canComplete: false
  };

  // 地域统计
  const locationMap = {};
  rawData.forEach(item => {
    if (!item.location || item.location === '-') return;
    
    let province = item.location.split('/')[0] || item.location;
    if (province.includes('省')) {
      province = province.split('省')[0] + '省';
    } else if (province.includes('市')) {
      province = province.split('市')[0] + '市';
    }
    
    if (!locationMap[province]) {
      locationMap[province] = {
        location: province,
        totalMeetings: 0,
        signedCount: 0
      };
    }
    locationMap[province].totalMeetings++;
    if (item.status === '已签约') {
      locationMap[province].signedCount++;
    }
  });

  const locationStats = Object.values(locationMap)
    .map(loc => ({
      ...loc,
      signRate: loc.totalMeetings > 0 
        ? parseFloat(((loc.signedCount / loc.totalMeetings) * 100).toFixed(1))
        : 0
    }))
    .filter(loc => loc.totalMeetings > 0)
    .sort((a, b) => b.totalMeetings - a.totalMeetings)
    .slice(0, 10);

  // 月度趋势
  const monthMap = {};
  rawData.forEach(item => {
    if (!item.date) return;
    const month = item.date.substring(0, 7);
    if (!monthMap[month]) {
      monthMap[month] = {
        month,
        totalMeetings: 0,
        signedCount: 0
      };
    }
    monthMap[month].totalMeetings++;
    if (item.status === '已签约') {
      monthMap[month].signedCount++;
    }
  });

  const monthlyTrend = Object.values(monthMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      signRate: m.totalMeetings > 0 
        ? parseFloat(((m.signedCount / m.totalMeetings) * 100).toFixed(1))
        : 0
    }));

  // 约见方式统计
  const typeMap = {};
  rawData.forEach(item => {
    if (!item.meetingType) return;
    if (!typeMap[item.meetingType]) {
      typeMap[item.meetingType] = {
        type: item.meetingType,
        totalMeetings: 0,
        signedCount: 0
      };
    }
    typeMap[item.meetingType].totalMeetings++;
    if (item.status === '已签约') {
      typeMap[item.meetingType].signedCount++;
    }
  });

  const meetingTypeStats = Object.values(typeMap)
    .map(type => ({
      ...type,
      signRate: type.totalMeetings > 0 
        ? parseFloat(((type.signedCount / type.totalMeetings) * 100).toFixed(1))
        : 0
    }))
    .filter(type => type.totalMeetings > 0);

  // 找出拖后腿的人
  const bottomPerformers = [];
  
  [
    { data: inviterStats, role: '邀约人' },
    { data: negotiatorStats, role: '谈案人员' },
    { data: actualPersonStats, role: '实际约见人' },
    { data: lawyerStats, role: '约见律师' }
  ].forEach(({ data, role }) => {
    data.forEach(person => {
      if (person.totalMeetings >= 5 && person.signRate < signRate) {
        bottomPerformers.push({
          ...person,
          role
        });
      }
    });
  });

  bottomPerformers.sort((a, b) => a.signRate - b.signRate);

  // 客户跟进数据
  const followUpList = rawData
    .filter(item => item.status === '需跟进' || (item.status !== '已签约' && item.status !== '未签约'))
    .map(item => {
      const meetingDate = new Date(item.date);
      const today = new Date();
      const daysElapsed = Math.floor((today - meetingDate) / (1000 * 60 * 60 * 24));
      return {
        ...item,
        daysElapsed
      };
    })
    .sort((a, b) => b.daysElapsed - a.daysElapsed);

  // 今日数据
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const todayData = rawData.filter(item => item.date === today);
  const yesterdayData = rawData.filter(item => item.date === yesterday);
  
  const todayMeetings = todayData.length;
  const todaySigned = todayData.filter(item => item.status === '已签约').length;
  const todaySignRate = todayMeetings > 0 ? parseFloat(((todaySigned / todayMeetings) * 100).toFixed(1)) : 0;
  
  const yesterdayMeetings = yesterdayData.length;
  const yesterdaySigned = yesterdayData.filter(item => item.status === '已签约').length;
  const yesterdaySignRate = yesterdayMeetings > 0 ? parseFloat(((yesterdaySigned / yesterdayMeetings) * 100).toFixed(1)) : 0;

  // 本周数据
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const weekData = rawData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startOfWeek;
  });
  const weekSigned = weekData.filter(item => item.status === '已签约').length;

  // 今日MVP
  const todayLawyerMap = {};
  todayData.forEach(item => {
    if (!item.lawyer || item.lawyer === '-') return;
    if (!todayLawyerMap[item.lawyer]) {
      todayLawyerMap[item.lawyer] = { name: item.lawyer, signed: 0 };
    }
    if (item.status === '已签约') {
      todayLawyerMap[item.lawyer].signed++;
    }
  });
  
  const todayTopPerformer = Object.values(todayLawyerMap)
    .sort((a, b) => b.signed - a.signed)[0] || null;

  const todayReport = {
    today: {
      meetings: todayMeetings,
      signed: todaySigned,
      signRate: todaySignRate
    },
    yesterday: {
      meetings: yesterdayMeetings,
      signed: yesterdaySigned,
      signRate: yesterdaySignRate
    },
    comparison: {
      meetings: todayMeetings - yesterdayMeetings,
      signed: todaySigned - yesterdaySigned,
      signRate: todaySignRate - yesterdaySignRate
    },
    weekTotal: weekSigned,
    topPerformer: todayTopPerformer
  };

  return {
    overview: {
      totalMeetings,
      signedCount,
      signRate: signRate.toFixed(1),
      currentMonthMeetings,
      currentMonthSigned
    },
    inviterStats,
    negotiatorStats,
    actualPersonStats,
    lawyerStats,
    collaborationStats,
    timeStats,
    caseTypeStats,
    targetTrend,
    locationStats,
    monthlyTrend,
    meetingTypeStats,
    bottomPerformers,
    followUpList,
    todayReport
  };
}