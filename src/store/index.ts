import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import {
  FieldInfo,
  SeedlingInfo,
  FarmRecord,
  PestRecord,
  HarvestRecord,
  QualityTest,
  OrderInfo,
  SalesRecord,
  ProcessingRecord
} from '@/types'
import { fieldList } from '@/data/field'
import { seedlingList } from '@/data/seedling'
import { farmRecordList, pestRecordList } from '@/data/farming'
import { harvestList, processingList } from '@/data/harvest'
import { qualityTestList, traceabilityList } from '@/data/quality'
import { orderList, salesRecordList } from '@/data/order'

interface AppState {
  fields: FieldInfo[]
  seedlings: SeedlingInfo[]
  farmRecords: FarmRecord[]
  pestRecords: PestRecord[]
  harvestRecords: HarvestRecord[]
  processingRecords: ProcessingRecord[]
  qualityTests: QualityTest[]
  traceabilityList: typeof traceabilityList
  orders: OrderInfo[]
  salesRecords: SalesRecord[]

  addField: (field: Omit<FieldInfo, 'id'>) => void
  updateField: (id: string, field: Partial<FieldInfo>) => void
  deleteField: (id: string) => void

  addSeedling: (seedling: Omit<SeedlingInfo, 'id'>) => void
  updateSeedling: (id: string, seedling: Partial<SeedlingInfo>) => void
  deleteSeedling: (id: string) => void

  addFarmRecord: (record: Omit<FarmRecord, 'id'>) => void
  updateFarmRecord: (id: string, record: Partial<FarmRecord>) => void
  deleteFarmRecord: (id: string) => void

  addPestRecord: (record: Omit<PestRecord, 'id'>) => void
  updatePestRecord: (id: string, record: Partial<PestRecord>) => void
  deletePestRecord: (id: string) => void

  addHarvestRecord: (record: Omit<HarvestRecord, 'id'>) => void
  updateHarvestRecord: (id: string, record: Partial<HarvestRecord>) => void
  deleteHarvestRecord: (id: string) => void

  addProcessingRecord: (record: Omit<ProcessingRecord, 'id'>) => void
  updateProcessingRecord: (id: string, record: Partial<ProcessingRecord>) => void

  addQualityTest: (test: Omit<QualityTest, 'id'>) => void
  updateQualityTest: (id: string, test: Partial<QualityTest>) => void
  deleteQualityTest: (id: string) => void

  addOrder: (order: Omit<OrderInfo, 'id'>) => void
  updateOrder: (id: string, order: Partial<OrderInfo>) => void
  deleteOrder: (id: string) => void
  updateOrderStatus: (id: string, status: OrderInfo['status']) => void

  addSalesRecord: (record: Omit<SalesRecord, 'id'>) => void

  getFieldById: (id: string) => FieldInfo | undefined
  getSeedlingById: (id: string) => SeedlingInfo | undefined
  getFarmRecordById: (id: string) => FarmRecord | undefined
  getPestRecordById: (id: string) => PestRecord | undefined
  getHarvestRecordById: (id: string) => HarvestRecord | undefined
  getProcessingRecordById: (id: string) => ProcessingRecord | undefined
  getQualityTestById: (id: string) => QualityTest | undefined
  getOrderById: (id: string) => OrderInfo | undefined

  resetAll: () => void
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

const storage = {
  getItem: (name: string) => {
    try {
      return Taro.getStorageSync(name) || null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      Taro.setStorageSync(name, value)
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },
  removeItem: (name: string) => {
    try {
      Taro.removeStorageSync(name)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },
}

const initialState = {
  fields: fieldList,
  seedlings: seedlingList,
  farmRecords: farmRecordList,
  pestRecords: pestRecordList,
  harvestRecords: harvestList,
  processingRecords: processingList,
  qualityTests: qualityTestList,
  traceabilityList: traceabilityList,
  orders: orderList,
  salesRecords: salesRecordList,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addField: (field) => set((state) => ({
        fields: [...state.fields, { ...field, id: generateId() }]
      })),
      updateField: (id, field) => set((state) => ({
        fields: state.fields.map(f => f.id === id ? { ...f, ...field } : f)
      })),
      deleteField: (id) => set((state) => ({
        fields: state.fields.filter(f => f.id !== id)
      })),

      addSeedling: (seedling) => set((state) => ({
        seedlings: [...state.seedlings, { ...seedling, id: generateId() }]
      })),
      updateSeedling: (id, seedling) => set((state) => ({
        seedlings: state.seedlings.map(s => s.id === id ? { ...s, ...seedling } : s)
      })),
      deleteSeedling: (id) => set((state) => ({
        seedlings: state.seedlings.filter(s => s.id !== id)
      })),

      addFarmRecord: (record) => set((state) => ({
        farmRecords: [{ ...record, id: generateId() }, ...state.farmRecords]
      })),
      updateFarmRecord: (id, record) => set((state) => ({
        farmRecords: state.farmRecords.map(r => r.id === id ? { ...r, ...record } : r)
      })),
      deleteFarmRecord: (id) => set((state) => ({
        farmRecords: state.farmRecords.filter(r => r.id !== id)
      })),

      addPestRecord: (record) => set((state) => ({
        pestRecords: [{ ...record, id: generateId() }, ...state.pestRecords]
      })),
      updatePestRecord: (id, record) => set((state) => ({
        pestRecords: state.pestRecords.map(r => r.id === id ? { ...r, ...record } : r)
      })),
      deletePestRecord: (id) => set((state) => ({
        pestRecords: state.pestRecords.filter(r => r.id !== id)
      })),

      addHarvestRecord: (record) => set((state) => ({
        harvestRecords: [{ ...record, id: generateId() }, ...state.harvestRecords]
      })),
      updateHarvestRecord: (id, record) => set((state) => ({
        harvestRecords: state.harvestRecords.map(r => r.id === id ? { ...r, ...record } : r)
      })),
      deleteHarvestRecord: (id) => set((state) => ({
        harvestRecords: state.harvestRecords.filter(r => r.id !== id)
      })),

      addProcessingRecord: (record) => set((state) => ({
        processingRecords: [{ ...record, id: generateId() }, ...state.processingRecords]
      })),
      updateProcessingRecord: (id, record) => set((state) => ({
        processingRecords: state.processingRecords.map(r => r.id === id ? { ...r, ...record } : r)
      })),

      addQualityTest: (test) => set((state) => ({
        qualityTests: [{ ...test, id: generateId() }, ...state.qualityTests]
      })),
      updateQualityTest: (id, test) => set((state) => ({
        qualityTests: state.qualityTests.map(t => t.id === id ? { ...t, ...test } : t)
      })),
      deleteQualityTest: (id) => set((state) => ({
        qualityTests: state.qualityTests.filter(t => t.id !== id)
      })),

      addOrder: (order) => set((state) => ({
        orders: [{ ...order, id: generateId() }, ...state.orders]
      })),
      updateOrder: (id, order) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, ...order } : o)
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id),
        salesRecords: state.salesRecords.filter(s => s.id !== id)
      })),
      updateOrderStatus: (id, status) => {
        const state = get()
        const order = state.orders.find(o => o.id === id)
        if (!order) return

        const updatedOrder = { ...order, status }
        set({
          orders: state.orders.map(o => o.id === id ? updatedOrder : o)
        })

        if (status === 'completed' && order.batchNo) {
          const existingSale = state.salesRecords.find(s => s.id === order.id)
          if (!existingSale) {
            const saleRecord: SalesRecord = {
              id: order.id,
              date: new Date().toISOString().split('T')[0],
              herbType: order.herbType,
              quantity: order.quantity,
              unit: order.unit,
              amount: order.amount,
              customer: order.customer,
              batchNo: order.batchNo || '',
            }
            set({
              salesRecords: [saleRecord, ...state.salesRecords]
            })
          }
        }
      },

      addSalesRecord: (record) => set((state) => ({
        salesRecords: [{ ...record, id: generateId() }, ...state.salesRecords]
      })),

      getFieldById: (id) => get().fields.find(f => f.id === id),
      getSeedlingById: (id) => get().seedlings.find(s => s.id === id),
      getFarmRecordById: (id) => get().farmRecords.find(r => r.id === id),
      getPestRecordById: (id) => get().pestRecords.find(r => r.id === id),
      getHarvestRecordById: (id) => get().harvestRecords.find(r => r.id === id),
      getProcessingRecordById: (id) => get().processingRecords.find(r => r.id === id),
      getQualityTestById: (id) => get().qualityTests.find(t => t.id === id),
      getOrderById: (id) => get().orders.find(o => o.id === id),

      resetAll: () => set(initialState),
    }),
    {
      name: 'gap-app-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)
