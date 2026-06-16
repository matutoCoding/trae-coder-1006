import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { SeedlingInfo } from '@/types'
import { getStatusText } from '@/utils'

const seedlingStatsData = [
  { label: '种苗总数', value: '20.5', unit: '万株' },
  { label: '在作品种', value: 5, unit: '种' },
  { label: '可供移栽', value: '5.5', unit: '万株' },
  { label: '优级种苗', value: 3, unit: '批' },
]

const SeedlingPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const seedlings = useAppStore(state => state.seedlings)

  const stats = useMemo(() => {
    const total = seedlings.reduce((sum, s) => sum + s.quantity, 0)
    const available = seedlings.filter(s => s.status === 'available').reduce((sum, s) => sum + s.quantity, 0)
    const excellent = seedlings.filter(s => s.quality === 'excellent').length
    const varieties = new Set(seedlings.map(s => s.name)).size
    return [
      { label: '种苗总数', value: (total / 10000).toFixed(1), unit: '万株' },
      { label: '在作品种', value: varieties, unit: '种' },
      { label: '可供移栽', value: (available / 10000).toFixed(1), unit: '万株' },
      { label: '优级种苗', value: excellent, unit: '批' },
    ]
  }, [seedlings])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/seedling-form/index?mode=add' })
  }

  const handleItemClick = (seedling: SeedlingInfo) => {
    Taro.navigateTo({ url: `/pages/seedling-form/index?mode=edit&id=${seedling.id}` })
  }

  const filteredList = filterStatus === 'all'
    ? seedlings
    : seedlings.filter(s => s.status === filterStatus)

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>种苗管理</Text>
        <Text className={styles.subtitle}>道地种苗繁育 · 品质溯源</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.filterBar}>
        {[
          { key: 'all', label: '全部' },
          { key: 'nursery', label: '育苗中' },
          { key: 'available', label: '可供应' },
          { key: 'transplanted', label: '已移栽' },
        ].map(item => (
          <Text
            key={item.key}
            className={classnames(styles.filterItem, { [styles.active]: filterStatus === item.key })}
            onClick={() => setFilterStatus(item.key)}
          >
            {item.label}
          </Text>
        ))}
      </View>

      <View className={styles.cardList}>
        {filteredList.map((seedling: SeedlingInfo) => (
          <View
            key={seedling.id}
            className={styles.card}
            onClick={() => handleItemClick(seedling)}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{seedling.name}</Text>
                <Text className={styles.cardSubtitle}>{seedling.variety}</Text>
              </View>
              <StatusTag status={seedling.status} />
            </View>

            <View className={classnames(styles.qualityTag, styles[seedling.quality])}>
              {getStatusText(seedling.quality)}品质
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>来源</Text>
                <Text className={styles.infoValue}>{seedling.source}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>数量</Text>
                <Text className={styles.infoValue}>{(seedling.quantity / 10000).toFixed(1)}万株</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>育苗日期</Text>
                <Text className={styles.infoValue}>{seedling.nurseryDate}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {filteredList.length === 0 && (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🌱</Text>
          <Text className={styles.emptyText}>暂无种苗记录</Text>
        </View>
      )}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default SeedlingPage
