import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import { useAppStore } from '@/store'
import { FarmRecord } from '@/types'
import { getStatusText } from '@/utils'

const FarmPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const farmRecords = useAppStore(state => state.farmRecords)

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const thisMonthRecords = farmRecords.filter(r => r.date.startsWith(thisMonth))
    const fertilizeCount = thisMonthRecords.filter(r => r.type === 'fertilize').length
    const irrigateCount = thisMonthRecords.filter(r => r.type === 'irrigate').length
    const fieldIds = new Set(thisMonthRecords.map(r => r.fieldId))
    return [
      { label: '本月农事', value: thisMonthRecords.length, unit: '次' },
      { label: '施肥', value: fertilizeCount, unit: '次' },
      { label: '灌溉', value: irrigateCount, unit: '次' },
      { label: '涉及地块', value: fieldIds.size, unit: '块' },
    ]
  }, [farmRecords])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/farm-form/index?mode=add' })
  }

  const handleItemClick = (record: FarmRecord) => {
    Taro.navigateTo({ url: `/pages/farm-form/index?mode=edit&id=${record.id}` })
  }

  const filteredList = filterType === 'all'
    ? farmRecords
    : farmRecords.filter(r => r.type === filterType)

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>农事记录</Text>
        <Text className={styles.subtitle}>科学种植 · 精细管理 · 全程可追溯</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.filterBar}>
        {[
          { key: 'all', label: '全部' },
          { key: 'sowing', label: '播种' },
          { key: 'transplant', label: '移栽' },
          { key: 'fertilize', label: '施肥' },
          { key: 'irrigate', label: '灌溉' },
          { key: 'prune', label: '修剪' },
        ].map(item => (
          <Text
            key={item.key}
            className={classnames(styles.filterItem, { [styles.active]: filterType === item.key })}
            onClick={() => setFilterType(item.key)}
          >
            {item.label}
          </Text>
        ))}
      </View>

      <View className={styles.cardList}>
        {filteredList.map((record: FarmRecord) => (
          <View
            key={record.id}
            className={styles.card}
            onClick={() => handleItemClick(record)}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{record.fieldName}</Text>
                <Text className={styles.cardSubtitle}>{getStatusText(record.type)}</Text>
              </View>
              <Text className={styles.typeBadge}>{getStatusText(record.type)}</Text>
            </View>

            <View className={styles.infoGrid}>
              {record.quantity !== undefined && record.quantity > 0 && (
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>用量</Text>
                  <Text className={styles.infoValue}>{record.quantity} {record.unit}</Text>
                </View>
              )}
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>操作人员</Text>
                <Text className={styles.infoValue}>{record.operator}</Text>
              </View>
              <View className={styles.infoItem} style={{ flex: 2, minWidth: '100%' }}>
                <Text className={styles.infoLabel}>操作说明</Text>
                <Text className={styles.infoValue}>{record.description}</Text>
              </View>
            </View>

            <View className={styles.cardFooter}>
              <Text className={styles.operator}>操作人：{record.operator}</Text>
              <Text className={styles.dateText}>{record.date}</Text>
            </View>
          </View>
        ))}
      </View>

      {filteredList.length === 0 && (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>👨‍🌾</Text>
          <Text className={styles.emptyText}>暂无农事记录</Text>
        </View>
      )}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default FarmPage
