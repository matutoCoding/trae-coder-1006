import { HarvestRecord, StatItem } from '@/types'

export const harvestList: HarvestRecord[] = [
  {
    id: '1',
    batchNo: '20240510-TM-C2',
    fieldId: '6',
    fieldName: 'C2号地块',
    herbType: '天麻',
    harvestDate: '2024-05-10',
    yield: 1500,
    unit: 'kg',
    quality: 'excellent',
    operator: '张师傅',
    growthYears: 4,
    processingStatus: 'finished'
  },
  {
    id: '2',
    batchNo: '20240815-RS-A1',
    fieldId: '1',
    fieldName: 'A1号地块',
    herbType: '人参',
    harvestDate: '2024-08-15',
    yield: 0,
    unit: 'kg',
    quality: 'excellent',
    operator: '李师傅',
    growthYears: 5,
    processingStatus: 'raw'
  },
  {
    id: '3',
    batchNo: '20240920-HJ-B1',
    fieldId: '3',
    fieldName: 'B1号地块',
    herbType: '黄精',
    harvestDate: '2024-09-20',
    yield: 0,
    unit: 'kg',
    quality: 'good',
    operator: '王师傅',
    growthYears: 6,
    processingStatus: 'drying'
  },
  {
    id: '4',
    batchNo: '20240710-TP-C1',
    fieldId: '5',
    fieldName: 'C1号地块',
    herbType: '铁皮石斛',
    harvestDate: '2024-07-10',
    yield: 200,
    unit: 'kg',
    quality: 'excellent',
    operator: '李师傅',
    growthYears: 3,
    processingStatus: 'sliced'
  },
  {
    id: '5',
    batchNo: '20241025-DG-D1',
    fieldId: '7',
    fieldName: 'D1号地块',
    herbType: '当归',
    harvestDate: '2024-10-25',
    yield: 0,
    unit: 'kg',
    quality: 'good',
    operator: '张师傅',
    growthYears: 4,
    processingStatus: 'raw'
  },
  {
    id: '6',
    batchNo: '20241105-BZ-B2',
    fieldId: '4',
    fieldName: 'B2号地块',
    herbType: '白术',
    harvestDate: '2024-11-05',
    yield: 0,
    unit: 'kg',
    quality: 'normal',
    operator: '王师傅',
    growthYears: 3,
    processingStatus: 'raw'
  }
]

export const harvestStats: StatItem[] = [
  { label: '今年采收', value: 6, unit: '批次' },
  { label: '总产量', value: 1700, unit: 'kg' },
  { label: '加工中', value: 3, unit: '批次' },
  { label: '优级品率', value: 85, unit: '%' }
]

export const processingList = [
  {
    id: '1',
    batchNo: '20240510-TM-C2',
    herbType: '天麻',
    processType: '蒸煮',
    startTime: '2024-05-12 08:00',
    endTime: '2024-05-12 10:30',
    status: 'completed',
    operator: '张师傅',
    inputQty: 500,
    outputQty: 420
  },
  {
    id: '2',
    batchNo: '20240710-TP-C1',
    herbType: '铁皮石斛',
    processType: '切片',
    startTime: '2024-06-15 09:00',
    endTime: '2024-06-15 16:00',
    status: 'completed',
    operator: '李师傅',
    inputQty: 200,
    outputQty: 180
  },
  {
    id: '3',
    batchNo: '20240920-HJ-B1',
    herbType: '黄精',
    processType: '晾晒',
    startTime: '2024-06-20 07:00',
    endTime: '',
    status: 'drying',
    operator: '王师傅',
    inputQty: 300,
    outputQty: 0
  }
]
