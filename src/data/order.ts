import { OrderInfo, SalesRecord, StatItem } from '@/types'

export const orderList: OrderInfo[] = [
  {
    id: '1',
    orderNo: 'DD20240610001',
    customer: '云南白药集团',
    herbType: '三七',
    quantity: 500,
    unit: 'kg',
    price: 320,
    amount: 160000,
    orderDate: '2024-06-10',
    deliveryDate: '2024-07-15',
    status: 'producing',
    batchNo: 'B20240601001',
    remark: '需提供GAP认证证书'
  },
  {
    id: '2',
    orderNo: 'DD20240605002',
    customer: '同仁堂药业',
    herbType: '天麻',
    quantity: 200,
    unit: 'kg',
    price: 280,
    amount: 56000,
    orderDate: '2024-06-05',
    deliveryDate: '2024-06-20',
    status: 'shipped',
    batchNo: 'B20240510001',
    remark: '特级精选'
  },
  {
    id: '3',
    orderNo: 'DD20240528003',
    customer: '康美药业',
    herbType: '铁皮石斛',
    quantity: 100,
    unit: 'kg',
    price: 880,
    amount: 88000,
    orderDate: '2024-05-28',
    deliveryDate: '2024-06-25',
    status: 'completed',
    batchNo: 'B20240615002',
    remark: '铁皮枫斗加工成品'
  },
  {
    id: '4',
    orderNo: 'DD20240615004',
    customer: '广药集团',
    herbType: '当归',
    quantity: 800,
    unit: 'kg',
    price: 95,
    amount: 76000,
    orderDate: '2024-06-15',
    deliveryDate: '2024-11-30',
    status: 'pending',
    batchNo: '',
    remark: '岷县当归，待采收'
  },
  {
    id: '5',
    orderNo: 'DD20240618005',
    customer: '扬子江药业',
    herbType: '黄精',
    quantity: 300,
    unit: 'kg',
    price: 120,
    amount: 36000,
    orderDate: '2024-06-18',
    deliveryDate: '2024-10-15',
    status: 'producing',
    batchNo: 'B20240620003',
    remark: '制黄精，九蒸九晒'
  },
  {
    id: '6',
    orderNo: 'DD20240510006',
    customer: '片仔癀药业',
    herbType: '人参',
    quantity: 50,
    unit: 'kg',
    price: 1200,
    amount: 60000,
    orderDate: '2024-05-10',
    deliveryDate: '2024-08-20',
    status: 'pending',
    batchNo: '',
    remark: '林下参，5年生'
  }
]

export const salesRecordList: SalesRecord[] = [
  { id: '1', date: '2024-06-05', herbType: '天麻', quantity: 200, unit: 'kg', amount: 56000, customer: '同仁堂药业', batchNo: 'B20240510001' },
  { id: '2', date: '2024-05-28', herbType: '铁皮石斛', quantity: 100, unit: 'kg', amount: 88000, customer: '康美药业', batchNo: 'B20240615002' },
  { id: '3', date: '2024-05-15', herbType: '白术', quantity: 500, unit: 'kg', amount: 45000, customer: '九州通医药', batchNo: 'B20240420005' },
  { id: '4', date: '2024-04-20', herbType: '三七', quantity: 300, unit: 'kg', amount: 96000, customer: '云南白药集团', batchNo: 'B20240410006' },
  { id: '5', date: '2024-04-10', herbType: '黄精', quantity: 150, unit: 'kg', amount: 18000, customer: '北京同仁堂', batchNo: 'B20240320007' },
  { id: '6', date: '2024-03-25', herbType: '当归', quantity: 400, unit: 'kg', amount: 38000, customer: '汇仁药业', batchNo: 'B20240310008' }
]

export const orderStats: StatItem[] = [
  { label: '本月订单', value: 6, unit: '单' },
  { label: '销售金额', value: 47.6, unit: '万元' },
  { label: '待发货', value: 2, unit: '单' },
  { label: '合作药企', value: 8, unit: '家' }
]

export const salesStats = [
  { month: '1月', amount: 32.5 },
  { month: '2月', amount: 28.0 },
  { month: '3月', amount: 45.2 },
  { month: '4月', amount: 52.8 },
  { month: '5月', amount: 48.6 },
  { month: '6月', amount: 47.6 }
]
