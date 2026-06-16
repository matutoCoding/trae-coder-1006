import { SeedlingInfo, FarmRecord, PestRecord, StatItem } from '@/types'

export const seedlingList: SeedlingInfo[] = [
  {
    id: '1',
    name: '人参种苗',
    variety: '长白山林下参',
    source: '自主繁育',
    quantity: 50000,
    nurseryDate: '2024-04-10',
    status: 'nursery',
    quality: 'excellent'
  },
  {
    id: '2',
    name: '三七种苗',
    variety: '文山三七',
    source: '外购驯化',
    quantity: 30000,
    nurseryDate: '2024-03-15',
    status: 'available',
    quality: 'good'
  },
  {
    id: '3',
    name: '黄精种苗',
    variety: '多花黄精',
    source: '自主繁育',
    quantity: 20000,
    nurseryDate: '2024-02-20',
    status: 'transplanted',
    quality: 'excellent'
  },
  {
    id: '4',
    name: '铁皮石斛苗',
    variety: '红杆软脚',
    source: '组培苗',
    quantity: 80000,
    nurseryDate: '2024-05-01',
    status: 'nursery',
    quality: 'excellent'
  },
  {
    id: '5',
    name: '当归种苗',
    variety: '岷县当归',
    source: '外购',
    quantity: 25000,
    nurseryDate: '2024-04-20',
    status: 'available',
    quality: 'good'
  }
]

export const farmRecordList: FarmRecord[] = [
  {
    id: '1',
    type: 'fertilize',
    fieldId: '1',
    fieldName: 'A1号地块',
    date: '2024-06-10',
    operator: '张师傅',
    description: '追施有机复合肥，采用沟施方式',
    quantity: 150,
    unit: 'kg'
  },
  {
    id: '2',
    type: 'irrigate',
    fieldId: '1',
    fieldName: 'A1号地块',
    date: '2024-06-08',
    operator: '李师傅',
    description: '滴灌浇水，保持土壤湿度',
    quantity: 80,
    unit: 'm³'
  },
  {
    id: '3',
    type: 'transplant',
    fieldId: '3',
    fieldName: 'B1号地块',
    date: '2024-05-20',
    operator: '王师傅',
    description: '黄精种苗移栽，行距30cm，株距20cm',
    quantity: 15000,
    unit: '株'
  },
  {
    id: '4',
    type: 'sowing',
    fieldId: '4',
    fieldName: 'B2号地块',
    date: '2024-04-05',
    operator: '张师傅',
    description: '白术种子条播，播种深度2-3cm',
    quantity: 80,
    unit: 'kg'
  },
  {
    id: '5',
    type: 'prune',
    fieldId: '5',
    fieldName: 'C1号地块',
    date: '2024-06-01',
    operator: '李师傅',
    description: '铁皮石斛整枝修剪，去除老弱病枝',
    quantity: 0,
    unit: ''
  },
  {
    id: '6',
    type: 'fertilize',
    fieldId: '2',
    fieldName: 'A2号地块',
    date: '2024-05-25',
    operator: '王师傅',
    description: '三七叶面喷施磷酸二氢钾',
    quantity: 20,
    unit: 'kg'
  }
]

export const pestRecordList: PestRecord[] = [
  {
    id: '1',
    type: 'disease',
    fieldId: '2',
    fieldName: 'A2号地块',
    name: '三七根腐病',
    severity: 'mild',
    date: '2024-05-15',
    method: '生物防治，施用木霉菌',
    pesticide: '木霉菌制剂',
    operator: '李师傅',
    status: 'resolved'
  },
  {
    id: '2',
    type: 'pest',
    fieldId: '1',
    fieldName: 'A1号地块',
    name: '人参蚜虫',
    severity: 'moderate',
    date: '2024-06-05',
    method: '物理防治+生物农药',
    pesticide: '苦参碱水剂',
    operator: '张师傅',
    status: 'treated'
  },
  {
    id: '3',
    type: 'disease',
    fieldId: '5',
    fieldName: 'C1号地块',
    name: '石斛炭疽病',
    severity: 'mild',
    date: '2024-06-10',
    method: '加强通风，剪除病叶',
    pesticide: '',
    operator: '王师傅',
    status: 'monitoring'
  },
  {
    id: '4',
    type: 'pest',
    fieldId: '7',
    fieldName: 'D1号地块',
    name: '当归麻口病',
    severity: 'severe',
    date: '2024-05-20',
    method: '土壤消毒+轮作',
    pesticide: '生石灰',
    operator: '李师傅',
    status: 'treated'
  },
  {
    id: '5',
    type: 'disease',
    fieldId: '4',
    fieldName: 'B2号地块',
    name: '白术立枯病',
    severity: 'mild',
    date: '2024-05-10',
    method: '种子消毒+苗床管理',
    pesticide: '多菌灵',
    operator: '张师傅',
    status: 'resolved'
  }
]

export const farmingStats: StatItem[] = [
  { label: '在育种苗', value: 13, unit: '万株' },
  { label: '本月农事', value: 28, unit: '次' },
  { label: '病虫防治', value: 5, unit: '起' },
  { label: '绿色防控率', value: 95, unit: '%' }
]
