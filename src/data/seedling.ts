import { SeedlingInfo, StatItem } from '@/types'

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
    status: 'available',
    nurseryDate: '2024-03-15',
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

export const seedlingStats: StatItem[] = [
  { label: '种苗总数', value: '20.5', unit: '万株' },
  { label: '在作品种', value: 5, unit: '种' },
  { label: '可供移栽', value: '5.5', unit: '万株' },
  { label: '优级种苗', value: 3, unit: '批' },
]
