import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { QualityTest, TestItem } from '@/types'
import { getStatusText } from '@/utils'

type TabType = 'test' | 'trace'

const QualityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('test')
  const [refreshing, setRefreshing] = useState(false)
  const qualityTests = useAppStore(state => state.qualityTests)

  const stats = useMemo(() => {
    const passCount = qualityTests.filter(t => t.overallResult === 'pass').length
    const pendingCount = qualityTests.filter(t => t.overallResult === 'pending').length
    const totalItems = qualityTests.reduce((sum, t) => sum + t.testItems.length, 0)
    const herbTypes = new Set(qualityTests.map(t => t.herbType)).size
    return [
      { label: '检测批次', value: qualityTests.length, unit: '批' },
      { label: '合格批次', value: passCount, unit: '批' },
      { label: '检测项目', value: totalItems, unit: '项' },
      { label: '覆盖品种', value: herbTypes, unit: '种' },
    ]
  }, [qualityTests])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleAdd = () => {
    if (activeTab === 'test') {
      Taro.navigateTo({ url: '/pages/quality-form/index?mode=add' })
    } else {
      Taro.showToast({ title: '新增溯源批次', icon: 'none' })
    }
  }

  const handleTestClick = (test: QualityTest) => {
    Taro.navigateTo({ url: `/pages/quality-detail/index?id=${test.id}` })
  }

  const getCategoryText = (category: string) => {
    const map: Record<string, string> = {
      pesticide: '农残',
      heavyMetal: '重金属',
      microbe: '微生物',
      other: '其他'
    }
    return map[category] || category
  }

  const renderTestTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>检测记录</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {qualityTests.map((test: QualityTest) => (
          <View
            key={test.id}
            className={styles.card}
            onClick={() => handleTestClick(test)}
          >
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.cardTitle}>{test.herbType}</Text>
                <Text className={styles.cardSubtitle}>批次：{test.batchNo}</Text>
              </View>
              <StatusTag status={test.overallResult} />
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>检测日期</Text>
                <Text className={styles.infoValue}>{test.testDate}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>检验员</Text>
                <Text className={styles.infoValue}>{test.tester}</Text>
              </View>
              <View className={styles.infoItem} style={{ flex: 2, minWidth: '100%' }}>
                <Text className={styles.infoLabel}>检测项目</Text>
                <Text className={styles.infoValue}>
                  {test.testItems.filter(item => item.category === 'pesticide').length}项农残 + 
                  {test.testItems.filter(item => item.category === 'heavyMetal').length}项重金属
                </Text>
              </View>
            </View>

            <View className={styles.testItems}>
              {test.testItems.slice(0, 3).map((item: TestItem, index: number) => (
                <View key={index} className={styles.testItem}>
                  <View className={styles.testItemLeft}>
                    <Text className={styles.testItemName}>
                      <Text className={classnames(styles.categoryTag, styles[item.category])}>
                        {getCategoryText(item.category)}
                      </Text>
                      {item.name}
                    </Text>
                    <Text className={styles.testItemStandard}>标准：{item.standard}</Text>
                  </View>
                  <View className={styles.testItemResult}>
                    <Text className={styles.testResultValue}>{item.result}</Text>
                    <Text className={classnames(styles.testResultStatus, test.overallResult === 'pending' ? styles.pending : item.isPass ? styles.pass : styles.fail)}>
                      {test.overallResult === 'pending' ? '检测中' : item.isPass ? '合格' : '不合格'}
                    </Text>
                  </View>
                </View>
              ))}
              {test.testItems.length > 3 && (
                <Text style={{ fontSize: '24rpx', color: '#2E7D32', textAlign: 'center', paddingTop: '16rpx' }}>
                  展开全部 {test.testItems.length} 项检测 →
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderTraceTab = () => (
    <View>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>批次溯源</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>
      <View className={styles.cardList}>
        {qualityTests.map(test => (
          <View
            key={test.id}
            className={styles.traceCard}
            onClick={() => handleTestClick(test)}
          >
            <View className={styles.traceHeader}>
              <View>
                <Text className={styles.traceTitle}>{test.herbType}</Text>
                <Text className={styles.traceBatch}>批次：{test.batchNo}</Text>
              </View>
              <StatusTag status={test.overallResult} />
            </View>

            <View className={styles.traceTimeline}>
              <View className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, styles.done)} />
                <View className={styles.timelineContent}>
                  <Text className={styles.timelineTitle}>🌱 种苗溯源</Text>
                  <Text className={styles.timelineDesc}>
                    道地药材种子繁育
                  </Text>
                </View>
              </View>

              <View className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, styles.done)} />
                <View className={styles.timelineContent}>
                  <Text className={styles.timelineTitle}>🌿 种植溯源</Text>
                  <Text className={styles.timelineDesc}>
                    GAP规范化种植
                  </Text>
                </View>
              </View>

              <View className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, styles.done)} />
                <View className={styles.timelineContent}>
                  <Text className={styles.timelineTitle}>📝 农事记录</Text>
                  <Text className={styles.timelineDesc}>
                    全程可追溯农事记录
                  </Text>
                </View>
              </View>

              <View className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, styles.done)} />
                <View className={styles.timelineContent}>
                  <Text className={styles.timelineTitle}>🌻 采收加工</Text>
                  <Text className={styles.timelineDesc}>
                    道地采收 · 产地初加工
                  </Text>
                </View>
              </View>

              <View className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, test.overallResult !== 'pending' ? styles.done : '')} />
                <View className={styles.timelineContent}>
                  <Text className={styles.timelineTitle}>✅ 质量检测</Text>
                  <Text className={styles.timelineDesc}>
                    检测结果：{getStatusText(test.overallResult)}
                  </Text>
                </View>
              </View>
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
        <Text className={styles.title}>质量检测</Text>
        <Text className={styles.subtitle}>农残重金属检测 · 批次溯源可查</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={stats} />
      </View>

      <View className={styles.tabBar}>
        {[
          { key: 'test', label: '质量检测' },
          { key: 'trace', label: '批次溯源' }
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

      {activeTab === 'test' && renderTestTab()}
      {activeTab === 'trace' && renderTraceTab()}

      <View className={styles.fab} onClick={handleAdd}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default QualityPage
