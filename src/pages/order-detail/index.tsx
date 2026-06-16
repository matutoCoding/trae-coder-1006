import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { OrderInfo } from '@/types'
import { getStatusText, formatCurrency } from '@/utils'

const statusFlow = [
  { key: 'pending', label: '待处理', icon: '📋' },
  { key: 'producing', label: '生产中', icon: '🏭' },
  { key: 'shipped', label: '已发货', icon: '🚚' },
  { key: 'completed', label: '已完成', icon: '✅' },
]

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const id = router.params.id || ''

  const getOrderById = useAppStore(state => state.getOrderById)
  const updateOrderStatus = useAppStore(state => state.updateOrderStatus)
  const getQualityTestById = useAppStore(state => state.getQualityTestById)
  const qualityTests = useAppStore(state => state.qualityTests)

  const [order, setOrder] = useState<OrderInfo | null>(null)

  useEffect(() => {
    if (id) {
      const data = getOrderById(id)
      if (data) {
        setOrder(data)
      }
    }
  }, [id, getOrderById])

  if (!order) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    )
  }

  const currentIndex = statusFlow.findIndex(s => s.key === order.status)

  const handleNextStatus = () => {
    const nextIndex = statusFlow.findIndex(s => s.key === order.status)
    if (nextIndex >= 0 && nextIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[nextIndex + 1].key as OrderInfo['status']

      let confirmText = {
        producing: '确认开始生产？',
        shipped: '确认已发货？',
        completed: '确认订单完成？完成后将同步到产销台账',
      }

      const confirmMsg = confirmText[nextStatus as keyof typeof confirmText] || '确认更新状态？'

      Taro.showModal({
        title: '状态更新',
        content: confirmMsg,
        success: (res) => {
          if (res.confirm) {
            updateOrderStatus(id, nextStatus)
            const updated = getOrderById(id)
            if (updated) {
              setOrder(updated)
            }
            Taro.showToast({ title: '状态已更新', icon: 'success' })
          }
        }
      })
    }
  }

  const handleViewQuality = () => {
    if (order.batchNo) {
      const test = qualityTests.find(t => t.batchNo === order.batchNo)
      if (test) {
        Taro.navigateTo({ url: `/pages/quality-detail/index?id=${test.id}` })
      } else {
        Taro.showToast({ title: '暂无检测报告', icon: 'none' })
      }
    } else {
      Taro.showToast({ title: '暂无关联批次', icon: 'none' })
    }
  }

  const canAdvance = order.status !== 'completed' && order.status !== 'cancelled'

  const nextStatusText = {
    pending: '开始生产',
    producing: '确认发货',
    shipped: '确认完成',
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.orderNo}>订单号 {order.orderNo}</Text>
        <Text className={styles.title}>{order.customer}</Text>
        <Text className={styles.statusTag}>{getStatusText(order.status)}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>订单进度</Text>
        <View className={styles.statusFlow}>
          {statusFlow.map((step, index) => (
            <View
              key={step.key}
              className={classnames(styles.flowItem, {
                [styles.done]: index < currentIndex,
                [styles.active]: index === currentIndex,
              })}
            >
              <View className={styles.dot}>
                {index < currentIndex ? '✓' : step.icon}
              </View>
              <Text className={styles.label}>{step.label}</Text>
            </View>
          ))}
        </View>
        {canAdvance && (
          <View className={styles.actionBtns}>
            <View className={classnames(styles.btn, styles.btnPrimary)} onClick={handleNextStatus}>
              {nextStatusText[order.status as keyof typeof nextStatusText] || '更新状态'}
            </View>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>商品信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.label}>药材品种</Text>
            <Text className={styles.value}>{order.herbType}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>数量</Text>
            <Text className={styles.value}>{order.quantity} {order.unit}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>单价</Text>
            <Text className={styles.value}>¥{order.price.toLocaleString()}/{order.unit}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>批次号</Text>
            <Text className={styles.value}>{order.batchNo || '待分配'}</Text>
          </View>
        </View>
        <View className={styles.priceRow}>
          <Text className={styles.label}>订单金额</Text>
          <Text className={styles.amount}>¥{formatCurrency(order.amount)}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>订单信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.label}>下单日期</Text>
            <Text className={styles.value}>{order.orderDate}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>预计交货</Text>
            <Text className={styles.value}>{order.deliveryDate}</Text>
          </View>
          <View className={classnames(styles.infoItem, styles.fullWidth)}>
            <Text className={styles.label}>备注</Text>
            <Text className={styles.value}>{order.remark || '无'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>质量追溯</Text>
        <View className={styles.infoGrid}>
          <View className={classnames(styles.infoItem, styles.fullWidth)}>
            <Text className={styles.label}>关联批次</Text>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text className={styles.value}>{order.batchNo || '暂无'}</Text>
              {order.batchNo && (
                <Text
                  style={{ fontSize: '24rpx', color: '#5E35B1' }}
                  onClick={handleViewQuality}
                >
                  查看检测报告 →
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={classnames(styles.footerBtn, styles.btnOutline)} onClick={() => Taro.navigateBack()}>
          返回
        </View>
        {canAdvance && (
          <View className={classnames(styles.footerBtn, styles.btnPrimary)} onClick={handleNextStatus}>
            {nextStatusText[order.status as keyof typeof nextStatusText] || '更新状态'}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default OrderDetailPage
