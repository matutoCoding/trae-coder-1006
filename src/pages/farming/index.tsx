import React, { useState } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import { seedlingList, farmRecordList, pestRecordList, farmingStats } from '@/data/farming'
import { SeedlingInfo, FarmRecord, PestRecord } from '@/types'
import { getStatusText } from '@/utils'

type TabType = 'seedling' | 'farm' | 'pest'

const FarmingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('seedling')
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'success' })
    }, 1000)
  }

  const handleAdd = () => {
    console.log('[Farming] 新增记录')
    const tabNames: Record<TabType, string> = {
      seedling: '种苗',
      farm: '农事',
      pest: '病虫防治'
    }
    Taro.showToast({ title: `新增${tabNames[activeTab]}记录`, icon: 'none' })
  }

  const renderSeedlingTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>种苗管理</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {seedlingList.map((seedling: SeedlingInfo) => (
          <View
            key={seedling.id}
            className={styles.card}
            onClick={() => {
              console.log('[Farming] 点击种苗:', seedling.name)
              Taro.showToast({ title: seedling.name, icon: 'none' })
            }}
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
    </View>
  )

  const renderFarmTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>农事记录</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {farmRecordList.map((record: FarmRecord) => (
          <View
            key={record.id}
            className={styles.card}
            onClick={() => {
              console.log('[Farming] 点击农事记录:', record.id)
              Taro.showToast({ title: record.description, icon: 'none' })
            }}
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
    </View>
  )

  const renderPestTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>病虫防治</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {pestRecordList.map((record: PestRecord) => (
          <View
            key={record.id}
            className={styles.card}
            onClick={() => {
              console.log('[Farming] 点击病虫记录:', record.name)
              Taro.showToast({ title: record.name, icon: 'none' })
            }}
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
    </View>
  )

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>农事管理</Text>
        <Text className={styles.subtitle}>绿色防控 · 科学种植 · 全程可追溯</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={farmingStats} />
      </View>

      <View className={styles.tabBar}>
        {[
          { key: 'seedling', label: '种苗管理' },
          { key: 'farm', label: '农事记录' },
          { key: 'pest', label: '病虫防治' }
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

      {activeTab === 'seedling' && renderSeedlingTab()}
      {activeTab === 'farm' && renderFarmTab()}
      {activeTab === 'pest' && renderPestTab()}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default FarmingPage
