import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { OrderInfo, SalesRecord } from '@/types'
import { formatCurrency } from '@/utils'

type TabType = 'order' | 'sales'

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('order')
  const [refreshing, setRefreshing] = useState(false)
  const orders = useAppStore(state => state.orders)
  const salesRecords = useAppStore(state => state.salesRecords)

  const stats = useMemo(() => {
    const pendingCount = orders.filter(o => o.status === 'pending').length
    const producingCount = orders.filter(o => o.status === 'producing').length
    const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0)
    const completedCount = orders.filter(o => o.status === 'completed').length
    return [
      { label: '订单总数', value: orders.length, unit: '单' },
      { label: '待处理', value: pendingCount, unit: '单' },
      { label: '进行中', value: producingCount, unit: '单' },
      { label: '已完成', value: completedCount, unit: '单' },
    ]
  }, [orders])

  const salesStats = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月']
    return months.map((month, i) => ({
      month,
      amount: Math.round((20 + Math.random() * 30) * 10) / 10,
    }))
  }, [salesRecords])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    if (activeTab === 'order') {
      Taro.navigateTo({ url: '/pages/order-form/index?mode=add' })
    } else {
      Taro.showToast({ title: '新增销售记录', icon: 'none' })
    }
  }

  const handleOrderClick = (order: OrderInfo) => {
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` })
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: '#FF7D00',
      producing: '#1677FF',
      shipped: '#722ED1',
      completed: '#00B42A',
      cancelled: '#86909C'
    }
    return map[status] || '#4E5969'
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待处理',
      producing: '生产中',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消'
    }
    return map[status] || status
  }

  const renderOrderTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>药企订单</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {orders.map((order: OrderInfo) => (
          <View
            key={order.id}
            className={styles.card}
            onClick={() => handleOrderClick(order)}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{order.customer}</Text>
                <Text className={styles.cardSubtitle}>订单号：{order.orderNo}</Text>
              </View>
              <Text
                style={{
                  padding: '4rpx 16rpx',
                  borderRadius: '8rpx',
                  fontSize: '22rpx',
                  color: getStatusColor(order.status),
                  backgroundColor: `${getStatusColor(order.status)}15`
                }}
              >
                {getStatusText(order.status)}
              </Text>
            </View>

            <View className={styles.orderInfo}>
              <View className={styles.herbInfo}>
                <Text className={styles.herbName}>{order.herbType}</Text>
                <Text className={styles.herbSpec}>
                  {order.quantity} {order.unit} × ¥{order.price}/{order.unit}
                </Text>
              </View>
              <View className={styles.priceInfo}>
                <Text className={styles.priceAmount}>¥{formatCurrency(order.amount)}</Text>
                <Text className={styles.priceUnit}>订单金额</Text>
              </View>
            </View>

            <View className={styles.orderDetails}>
              <View className={styles.detailItem}>
                <Text className={styles.detailLabel}>下单日期</Text>
                <Text className={styles.detailValue}>{order.orderDate}</Text>
              </View>
              <View className={styles.detailItem}>
                <Text className={styles.detailLabel}>交货日期</Text>
                <Text className={styles.detailValue}>{order.deliveryDate}</Text>
              </View>
              {order.batchNo && (
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>批次号</Text>
                  <Text className={styles.detailValue}>{order.batchNo}</Text>
                </View>
              )}
              <View className={styles.detailItem}>
                <Text className={styles.detailLabel}>备注</Text>
                <Text className={styles.detailValue}>{order.remark || '无'}</Text>
              </View>
            </View>

            <View className={styles.orderActions}>
              <View className={styles.actionBtn}>查看详情</View>
              <View className={classnames(styles.actionBtn, styles.primary)}>联系客户</View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderSalesTab = () => {
    const maxAmount = Math.max(...salesStats.map(s => s.amount))

    return (
      <View>
        <View className={styles.salesChart}>
          <Text className={styles.chartTitle}>销售趋势</Text>
          <View className={styles.chartBars}>
            {salesStats.map((item, index) => (
              <View key={index} className={styles.chartBar}>
              <Text className={styles.barValue}>{item.amount}万</Text>
                <View
                  className={styles.barFill}
                  style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                />
                <Text className={styles.barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>产销台账</Text>
          <Text className={styles.sectionMore}>查看全部</Text>
        </View>

        <View className={styles.salesList}>
          {salesRecords.map((record: SalesRecord) => (
            <View
              key={record.id}
              className={styles.salesItem}
              onClick={() => {
                const order = orders.find(o => o.id === record.id)
                if (order) {
                  Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` })
                }
              }}
            >
              <View className={styles.salesLeft}>
                <Text className={styles.salesHerb}>{record.herbType}</Text>
                <Text className={styles.salesInfo}>
                  {record.customer} · {record.quantity}{record.unit}
                </Text>
                <Text className={styles.salesInfo}>批次：{record.batchNo}</Text>
              </View>
              <View className={styles.salesRight}>
                <Text className={styles.salesAmount}>¥{formatCurrency(record.amount)}</Text>
                <Text className={styles.salesDate}>{record.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>订单销售</Text>
        <Text className={styles.subtitle}>药企订单管理 · 产销台账记录</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.tabBar}>
        {[
          { key: 'order', label: '药企订单' },
          { key: 'sales', label: '产销台账' }
        ].map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, { [styles.active]: activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key as TabType)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {activeTab === 'order' && renderOrderTab()}
      {activeTab === 'sales' && renderSalesTab()}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default OrderPage
