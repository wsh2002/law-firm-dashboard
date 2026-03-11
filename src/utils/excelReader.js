import * as XLSX from 'xlsx';

export async function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const meetingData = jsonData.map(row => ({
          date: formatDate(row['约见时间']),
          location: row['约见地点'] || '',
          lawyer: row['约见律师'] || '',
          meetingType: normalizeMeetingType(row['约见方式'] || ''),
          status: normalizeStatus(row['约见结果'] || ''),
          caseType: row['案件类型'] || '',
          inviter: row['邀约人'] || '',
          actualPerson: row['实际约见人'] || '',
          negotiator: row['谈案人员'] || ''
        }));
        
        resolve(meetingData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function formatDate(dateValue) {
  if (!dateValue) return '';
  
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  if (typeof dateValue === 'string') {
    if (dateValue.includes('/')) {
      const parts = dateValue.split(' ')[0].split('/');
      return `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
    }
    return dateValue;
  }
  
  return '';
}

function normalizeMeetingType(type) {
  if (!type) return '';
  
  const toOfficeTypes = ['前台来所', '推荐律所', '邀约来访'];
  if (toOfficeTypes.includes(type)) {
    return '到所咨询';
  }
  
  return type;
}

function normalizeStatus(status) {
  if (!status) return '未签约';
  
  if (status === '已签约') {
    return '已签约';
  }
  
  return '未签约';
}