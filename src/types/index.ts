export interface FieldInfo {
  id: string
  name: string
  area: number
  location: string
  soilType: string
  herbType: string
  plantDate: string
  status: 'growing' | 'harvested' | 'idle'
  growthYears: number
  description?: string
}

export interface SeedlingInfo {
  id: string
  name: string
  variety: string
  herbType: string
  source: string
  quantity: number
  nurseryDate: string
  fieldId?: string
  fieldName?: string
  status: 'nursery' | 'transplanted' | 'available'
  quality: 'excellent' | 'good' | 'normal'
}

export interface FarmRecord {
  id: string
  type: 'sowing' | 'transplant' | 'fertilize' | 'irrigate' | 'prune'
  fieldId: string
  fieldName: string
  date: string
  operator: string
  description: string
  quantity?: number
  unit?: string
}

export interface PestRecord {
  id: string
  type: 'disease' | 'pest'
  fieldId: string
  fieldName: string
  name: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  method: string
  pesticide?: string
  operator: string
  status: 'treated' | 'monitoring' | 'resolved'
}

export interface HarvestRecord {
  id: string
  batchNo: string
  fieldId: string
  fieldName: string
  herbType: string
  harvestDate: string
  yield: number
  unit: string
  quality: 'excellent' | 'good' | 'normal'
  operator: string
  growthYears: number
  processingStatus: 'raw' | 'drying' | 'sliced' | 'finished'
}

export interface QualityTest {
  id: string
  batchNo: string
  herbType: string
  testDate: string
  testItems: TestItem[]
  overallResult: 'pass' | 'fail' | 'pending'
  tester: string
  remark?: string
}

export interface TestItem {
  name: string
  category: 'pesticide' | 'heavyMetal' | 'microbe' | 'other'
  result: string
  standard: string
  isPass: boolean
}

export interface OrderInfo {
  id: string
  orderNo: string
  customer: string
  herbType: string
  quantity: number
  unit: string
  price: number
  amount: number
  orderDate: string
  deliveryDate: string
  status: 'pending' | 'producing' | 'shipped' | 'completed' | 'cancelled'
  batchNo?: string
  remark?: string
}

export interface SalesRecord {
  id: string
  date: string
  herbType: string
  quantity: number
  unit: string
  amount: number
  customer: string
  batchNo: string
}

export interface ProcessingRecord {
  id: string
  batchNo: string
  herbType: string
  processType: string
  startTime: string
  endTime?: string
  status: 'raw' | 'drying' | 'sliced' | 'completed'
  operator: string
  inputQty: number
  outputQty: number
}

export interface InventoryBatch {
  id: string
  batchNo: string
  herbType: string
  totalQty: number
  availableQty: number
  reservedQty: number
  unit: string
  quality: 'excellent' | 'good' | 'normal'
  warehouseDate: string
  fieldId: string
  fieldName: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  remark?: string
}

export type StockFlowType = 'in' | 'reserve' | 'release' | 'deduct' | 'adjust'

export interface InventoryFlow {
  id: string
  batchNo: string
  herbType: string
  type: StockFlowType
  quantity: number
  unit: string
  beforeQty: { total: number; available: number; reserved: number }
  afterQty: { total: number; available: number; reserved: number }
  operator: string
  operateTime: string
  remark?: string
  relatedId?: string
}

export interface StatItem {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
}
