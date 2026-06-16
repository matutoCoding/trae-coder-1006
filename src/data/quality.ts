import { QualityTest, StatItem } from '@/types'

export const qualityTestList: QualityTest[] = [
  {
    id: '1',
    batchNo: '20240510-TM-C2',
    herbType: '天麻',
    testDate: '2024-05-12',
    overallResult: 'pass',
    tester: '王检验员',
    remark: '各项指标均符合药典标准',
    testItems: [
      { name: '铅(Pb)', category: 'heavyMetal', result: '0.5mg/kg', standard: '≤5.0mg/kg', isPass: true },
      { name: '镉(Cd)', category: 'heavyMetal', result: '0.08mg/kg', standard: '≤0.3mg/kg', isPass: true },
      { name: '砷(As)', category: 'heavyMetal', result: '0.2mg/kg', standard: '≤2.0mg/kg', isPass: true },
      { name: '汞(Hg)', category: 'heavyMetal', result: '0.02mg/kg', standard: '≤0.2mg/kg', isPass: true },
      { name: '铜(Cu)', category: 'heavyMetal', result: '8.5mg/kg', standard: '≤20.0mg/kg', isPass: true },
      { name: '六六六', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
      { name: '滴滴涕', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
      { name: '五氯硝基苯', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
      { name: '总灰分', category: 'other', result: '3.2%', standard: '≤4.0%', isPass: true },
      { name: '水分', category: 'other', result: '10.5%', standard: '≤13.0%', isPass: true }
    ]
  },
  {
    id: '2',
    batchNo: '20240710-TP-C1',
    herbType: '铁皮石斛',
    testDate: '2024-07-12',
    overallResult: 'pass',
    tester: '李检验员',
    remark: '多糖含量高，品质优良',
    testItems: [
      { name: '铅(Pb)', category: 'heavyMetal', result: '0.3mg/kg', standard: '≤5.0mg/kg', isPass: true },
      { name: '镉(Cd)', category: 'heavyMetal', result: '0.05mg/kg', standard: '≤0.3mg/kg', isPass: true },
      { name: '砷(As)', category: 'heavyMetal', result: '0.15mg/kg', standard: '≤2.0mg/kg', isPass: true },
      { name: '汞(Hg)', category: 'heavyMetal', result: '0.01mg/kg', standard: '≤0.2mg/kg', isPass: true },
      { name: '铜(Cu)', category: 'heavyMetal', result: '6.2mg/kg', standard: '≤20.0mg/kg', isPass: true },
      { name: '有机磷类', category: 'pesticide', result: '未检出', standard: '各≤0.05mg/kg', isPass: true },
      { name: '拟除虫菊酯', category: 'pesticide', result: '未检出', standard: '各≤0.1mg/kg', isPass: true },
      { name: '多糖含量', category: 'other', result: '25.8%', standard: '≥25.0%', isPass: true },
      { name: '总灰分', category: 'other', result: '4.8%', standard: '≤6.0%', isPass: true },
      { name: '水分', category: 'other', result: '11.2%', standard: '≤12.0%', isPass: true }
    ]
  },
  {
    id: '3',
    batchNo: '20240920-HJ-B1',
    herbType: '黄精',
    testDate: '2024-06-22',
    overallResult: 'pending',
    tester: '王检验员',
    remark: '检测进行中',
    testItems: [
      { name: '铅(Pb)', category: 'heavyMetal', result: '-', standard: '≤5.0mg/kg', isPass: true },
      { name: '镉(Cd)', category: 'heavyMetal', result: '-', standard: '≤0.3mg/kg', isPass: true },
      { name: '砷(As)', category: 'heavyMetal', result: '-', standard: '≤2.0mg/kg', isPass: true },
      { name: '汞(Hg)', category: 'heavyMetal', result: '-', standard: '≤0.2mg/kg', isPass: true },
      { name: '铜(Cu)', category: 'heavyMetal', result: '-', standard: '≤20.0mg/kg', isPass: true },
      { name: '黄曲霉毒素', category: 'microbe', result: '-', standard: '≤5μg/kg', isPass: true },
      { name: '农药残留', category: 'pesticide', result: '-', standard: '符合规定', isPass: true },
      { name: '多糖含量', category: 'other', result: '-', standard: '≥7.0%', isPass: true },
      { name: '总灰分', category: 'other', result: '-', standard: '≤4.0%', isPass: true },
      { name: '水分', category: 'other', result: '-', standard: '≤15.0%', isPass: true }
    ]
  },
  {
    id: '4',
    batchNo: '20240815-RS-A1',
    herbType: '人参',
    testDate: '2024-04-25',
    overallResult: 'pass',
    tester: '张检验员',
    remark: '人参皂苷含量达标',
    testItems: [
      { name: '铅(Pb)', category: 'heavyMetal', result: '0.4mg/kg', standard: '≤5.0mg/kg', isPass: true },
      { name: '镉(Cd)', category: 'heavyMetal', result: '0.06mg/kg', standard: '≤0.3mg/kg', isPass: true },
      { name: '砷(As)', category: 'heavyMetal', result: '0.18mg/kg', standard: '≤2.0mg/kg', isPass: true },
      { name: '汞(Hg)', category: 'heavyMetal', result: '0.015mg/kg', standard: '≤0.2mg/kg', isPass: true },
      { name: '铜(Cu)', category: 'heavyMetal', result: '5.8mg/kg', standard: '≤20.0mg/kg', isPass: true },
      { name: '六六六', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
      { name: '滴滴涕', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
      { name: '五氯硝基苯', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
      { name: '人参皂苷', category: 'other', result: '0.85%', standard: '≥0.30%', isPass: true },
      { name: '水分', category: 'other', result: '11.5%', standard: '≤12.0%', isPass: true }
    ]
  }
]

export const qualityStats: StatItem[] = [
  { label: '检测批次', value: 12, unit: '批' },
  { label: '合格率', value: 100, unit: '%' },
  { label: '在检批次', value: 2, unit: '批' },
  { label: '溯源覆盖', value: 100, unit: '%' }
]

export const traceabilityList = [
  {
    id: '1',
    batchNo: '20240510-TM-C2',
    herbType: '天麻',
    qrCode: '',
    traceInfo: {
      seed: { source: '有性繁殖', date: '2019-11-20', location: 'C2号地块' },
      plant: { field: 'C2号地块', area: '10亩', plantDate: '2019-11-20' },
      farm: { records: 24, fertilize: 6, irrigated: 12, pestControl: 6 },
      harvest: { date: '2024-05-10', yield: '1500kg', operator: '张师傅' },
      process: { type: '蒸煮晾晒', date: '2024-05-12', output: '420kg' },
      quality: { date: '2024-05-12', result: '合格', report: 'Q20240512001' }
    }
  },
  {
    id: '2',
    batchNo: '20240710-TP-C1',
    herbType: '铁皮石斛',
    qrCode: '',
    traceInfo: {
      seed: { source: '组培苗', date: '2021-06-15', location: '育苗大棚' },
      plant: { field: 'C1号地块', area: '25亩', plantDate: '2021-06-15' },
      farm: { records: 36, fertilize: 8, irrigated: 18, pestControl: 10 },
      harvest: { date: '2024-07-10', yield: '200kg', operator: '李师傅' },
      process: { type: '切片烘干', date: '2024-06-15', output: '180kg' },
      quality: { date: '2024-06-18', result: '合格', report: 'Q20240618002' }
    }
  }
]
