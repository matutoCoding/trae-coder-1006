import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { OrderInfo } from '@/types'

const herbOptions = ['人参', '三七', '天麻', '黄精', '铁皮石斛', '当归', '白术', '其他']
const unitOptions = ['kg', 'g', '株', '箱']

const OrderFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addOrder = useAppStore(state => state.addOrder)
  const updateOrder = useAppStore(state => state.updateOrder)
  const deleteOrder = useAppStore(state => state.deleteOrder)
  const getOrderById = useAppStore(state => state.getOrderById)
  const harvestRecords = useAppStore(state => state.harvestRecords)

  const [formData, setFormData] = useState<Partial<OrderInfo>>({
    orderNo: '',
    customer: '',
    herbType: '',
    quantity: 0,
    unit: 'kg',
    price: 0,
    amount: 0,
    status: 'pending',
    orderDate: '',
    deliveryDate: '',
    batchNo: '',
    remark: '',
  })

  const [herbIndex, setHerbIndex] = useState(0)
  const [unitIndex, setUnitIndex] = useState(0)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (mode === 'edit' && id) {
      const order = getOrderById(id)
      if (order) {
        setFormData(order)
        Taro.setNavigationBarTitle({ title: '编辑订单' })
        const hIdx = herbOptions.indexOf(order.herbType)
        if (hIdx >= 0) setHerbIndex(hIdx)
        const uIdx = unitOptions.indexOf(order.unit)
        if (uIdx >= 0) setUnitIndex(uIdx)
      }
    } else {
      const orderNo = `DD${Date.now().toString().slice(-8)}`
      setFormData(prev => ({
        ...prev,
        orderNo,
        orderDate: today,
      }))
      Taro.setNavigationBarTitle({ title: '新增订单' })
    }
  }, [mode, id, getOrderById])

  useEffect(() => {
    const amount = (formData.quantity || 0) * (formData.price || 0)
    setFormData(prev => ({ ...prev, amount: Math.round(amount * 100) / 100 }))
  }, [formData.quantity, formData.price])

  const handleInputChange = (key: keyof OrderInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleHerbChange = (e: any) => {
    const idx = Number(e.detail.value)
    setHerbIndex(idx)
    setFormData(prev => ({ ...prev, herbType: herbOptions[idx] }))
  }

  const handleUnitChange = (e: any) => {
    const idx = Number(e.detail.value)
    setUnitIndex(idx)
    setFormData(prev => ({ ...prev, unit: unitOptions[idx] }))
  }

  const handleSubmit = () => {
    if (!formData.customer?.trim()) {
      Taro.showToast({ title: '请输入客户名称', icon: 'none' })
      return
    }
    if (!formData.herbType) {
      Taro.showToast({ title: '请选择药材品种', icon: 'none' })
      return
    }
    if (!formData.quantity || formData.quantity <= 0) {
      Taro.showToast({ title: '请输入正确数量', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addOrder(formData as Omit<OrderInfo, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updateOrder(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条订单记录吗？',
      success: (res) => {
        if (res.confirm) {
          deleteOrder(id)
          Taro.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        }
      }
    })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>订单编号</Text>
          <View className={styles.inputWrap}>
            <Text className={styles.input}>{formData.orderNo}</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>客户名称</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入客户名称"
              value={formData.customer}
              onInput={(e) => handleInputChange('customer', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>下单日期</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入下单日期"
              value={formData.orderDate}
              onInput={(e) => handleInputChange('orderDate', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>交货日期</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入预计交货日期"
              value={formData.deliveryDate}
              onInput={(e) => handleInputChange('deliveryDate', e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>商品信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>药材品种</Text>
          <View className={styles.inputWrap}>
            <Picker
              mode="selector"
              range={herbOptions}
              value={herbIndex}
              onChange={handleHerbChange}
            >
              <Text className={classnames(styles.pickerText, {
                [styles.placeholder]: !formData.herbType
              })}>
                {formData.herbType || '请选择药材品种'}
              </Text>
            </Picker>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>数量</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              type="digit"
              placeholder="请输入数量"
              value={String(formData.quantity || '')}
              onInput={(e) => handleInputChange('quantity', Number(e.detail.value) || 0)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>单位</Text>
          <View className={styles.inputWrap}>
            <Picker
              mode="selector"
              range={unitOptions}
              value={unitIndex}
              onChange={handleUnitChange}
            >
              <Text className={styles.pickerText}>
                {formData.unit || '请选择单位'}
              </Text>
            </Picker>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>单价(元)</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              type="digit"
              placeholder="请输入单价"
              value={String(formData.price || '')}
              onInput={(e) => handleInputChange('price', Number(e.detail.value) || 0)}
            />
          </View>
        </View>

        <View className={styles.amountRow}>
          <Text className={styles.amountLabel}>订单金额</Text>
          <Text className={styles.amountValue}>¥{(formData.amount || 0).toFixed(2)}</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>关联批次</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="可选，关联采收批次"
              value={formData.batchNo}
              onInput={(e) => handleInputChange('batchNo', e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>其他信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>备注</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入备注信息"
              value={formData.remark}
              onInput={(e) => handleInputChange('remark', e.detail.value)}
            />
          </View>
        </View>

        {mode === 'edit' && (
          <View className={classnames(styles.footerBtn, styles.btnDanger)} onClick={handleDelete}>
            删除订单
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <View className={classnames(styles.footerBtn, styles.btnOutline)} onClick={() => Taro.navigateBack()}>
          取消
        </View>
        <View className={classnames(styles.footerBtn, styles.btnPrimary)} onClick={handleSubmit}>
          保存
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderFormPage
