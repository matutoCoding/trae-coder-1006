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
  ProcessingRecord,
  InventoryBatch
} from '@/types'
import { fieldList } from '@/data/field'
import { seedlingList } from '@/data/seedling'
import { farmRecordList, pestRecordList } from '@/data/farming'
import { harvestList, processingList } from '@/data/harvest'
import { qualityTestList, traceabilityList } from '@/data/quality'
import { orderList, salesRecordList } from '@/data/order'

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

const initialInventory: InventoryBatch[] = [
  {
    id: 'inv-1',
    batchNo: '20240510-TM-C2',
    herbType: '天麻',
    totalQty: 1500,
    availableQty: 1300,
    reservedQty: 200,
    unit: 'kg',
    quality: 'excellent',
    warehouseDate: '2024-05-15',
    fieldId: '6',
    fieldName: 'C2号地块',
    status: 'in_stock',
  },
  {
    id: 'inv-2',
    batchNo: '20240710-TP-C1',
    herbType: '铁皮石斛',
    totalQty: 100,
    availableQty: 100,
    reservedQty: 0,
    unit: 'kg',
    quality: 'excellent',
    warehouseDate: '2024-07-15',
    fieldId: '5',
    fieldName: 'C1号地块',
    status: 'in_stock',
  },
]

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
  inventoryBatches: InventoryBatch[]

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

  addOrder: (order: Omit<OrderInfo, 'id'>) => boolean
  updateOrder: (id: string, order: Partial<OrderInfo>) => void
  deleteOrder: (id: string) => void
  updateOrderStatus: (id: string, status: OrderInfo['status']) => boolean

  addSalesRecord: (record: Omit<SalesRecord, 'id'>) => void

  addInventoryBatch: (batch: Omit<InventoryBatch, 'id' | 'status'>) => void
  updateInventoryBatch: (id: string, batch: Partial<InventoryBatch>) => void
  reserveStock: (batchNo: string, qty: number) => boolean
  releaseReserve: (batchNo: string, qty: number) => boolean
  deductStock: (batchNo: string, qty: number) => boolean
  getInventoryByBatchNo: (batchNo: string) => InventoryBatch | undefined

  getFieldById: (id: string) => FieldInfo | undefined
  getSeedlingById: (id: string) => SeedlingInfo | undefined
  getSeedlingByFieldId: (fieldId: string) => SeedlingInfo | undefined
  getSeedlingByHerbType: (herbType: string) => SeedlingInfo | undefined
  getFarmRecordById: (id: string) => FarmRecord | undefined
  getPestRecordById: (id: string) => PestRecord | undefined
  getHarvestRecordById: (id: string) => HarvestRecord | undefined
  getProcessingRecordById: (id: string) => ProcessingRecord | undefined
  getQualityTestById: (id: string) => QualityTest | undefined
  getOrderById: (id: string) => OrderInfo | undefined

  getHarvestByBatchNo: (batchNo: string) => HarvestRecord | undefined
  getQualityTestByBatchNo: (batchNo: string) => QualityTest | undefined
  getOrdersByBatchNo: (batchNo: string) => OrderInfo[]
  getProcessingByBatchNo: (batchNo: string) => ProcessingRecord[]

  resetAll: () => void
}

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

const calcInventoryStatus = (available: number, total: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (available <= 0) return 'out_of_stock'
  if (available / total < 0.2) return 'low_stock'
  return 'in_stock'
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
  inventoryBatches: initialInventory,
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

      addHarvestRecord: (record) => {
        const state = get()
        const newId = generateId()
        const newRecord = { ...record, id: newId }

        if (record.yield > 0 && (record.processingStatus === 'finished' || record.processingStatus === 'sliced')) {
          const existingInv = state.inventoryBatches.find(i => i.batchNo === record.batchNo)
          if (!existingInv) {
            const fieldInfo = state.fields.find(f => f.id === record.fieldId)
            const newInventory: Omit<InventoryBatch, 'id' | 'status'> = {
              batchNo: record.batchNo,
              herbType: record.herbType,
              totalQty: record.yield,
              availableQty: record.yield,
              reservedQty: 0,
              unit: record.unit,
              quality: record.quality,
              warehouseDate: record.harvestDate,
              fieldId: record.fieldId,
              fieldName: fieldInfo?.name || record.fieldName || '',
              remark: '采收加工自动入库'
            }
            set({
              harvestRecords: [newRecord, ...state.harvestRecords],
              inventoryBatches: [{
                ...newInventory,
                id: generateId(),
                status: calcInventoryStatus(newInventory.availableQty, newInventory.totalQty)
              }, ...state.inventoryBatches]
            })
            return
          }
        }

        set({
          harvestRecords: [newRecord, ...state.harvestRecords]
        })
      },
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

      addOrder: (order) => {
        const state = get()
        if (order.batchNo && order.status === 'producing') {
          const inv = state.inventoryBatches.find(i => i.batchNo === order.batchNo)
          if (inv && inv.availableQty < order.quantity) {
            return false
          }
          if (inv) {
            set({
              inventoryBatches: state.inventoryBatches.map(i =>
                i.batchNo === order.batchNo
                  ? {
                      ...i,
                      availableQty: i.availableQty - order.quantity,
                      reservedQty: i.reservedQty + order.quantity,
                      status: calcInventoryStatus(i.availableQty - order.quantity, i.totalQty)
                    }
                  : i
              )
            })
          }
        }
        set((state) => ({
          orders: [{ ...order, id: generateId() }, ...state.orders]
        }))
        return true
      },
      updateOrder: (id, order) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, ...order } : o)
      })),
      deleteOrder: (id) => {
        const state = get()
        const order = state.orders.find(o => o.id === id)
        if (order && order.batchNo && (order.status === 'producing')) {
          set({
            inventoryBatches: state.inventoryBatches.map(i =>
              i.batchNo === order.batchNo
                ? {
                    ...i,
                    availableQty: i.availableQty + order.quantity,
                    reservedQty: Math.max(0, i.reservedQty - order.quantity),
                    status: calcInventoryStatus(i.availableQty + order.quantity, i.totalQty)
                  }
                : i
            )
          })
        }
        set({
          orders: state.orders.filter(o => o.id !== id),
          salesRecords: state.salesRecords.filter(s => s.id !== `sale-${id}`)
        })
      },
      updateOrderStatus: (id, status) => {
        const state = get()
        const order = state.orders.find(o => o.id === id)
        if (!order) return false

        if (status === 'producing' && order.batchNo) {
          const inv = state.inventoryBatches.find(i => i.batchNo === order.batchNo)
          if (!inv || inv.availableQty < order.quantity) {
            return false
          }
          set({
            inventoryBatches: state.inventoryBatches.map(i =>
              i.batchNo === order.batchNo
                ? {
                    ...i,
                    availableQty: i.availableQty - order.quantity,
                    reservedQty: i.reservedQty + order.quantity,
                    status: calcInventoryStatus(i.availableQty - order.quantity, i.totalQty)
                  }
                : i
            )
          })
        }

        if (status === 'completed' && order.batchNo && (order.status === 'shipped' || order.status === 'producing')) {
          const stateAfter = get()
          const inv = stateAfter.inventoryBatches.find(i => i.batchNo === order.batchNo)
          if (inv) {
            const fromReserve = Math.min(order.quantity, inv.reservedQty)
            const fromAvailable = order.quantity - fromReserve
            const newTotal = inv.totalQty - order.quantity
            const newAvailable = inv.availableQty - fromAvailable
            set({
              inventoryBatches: stateAfter.inventoryBatches.map(i =>
                i.batchNo === order.batchNo
                  ? {
                      ...i,
                      totalQty: newTotal,
                      availableQty: newAvailable,
                      reservedQty: inv.reservedQty - fromReserve,
                      status: calcInventoryStatus(newAvailable, newTotal)
                    }
                  : i
              )
            })
          }

          const stateAfterInv = get()
          const saleId = `sale-${order.id}`
          const existingSale = stateAfterInv.salesRecords.find(s => s.id === saleId)
          if (!existingSale) {
            const saleRecord: SalesRecord = {
              id: saleId,
              date: new Date().toISOString().split('T')[0],
              herbType: order.herbType,
              quantity: order.quantity,
              unit: order.unit,
              amount: order.amount,
              customer: order.customer,
              batchNo: order.batchNo || '',
            }
            set({
              salesRecords: [saleRecord, ...stateAfterInv.salesRecords]
            })
          }
        }

        if ((status === 'cancelled') && order.batchNo && (order.status === 'producing' || order.status === 'shipped')) {
          const stateAfter = get()
          set({
            inventoryBatches: stateAfter.inventoryBatches.map(i =>
              i.batchNo === order.batchNo
                ? {
                    ...i,
                    availableQty: i.availableQty + order.quantity,
                    reservedQty: Math.max(0, i.reservedQty - order.quantity),
                    status: calcInventoryStatus(i.availableQty + order.quantity, i.totalQty)
                  }
                : i
            )
          })
        }

        const finalState = get()
        set({
          orders: finalState.orders.map(o => o.id === id ? { ...o, status } : o)
        })

        return true
      },

      addSalesRecord: (record) => set((state) => ({
        salesRecords: [{ ...record, id: generateId() }, ...state.salesRecords]
      })),

      addInventoryBatch: (batch) => set((state) => ({
        inventoryBatches: [{
          ...batch,
          id: generateId(),
          status: calcInventoryStatus(batch.availableQty, batch.totalQty)
        }, ...state.inventoryBatches]
      })),
      updateInventoryBatch: (id, batch) => set((state) => ({
        inventoryBatches: state.inventoryBatches.map(i => i.id === id ? { ...i, ...batch } : i)
      })),
      reserveStock: (batchNo, qty) => {
        const state = get()
        const inv = state.inventoryBatches.find(i => i.batchNo === batchNo)
        if (!inv || inv.availableQty < qty) return false

        set({
          inventoryBatches: state.inventoryBatches.map(i =>
            i.batchNo === batchNo
              ? {
                  ...i,
                  availableQty: i.availableQty - qty,
                  reservedQty: i.reservedQty + qty,
                  status: calcInventoryStatus(i.availableQty - qty, i.totalQty)
                }
              : i
          )
        })
        return true
      },
      releaseReserve: (batchNo, qty) => {
        const state = get()
        const inv = state.inventoryBatches.find(i => i.batchNo === batchNo)
        if (!inv || inv.reservedQty < qty) return false

        set({
          inventoryBatches: state.inventoryBatches.map(i =>
            i.batchNo === batchNo
              ? {
                  ...i,
                  availableQty: i.availableQty + qty,
                  reservedQty: Math.max(0, i.reservedQty - qty),
                  status: calcInventoryStatus(i.availableQty + qty, i.totalQty)
                }
              : i
          )
        })
        return true
      },
      deductStock: (batchNo, qty) => {
        const state = get()
        const inv = state.inventoryBatches.find(i => i.batchNo === batchNo)
        if (!inv || inv.availableQty + inv.reservedQty < qty) return false

        const fromReserve = Math.min(qty, inv.reservedQty)
        const fromAvailable = qty - fromReserve

        set({
          inventoryBatches: state.inventoryBatches.map(i =>
            i.batchNo === batchNo
              ? {
                  ...i,
                  totalQty: i.totalQty - qty,
                  availableQty: i.availableQty - fromAvailable,
                  reservedQty: i.reservedQty - fromReserve,
                  status: calcInventoryStatus(i.availableQty - fromAvailable, i.totalQty - qty)
                }
              : i
          )
        })
        return true
      },
      getInventoryByBatchNo: (batchNo) => get().inventoryBatches.find(i => i.batchNo === batchNo),

      getFieldById: (id) => get().fields.find(f => f.id === id),
      getSeedlingById: (id) => get().seedlings.find(s => s.id === id),
      getSeedlingByFieldId: (fieldId) => get().seedlings.find(s => s.fieldId === fieldId),
      getSeedlingByHerbType: (herbType) => get().seedlings.find(s => s.herbType === herbType),
      getFarmRecordById: (id) => get().farmRecords.find(r => r.id === id),
      getPestRecordById: (id) => get().pestRecords.find(r => r.id === id),
      getHarvestRecordById: (id) => get().harvestRecords.find(r => r.id === id),
      getProcessingRecordById: (id) => get().processingRecords.find(r => r.id === id),
      getQualityTestById: (id) => get().qualityTests.find(t => t.id === id),
      getOrderById: (id) => get().orders.find(o => o.id === id),

      getHarvestByBatchNo: (batchNo) => get().harvestRecords.find(h => h.batchNo === batchNo),
      getQualityTestByBatchNo: (batchNo) => get().qualityTests.find(t => t.batchNo === batchNo),
      getOrdersByBatchNo: (batchNo) => get().orders.filter(o => o.batchNo === batchNo),
      getProcessingByBatchNo: (batchNo) => get().processingRecords.filter(p => p.batchNo === batchNo),

      resetAll: () => set(initialState),
    }),
    {
      name: 'gap-app-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)
