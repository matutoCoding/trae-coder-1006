import { FieldInfo, StatItem } from '@/types'

export const fieldList: FieldInfo[] = [
  {
    id: '1',
    name: 'A1号地块',
    area: 15.6,
    location: '东坡一区',
    soilType: '砂壤土',
    herbType: '人参',
    plantDate: '2021-04-15',
    status: 'growing',
    growthYears: 5,
    description: '道地人参种植区，采用林下仿野生种植模式'
  },
  {
    id: '2',
    name: 'A2号地块',
    area: 12.3,
    location: '东坡二区',
    soilType: '腐殖土',
    herbType: '三七',
    plantDate: '2022-03-20',
    status: 'growing',
    growthYears: 4,
    description: '三七规范化种植区，遮阳网覆盖栽培'
  },
  {
    id: '3',
    name: 'B1号地块',
    area: 20.0,
    location: '西坡一区',
    soilType: '黄壤土',
    herbType: '黄精',
    plantDate: '2020-05-10',
    status: 'growing',
    growthYears: 6,
    description: '黄精野生抚育区，生态种植'
  },
  {
    id: '4',
    name: 'B2号地块',
    area: 18.5,
    location: '西坡二区',
    soilType: '砂壤土',
    herbType: '白术',
    plantDate: '2023-04-01',
    status: 'growing',
    growthYears: 3,
    description: '白术GAP标准化种植区'
  },
  {
    id: '5',
    name: 'C1号地块',
    area: 25.0,
    location: '南坡一区',
    soilType: '红壤土',
    herbType: '铁皮石斛',
    plantDate: '2021-06-15',
    status: 'growing',
    growthYears: 5,
    description: '铁皮石斛林下仿野生栽培区'
  },
  {
    id: '6',
    name: 'C2号地块',
    area: 10.0,
    location: '南坡二区',
    soilType: '腐殖土',
    herbType: '天麻',
    plantDate: '2019-11-20',
    status: 'harvested',
    growthYears: 4,
    description: '天麻有性繁殖种植区，2024年已采收'
  },
  {
    id: '7',
    name: 'D1号地块',
    area: 30.0,
    location: '北坡一区',
    soilType: '棕壤土',
    herbType: '当归',
    plantDate: '2022-05-05',
    status: 'growing',
    growthYears: 4,
    description: '当归道地产区，高原种植'
  },
  {
    id: '8',
    name: 'D2号地块',
    area: 8.5,
    location: '北坡二区',
    soilType: '砂壤土',
    herbType: '川芎',
    plantDate: '2023-08-10',
    status: 'idle',
    growthYears: 0,
    description: '川芎轮作休耕区，土壤改良中'
  }
]

export const fieldStats: StatItem[] = [
  { label: '药田总数', value: 8, unit: '块' },
  { label: '种植面积', value: 139.9, unit: '亩' },
  { label: '在作品种', value: 8, unit: '种' },
  { label: 'GAP认证', value: 6, unit: '块' }
]
