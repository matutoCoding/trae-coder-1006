import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { HarvestRecord } from '@/types'
import { getStatusText } from '@/utils'

type TabType = 'harvest' | 'process'

const HarvestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('harvest')
  const [refreshing, setRefreshing] = useState(false)
  const harvestRecords = useAppStore(state => state.harvestRecords)
  const processingRecords = useAppStore(state => state.processingRecords)

  const stats = useMemo(() => {
    const thisYear = new Date().getFullYear()
    const yearRecords = harvestRecords.filter(r => r.harvestDate.startsWith(String(thisYear)))
    const totalYield = yearRecords.reduce((sum, r) => sum + r.yield, 0)
    const processingCount = yearRecords.filter(r => r.processingStatus !== 'finished').length
    const excellentRate = yearRecords.length > 0
      ? Math.round(yearRecords.filter(r => r.quality === 'excellent').length / yearRecords.length * 100)
      : 0
    return [
      { label: '今年采收', value: yearRecords.length, unit: '批次' },
      { label: '总产量', value: totalYield, unit: 'kg' },
      { label: '加工中', value: processingCount, unit: '批次' },
      { label: '优级品率', value: excellentRate, unit: '%' }
    ]
  }, [harvestRecords])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    if (activeTab === 'harvest') {
      Taro.navigateTo({ url: '/pages/harvest-form/index?mode=add' })
    } else {
      Taro.showToast({ title: '新增加工记录', icon: 'none' })
    }
  }

  const handleHarvestClick = (record: HarvestRecord) => {
    Taro.navigateTo({ url: `/pages/harvest-form/index?mode=edit&id=${record.id}` })
  }

  const getProcessingSteps = (status: string) => {
    const steps = [
      { key: 'raw', title: '采收', desc: '原药材采收', icon: '🌿' },
      { key: 'drying', title: '晾晒', desc: '自然晾晒阴干', icon: '☀️' },
      { key: 'sliced', title: '切片', desc: '精选切片加工', icon: '🔪' },
      { key: 'finished', title: '成品', desc: '检验合格入库', icon: '✅' }
    ]
    const stepOrder = ['raw', 'drying', 'sliced', 'finished']
    const currentIndex = stepOrder.indexOf(status)
    return steps.map((step, index) => ({
      ...step,
      status: index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending'
    }))
  }

  const renderHarvestTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>采收计划</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {harvestRecords.map((record: HarvestRecord) => (
          <View
            key={record.id}
            className={styles.card}
            onClick={() => handleHarvestClick(record)}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{record.herbType}</Text>
                <Text className={styles.cardSubtitle}>{record.fieldName}</Text>
              </View>
              <StatusTag status={record.processingStatus} />
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>预计产量</Text>
                <View>
                  <Text className={styles.yieldValue}>
                    {record.yield > 0 ? record.yield : '预计'}
                  </Text>
                  <Text className={styles.yieldUnit}>{record.unit}</Text>
                </View>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>采收时间</Text>
                <Text className={styles.infoValue}>{record.harvestDate}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>生长年限</Text>
                <Text className={classnames(styles.infoValue, styles.growthYears)}>
                  {record.growthYears}年生
                </Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>品质等级</Text>
                <Text className={classnames(styles.qualityTag, styles[record.quality])}>
                  {getStatusText(record.quality)}
                </Text>
              </View>
            </View>

            <View className={styles.cardFooter}>
              <Text className={styles.operator}>负责人：{record.operator}</Text>
              <Text className={styles.dateText}>{record.harvestDate}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderProcessTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>加工进度</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {processingRecords.map(item => (
          <View
            key={item.id}
            className={styles.card}
            onClick={() => {
              Taro.showToast({ title: item.batchNo, icon: 'none' })
            }}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{item.herbType}</Text>
                <Text className={styles.batchNo}>批次：{item.batchNo}</Text>
              </View>
              <StatusTag status={item.status} />
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>加工类型</Text>
                <Text className={styles.infoValue}>{item.processType}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>投入量</Text>
                <Text className={styles.infoValue}>{item.inputQty}kg</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>产出量</Text>
                <Text className={styles.infoValue}>
                  {item.outputQty > 0 ? `${item.outputQty}kg` : '加工中'}
                </Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>负责人</Text>
                <Text className={styles.infoValue}>{item.operator}</Text>
              </View>
            </View>

            <View className={styles.cardFooter}>
              <Text className={styles.dateText}>开始：{item.startTime}</Text>
              {item.endTime && (
                <Text className={styles.dateText}>结束：{item.endTime}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>加工流程</Text>
      </View>
      <View className={styles.cardList}>
        <View className={styles.card}>
          {getProcessingSteps('sliced').map((step, index) => (
            <View key={index} className={styles.processStep}>
              <View
                className={classnames(styles.stepIcon, {
                  [styles.done]: step.status === 'done',
                  [styles.active]: step.status === 'active'
                })}
              >
                {step.status === 'done' ? '✓' : step.icon}
              </View>
              <View className={styles.stepContent}>
                <Text className={styles.stepTitle}>{step.title}</Text>
                <Text className={styles.stepDesc}>{step.desc}</Text>
              </View>
              {step.status !== 'pending' && (
                <Text className={styles.stepDate}>进行中</Text>
              )}
            </View>
          ))}
        </View>
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
        <Text className={styles.title}>采收加工</Text>
        <Text className={styles.subtitle}>道地采收 · 产地初加工 · 保证品质</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.tabBar}>
        {[
          { key: 'harvest', label: '采收管理' },
          { key: 'process', label: '加工进度' }
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

      {activeTab === 'harvest' && renderHarvestTab()}
      {activeTab === 'process' && renderProcessTab()}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default HarvestPage
