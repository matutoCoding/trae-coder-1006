import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { QualityTest } from '@/types'
import { getStatusText } from '@/utils'

const QualityDetailPage: React.FC = () => {
  const router = useRouter()
  const id = router.params.id || ''

  const getQualityTestById = useAppStore(state => state.getQualityTestById)
  const harvestRecords = useAppStore(state => state.harvestRecords)
  const processingRecords = useAppStore(state => state.processingRecords)
  const farmRecords = useAppStore(state => state.farmRecords)
  const pestRecords = useAppStore(state => state.pestRecords)
  const orders = useAppStore(state => state.orders)
  const fields = useAppStore(state => state.fields)

  const [test, setTest] = useState<QualityTest | null>(null)

  useEffect(() => {
    if (id) {
      const data = getQualityTestById(id)
      if (data) {
        setTest(data)
      }
    }
  }, [id, getQualityTestById])

  if (!test) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    )
  }

  const pesticideItems = test.testItems.filter(item => item.category === 'pesticide')
  const heavyMetalItems = test.testItems.filter(item => item.category === 'heavyMetal')
  const microbeItems = test.testItems.filter(item => item.category === 'microbe')
  const otherItems = test.testItems.filter(item => item.category === 'other')

  const passCount = test.testItems.filter(item => item.isPass).length
  const totalCount = test.testItems.length

  const harvestRecord = harvestRecords.find(h => h.fieldName.includes(test.herbType))
  const fieldInfo = fields.find(f => f.herbType === test.herbType)

  const relatedOrders = orders.filter(o => o.batchNo === test.batchNo)

  const traceSteps = [
    {
      title: '种苗培育',
      time: fieldInfo?.plantDate ? `${fieldInfo.plantDate} 定植` : '',
      desc: `${test.herbType} 种苗，品种纯正，道地药材繁育基地培育`,
      done: true
    },
    {
      title: '种植管理',
      time: fieldInfo?.plantDate ? `定植于 ${fieldInfo.plantDate}` : '',
      desc: `地块：${fieldInfo?.name || '待关联'}，土壤类型：${fieldInfo?.soilType || '待记录'}，生长年限：${fieldInfo?.growthYears || 0}年`,
      done: true
    },
    {
      title: '农事作业',
      time: farmRecords.length > 0 ? `${farmRecords.length} 条农事记录` : '',
      desc: farmRecords.length > 0
        ? `施肥 ${farmRecords.filter(r => r.type === 'fertilize').length}次，灌溉 ${farmRecords.filter(r => r.type === 'irrigate').length}次，其他农事 ${farmRecords.filter(r => !['fertilize', 'irrigate'].includes(r.type)).length}次`
        : '暂无农事记录',
      done: true
    },
    {
      title: '病虫防治',
      time: pestRecords.length > 0 ? `${pestRecords.length} 条防治记录` : '',
      desc: pestRecords.length > 0
        ? `绿色防控为主，综合防治率 100%，农残控制符合 GAP 标准`
        : '无病虫害发生',
      done: true
    },
    {
      title: '采收加工',
      time: harvestRecord ? harvestRecord.harvestDate : '待采收',
      desc: harvestRecord
        ? `${harvestRecord.fieldName} 采收，产量 ${harvestRecord.yield}${harvestRecord.unit}，品质：${getStatusText(harvestRecord.quality)}`
        : '暂无采收记录',
      done: !!harvestRecord
    },
    {
      title: '质量检测',
      time: test.testDate,
      desc: `检测 ${totalCount} 项，合格 ${passCount} 项，综合判定：${getStatusText(test.overallResult)}`,
      done: test.overallResult !== 'pending'
    },
    {
      title: '订单销售',
      time: relatedOrders.length > 0 ? `${relatedOrders.length} 个订单` : '',
      desc: relatedOrders.length > 0
        ? `客户：${relatedOrders.map(o => o.customer).join('、')}`
        : '暂无订单',
      done: relatedOrders.length > 0 && relatedOrders.some(o => o.status === 'completed')
    }
  ]

  const renderTestCategory = (title: string, items: typeof test.testItems) => {
    if (items.length === 0) return null
    return (
      <View className={styles.testCategory}>
        <Text className={styles.categoryTitle}>{title}</Text>
        <View className={styles.testItemList}>
          {items.map((item, index) => (
            <View key={index} className={styles.testItemRow}>
              <Text className={styles.itemName}>{item.name}</Text>
              <Text className={styles.itemResult}>{item.result}</Text>
              <Text className={styles.itemStatus}>
                {item.isPass ? '✅' : '❌'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.batchNo}>批次号 {test.batchNo}</Text>
        <Text className={styles.title}>{test.herbType}</Text>
        <Text className={classnames(styles.resultTag, styles[test.overallResult])}>
          {getStatusText(test.overallResult)}
        </Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          检测概览
          <Text className={styles.passCount}>
            {passCount}/{totalCount} 项合格
          </Text>
        </Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.label}>检测日期</Text>
            <Text className={styles.value}>{test.testDate}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>检测员</Text>
            <Text className={styles.value}>{test.tester}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>检测项目</Text>
            <Text className={styles.value}>{totalCount} 项</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.label}>合格率</Text>
            <Text className={styles.value}>{Math.round(passCount / totalCount * 100)}%</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>检测明细</Text>
        {renderTestCategory('农药残留', pesticideItems)}
        {renderTestCategory('重金属', heavyMetalItems)}
        {renderTestCategory('微生物', microbeItems)}
        {renderTestCategory('其他项目', otherItems)}
      </View>

      <View className={styles.timelineSection}>
        <Text className={styles.sectionTitle}>溯源链路</Text>
        <View className={styles.timeline}>
          {traceSteps.map((step, index) => (
            <View key={index} className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, { [styles.done]: step.done })} />
              <View className={styles.timelineContent}>
                <Text className={styles.timelineTitle}>{step.title}</Text>
                {step.time && <Text className={styles.timelineTime}>{step.time}</Text>}
                <Text className={styles.timelineDesc}>{step.desc}</Text>
                {step.done && <Text className={styles.timelineTag}>已完成</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>

      {test.remark && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>备注</Text>
          <Text style={{ fontSize: '28rpx', color: '#666', lineHeight: 1.6 }}>
            {test.remark}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default QualityDetailPage
