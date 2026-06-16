export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    growing: '生长中',
    harvested: '已采收',
    idle: '空闲',
    nursery: '育苗中',
    transplanted: '已移栽',
    available: '可供应',
    excellent: '优级',
    good: '良好',
    normal: '一般',
    mild: '轻微',
    moderate: '中度',
    severe: '严重',
    treated: '已处理',
    monitoring: '观察中',
    resolved: '已解决',
    raw: '原料',
    drying: '晾晒中',
    sliced: '已切片',
    finished: '成品',
    completed: '已完成',
    pass: '合格',
    fail: '不合格',
    pending: '待处理',
    producing: '生产中',
    shipped: '已发货',
    cancelled: '已取消',
    sowing: '播种',
    transplant: '移栽',
    fertilize: '施肥',
    irrigate: '灌溉',
    prune: '修剪',
    disease: '病害',
    pest: '虫害'
  }
  return statusMap[status] || status
}

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    growing: '#2E7D32',
    harvested: '#FF7D00',
    idle: '#86909C',
    excellent: '#00B42A',
    good: '#1677FF',
    normal: '#FF7D00',
    mild: '#FF7D00',
    moderate: '#FF7D00',
    severe: '#F53F3F',
    pass: '#00B42A',
    fail: '#F53F3F',
    pending: '#FF7D00',
    completed: '#00B42A',
    cancelled: '#86909C'
  }
  return colorMap[status] || '#4E5969'
}

const herbAbbrMap: Record<string, string> = {
  '人参': 'RS',
  '三七': 'SQ',
  '黄精': 'HJ',
  '白术': 'BZ',
  '铁皮石斛': 'TP',
  '天麻': 'TM',
  '当归': 'DG',
  '川芎': 'CX',
  '黄连': 'HL',
  '川贝': 'CB',
}

export const generateBatchNo = (harvestDate: string, herbType: string, fieldName: string): string => {
  const dateStr = harvestDate.replace(/-/g, '')
  const abbr = herbAbbrMap[herbType] || herbType.substr(0, 2).toUpperCase()
  const fieldMatch = fieldName.match(/([A-Z]\d+)/)
  const fieldCode = fieldMatch ? fieldMatch[1] : fieldName.substr(0, 2).toUpperCase()
  return `${dateStr}-${abbr}-${fieldCode}`
}

export const getHerbAbbr = (herbType: string): string => {
  return herbAbbrMap[herbType] || herbType.substr(0, 2).toUpperCase()
}
