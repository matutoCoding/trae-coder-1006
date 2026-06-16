import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { PestRecord } from '@/types'
import { getStatusText } from '@/utils'

const PestPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const pestRecords = useAppStore(state => state.pestRecords)

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const thisMonthRecords = pestRecords.filter(r => r.date.startsWith(thisMonth))
    const treatedCount = thisMonthRecords.filter(r => r.status === 'treated' || r.status === 'resolved').length
    const monitoringCount = thisMonthRecords.filter(r => r.status === 'monitoring').length
    const fieldIds = new Set(thisMonthRecords.map(r => r.fieldId))
    return [
      { label: '本月病虫', value: thisMonthRecords.length, unit: '起' },
      { label: '已处理', value: treatedCount, unit: '起' },
      { label: '观察中', value: monitoringCount, unit: '起' },
      { label: '涉及地块', value: fieldIds.size, unit: '块' },
    ]
  }, [pestRecords])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/pest-form/index?mode=add' })
  }

  const handleItemClick = (record: PestRecord) => {
    Taro.navigateTo({ url: `/pages/pest-form/index?mode=edit&id=${record.id}` })
  }

  const filteredList = filterType === 'all'
    ? pestRecords
    : pestRecords.filter(r => r.type === filterType)

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>病虫防治</Text>
        <Text className={styles.subtitle}>绿色防控 · 科学防治 · 降低农残</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.filterBar}>
        {[
          { key: 'all', label: '全部' },
          { key: 'disease', label: '病害' },
          { key: 'pest', label: '虫害' },
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
        {filteredList.map((record: PestRecord) => (
          <View
            key={record.id}
            className={styles.card}
            onClick={() => handleItemClick(record)}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{record.name}</Text>
                <Text className={styles.cardSubtitle}>{record.fieldName}</Text>
              </View>
              <StatusTag status={record.status} />
            </View>

            <View className={classnames(styles.pestBadge, styles[record.type])}>
              {getStatusText(record.type)}
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>严重程度</Text>
                <Text className={classnames(styles.severityTag, styles[record.severity])}>
                  {getStatusText(record.severity)}
                </Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>发生日期</Text>
                <Text className={styles.infoValue}>{record.date}</Text>
              </View>
              <View className={styles.infoItem} style={{ flex: 2, minWidth: '100%' }}>
                <Text className={styles.infoLabel}>防治方法</Text>
                <Text className={styles.infoValue}>{record.method}</Text>
              </View>
              {record.pesticide && (
                <View className={styles.infoItem} style={{ flex: 2, minWidth: '100%' }}>
                  <Text className={styles.infoLabel}>用药情况</Text>
                  <Text className={styles.infoValue}>{record.pesticide}</Text>
                </View>
              )}
            </View>

            <View className={styles.cardFooter}>
              <Text className={styles.operator}>负责人：{record.operator}</Text>
              <Text className={styles.dateText}>{record.date}</Text>
            </View>
          </View>
        ))}
      </View>

      {filteredList.length === 0 && (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🐛</Text>
          <Text className={styles.emptyText}>暂无病虫记录</Text>
        </View>
      )}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default PestPage
