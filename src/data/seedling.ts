import { SeedlingInfo, StatItem } from '@/types'

export const seedlingList: SeedlingInfo[] = [
  {
    id: '1',
    name: '人参种苗',
    variety: '长白山林下参',
    herbType: '人参',
    source: '自主繁育',
    quantity: 50000,
    nurseryDate: '2024-04-10',
    fieldId: '1',
    fieldName: 'A1号地块',
    status: 'transplanted',
    quality: 'excellent'
  },
  {
    id: '2',
    name: '三七种苗',
    variety: '文山三七',
    herbType: '三七',
    source: '外购驯化',
    quantity: 30000,
    status: 'available',
    nurseryDate: '2024-03-15',
    fieldId: '2',
    fieldName: 'A2号地块',
    quality: 'good'
  },
  {
    id: '3',
    name: '黄精种苗',
    variety: '多花黄精',
    herbType: '黄精',
    source: '自主繁育',
    quantity: 20000,
    nurseryDate: '2024-02-20',
    fieldId: '3',
    fieldName: 'B1号地块',
    status: 'transplanted',
    quality: 'excellent'
  },
  {
    id: '4',
    name: '铁皮石斛苗',
    variety: '红杆软脚',
    herbType: '铁皮石斛',
    source: '组培苗',
    quantity: 80000,
    nurseryDate: '2024-05-01',
    fieldId: '5',
    fieldName: 'C1号地块',
    status: 'transplanted',
    quality: 'excellent'
  },
  {
    id: '5',
    name: '当归种苗',
    variety: '岷县当归',
    herbType: '当归',
    source: '外购',
    quantity: 25000,
    nurseryDate: '2024-04-20',
    fieldId: '7',
    fieldName: 'D1号地块',
    status: 'transplanted',
    quality: 'good'
  },
  {
    id: '6',
    name: '白术种苗',
    variety: '浙白术',
    herbType: '白术',
    source: '自主繁育',
    quantity: 35000,
    nurseryDate: '2024-03-10',
    fieldId: '4',
    fieldName: 'B2号地块',
    status: 'transplanted',
    quality: 'good'
  },
  {
    id: '7',
    name: '天麻种麻',
    variety: '乌红杂交天麻',
    herbType: '天麻',
    source: '有性繁殖',
    quantity: 15000,
    nurseryDate: '2023-11-20',
    fieldId: '6',
    fieldName: 'C2号地块',
    status: 'transplanted',
    quality: 'excellent'
  },
]

export const seedlingStats: StatItem[] = [
  { label: '种苗总数', value: '23.5', unit: '万株' },
  { label: '在作品种', value: 7, unit: '种' },
  { label: '可供移栽', value: '3', unit: '万株' },
  { label: '优级种苗', value: 4, unit: '批' },
]
