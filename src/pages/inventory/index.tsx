import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import { useAppStore } from '@/store'
import { InventoryBatch } from '@/types'
import { getStatusText } from '@/utils'

type FilterType = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

const InventoryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [refreshing, setRefreshing] = useState(false)
  const inventoryBatches = useAppStore(state => state.inventoryBatches)

  const stats = useMemo(() => {
    const totalQty = inventoryBatches.reduce((sum, b) => sum + b.totalQty, 0)
    const availableQty = inventoryBatches.reduce((sum, b) => sum + b.availableQty, 0)
    const lowStockCount = inventoryBatches.filter(b => b.status === 'low_stock').length
    const outOfStockCount = inventoryBatches.filter(b => b.status === 'out_of_stock').length
    return [
      { label: '库存批次', value: inventoryBatches.length, unit: '批' },
      { label: '总库存量', value: totalQty, unit: 'kg' },
      { label: '可售数量', value: availableQty, unit: 'kg' },
      { label: '库存预警', value: lowStockCount + outOfStockCount, unit: '批' },
    ]
  }, [inventoryBatches])

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return inventoryBatches
    return inventoryBatches.filter(b => b.status === activeFilter)
  }, [inventoryBatches, activeFilter])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    Taro.showToast({ title: '新增入库', icon: 'none' })
  }

  const handleBatchClick = (batch: InventoryBatch) => {
    const qualityTest = useAppStore.getState().getQualityTestByBatchNo(batch.batchNo)
    if (qualityTest) {
      Taro.navigateTo({ url: `/pages/quality-detail/index?id=${qualityTest.id}` })
    } else {
      Taro.showToast({ title: '暂无检测报告', icon: 'none' })
    }
  }

  const getStatusTextZh = (status: string) => {
    const map: Record<string, string> = {
      in_stock: '库存充足',
      low_stock: '库存偏低',
      out_of_stock: '已售罄',
    }
    return map[status] || status
  }

  const getProgressClass = (rate: number) => {
    if (rate > 0.5) return 'high'
    if (rate > 0.2) return 'medium'
    return 'low'
  }

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'in_stock', label: '充足' },
    { key: 'low_stock', label: '偏低' },
    { key: 'out_of_stock', label: '售罄' },
  ]

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>库存管理</Text>
        <Text className={styles.subtitle}>批次余量 · 库存预警 · 出入库记录</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.filterBar}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterItem, { [styles.active]: activeFilter === f.key })}
            onClick={() => setActiveFilter(f.key as FilterType)}
          >
            {f.label}
          </View>
        ))}
      </View>

      <View className={styles.cardList}>
        {filteredList.map((batch: InventoryBatch) => {
          const availableRate = batch.totalQty > 0 ? batch.availableQty / batch.totalQty : 0
          return (
            <View
              key={batch.id}
              className={styles.inventoryCard}
              onClick={() => handleBatchClick(batch)}
            >
              <View className={styles.cardHeader}>
                <View>
                  <Text className={styles.cardTitle}>{batch.herbType}</Text>
                  <Text className={styles.cardBatch}>批次：{batch.batchNo}</Text>
                </View>
                <Text className={classnames(styles.statusTag, styles[batch.status])}>
                  {getStatusTextZh(batch.status)}
                </Text>
              </View>

              <View className={styles.qtyRow}>
                <View className={styles.qtyItem}>
                  <Text className={styles.qtyLabel}>库存总量</Text>
                  <Text className={styles.qtyValue}>{batch.totalQty}</Text>
                  <Text className={styles.qtyUnit}>{batch.unit}</Text>
                </View>
                <View className={styles.qtyItem}>
                  <Text className={styles.qtyLabel}>可售数量</Text>
                  <Text className={classnames(styles.qtyValue, styles.available)}>{batch.availableQty}</Text>
                  <Text className={styles.qtyUnit}>{batch.unit}</Text>
                </View>
                <View className={styles.qtyItem}>
                  <Text className={styles.qtyLabel}>已预留</Text>
                  <Text className={classnames(styles.qtyValue, styles.reserved)}>{batch.reservedQty}</Text>
                  <Text className={styles.qtyUnit}>{batch.unit}</Text>
                </View>
              </View>

              <View className={styles.progressBar}>
                <View
                  className={classnames(styles.progressFill, styles[getProgressClass(availableRate)])}
                  style={{ width: `${availableRate * 100}%` }}
                />
              </View>

              <View className={styles.infoRow}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>品质：</Text>
                  <Text>{getStatusText(batch.quality)}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>来源地块：</Text>
                  <Text>{batch.fieldName}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>入库日期：</Text>
                  <Text>{batch.warehouseDate}</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default InventoryPage
