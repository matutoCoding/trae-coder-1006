import React, { useState, useEffect, useMemo } from 'react'
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
  const getHarvestByBatchNo = useAppStore(state => state.getHarvestByBatchNo)
  const getProcessingByBatchNo = useAppStore(state => state.getProcessingByBatchNo)
  const getOrdersByBatchNo = useAppStore(state => state.getOrdersByBatchNo)
  const getInventoryByBatchNo = useAppStore(state => state.getInventoryByBatchNo)
  const getFieldById = useAppStore(state => state.getFieldById)
  const getSeedlingByFieldId = useAppStore(state => state.getSeedlingByFieldId)
  const getFlowsByBatchNo = useAppStore(state => state.getFlowsByBatchNo)
  const farmRecords = useAppStore(state => state.farmRecords)
  const pestRecords = useAppStore(state => state.pestRecords)

  const [test, setTest] = useState<QualityTest | null>(null)

  useEffect(() => {
    if (id) {
      const data = getQualityTestById(id)
      if (data) {
        setTest(data)
      }
    }
  }, [id, getQualityTestById])

  const batchData = useMemo(() => {
    if (!test) return null

    const harvestRecord = getHarvestByBatchNo(test.batchNo)
    const processingRecords = getProcessingByBatchNo(test.batchNo)
    const relatedOrders = getOrdersByBatchNo(test.batchNo)
    const inventory = getInventoryByBatchNo(test.batchNo)
    const fieldInfo = harvestRecord ? getFieldById(harvestRecord.fieldId) : undefined
    const seedlingInfo = harvestRecord ? getSeedlingByFieldId(harvestRecord.fieldId) : undefined

    const fieldFarmRecords = harvestRecord
      ? farmRecords.filter(r => r.fieldId === harvestRecord.fieldId)
      : []
    const fieldPestRecords = harvestRecord
      ? pestRecords.filter(r => r.fieldId === harvestRecord.fieldId)
      : []

    const flows = test ? getFlowsByBatchNo(test.batchNo) : []

    return {
      harvestRecord,
      processingRecords,
      relatedOrders,
      inventory,
      fieldInfo,
      seedlingInfo,
      fieldFarmRecords,
      fieldPestRecords,
      flows,
    }
  }, [test, getHarvestByBatchNo, getProcessingByBatchNo, getOrdersByBatchNo, getInventoryByBatchNo, getFieldById, getSeedlingByFieldId, getFlowsByBatchNo, farmRecords, pestRecords])

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

  const harvest = batchData?.harvestRecord
  const field = batchData?.fieldInfo
  const seedling = batchData?.seedlingInfo
  const processingList = batchData?.processingRecords || []
  const orders = batchData?.relatedOrders || []
  const inventory = batchData?.inventory
  const farmList = batchData?.fieldFarmRecords || []
  const pestList = batchData?.fieldPestRecords || []

  const traceSteps = [
    {
      title: '种苗培育',
      time: seedling ? `${seedling.nurseryDate} 育苗` : '',
      desc: seedling
        ? `${seedling.name}，品种：${seedling.variety}，来源：${seedling.source}`
        : '暂无种苗记录',
      done: !!seedling
    },
    {
      title: '种植管理',
      time: field?.plantDate ? `定植于 ${field.plantDate}` : '',
      desc: field
        ? `地块：${field.name}，面积：${field.area}亩，土壤：${field.soilType}，生长年限：${field.growthYears}年`
        : '暂无地块信息',
      done: !!field
    },
    {
      title: '农事作业',
      time: farmList.length > 0 ? `${farmList.length} 条农事记录` : '',
      desc: farmList.length > 0
        ? `施肥 ${farmList.filter(r => r.type === 'fertilize').length}次，灌溉 ${farmList.filter(r => r.type === 'irrigate').length}次，其他农事 ${farmList.filter(r => !['fertilize', 'irrigate'].includes(r.type)).length}次`
        : '暂无农事记录',
      done: farmList.length > 0
    },
    {
      title: '病虫防治',
      time: pestList.length > 0 ? `${pestList.length} 条防治记录` : '',
      desc: pestList.length > 0
        ? `病害 ${pestList.filter(r => r.type === 'disease').length}次，虫害 ${pestList.filter(r => r.type === 'pest').length}次，绿色防控为主`
        : '无病虫害发生',
      done: true
    },
    {
      title: '采收加工',
      time: harvest ? harvest.harvestDate : '待采收',
      desc: harvest
        ? `${harvest.fieldName} 采收，产量 ${harvest.yield}${harvest.unit}，品质：${getStatusText(harvest.quality)}，加工：${processingList.length}道工序`
        : '暂无采收记录',
      done: !!harvest
    },
    {
      title: '质量检测',
      time: test.testDate,
      desc: `检测 ${totalCount} 项，合格 ${passCount} 项，综合判定：${getStatusText(test.overallResult)}`,
      done: test.overallResult !== 'pending'
    },
    {
      title: '订单销售',
      time: orders.length > 0 ? `${orders.length} 个订单` : '',
      desc: orders.length > 0
        ? `客户：${orders.map(o => o.customer).join('、')}，库存可售：${inventory?.availableQty || 0}${inventory?.unit || 'kg'}`
        : '暂无订单',
      done: orders.length > 0 && orders.some(o => o.status === 'completed')
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
              <Text className={styles.itemStandard}>{item.standard}</Text>
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

      {inventory && (
        <View className={styles.inventoryCard}>
          <View className={styles.invItem}>
            <Text className={styles.invLabel}>库存总量</Text>
            <Text className={styles.invValue}>{inventory.totalQty} {inventory.unit}</Text>
          </View>
          <View className={styles.invItem}>
            <Text className={styles.invLabel}>可售数量</Text>
            <Text className={classnames(styles.invValue, styles.invAvail)}>{inventory.availableQty} {inventory.unit}</Text>
          </View>
          <View className={styles.invItem}>
            <Text className={styles.invLabel}>已预留</Text>
            <Text className={styles.invValue}>{inventory.reservedQty} {inventory.unit}</Text>
          </View>
        </View>
      )}

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

      {batchData?.flows && batchData.flows.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📦 出入库流水</Text>
          <View className={styles.flowList}>
            {batchData.flows.map(flow => (
              <View key={flow.id} className={styles.flowItem}>
                <View className={classnames(styles.flowIcon, styles[`flow-${flow.type}`])}>
                  {flow.type === 'in' && '⬇️'}
                  {flow.type === 'reserve' && '🔒'}
                  {flow.type === 'release' && '🔓'}
                  {flow.type === 'deduct' && '⬆️'}
                  {flow.type === 'adjust' && '🔄'}
                </View>
                <View className={styles.flowContent}>
                  <View className={styles.flowTop}>
                    <Text className={styles.flowType}>
                      {flow.type === 'in' && '采收入库'}
                      {flow.type === 'reserve' && '订单预留'}
                      {flow.type === 'release' && '库存释放'}
                      {flow.type === 'deduct' && '发货扣减'}
                      {flow.type === 'adjust' && '库存调整'}
                    </Text>
                    <Text className={styles.flowTime}>{flow.operateTime}</Text>
                  </View>
                  <Text className={styles.flowRemark}>{flow.remark}</Text>
                  <View className={styles.flowQty}>
                    <Text className={classnames(styles.flowDelta, styles[`flow-delta-${flow.type}`])}>
                      {flow.type === 'in' ? '+' : flow.type === 'release' ? '+' : '-'}
                      {flow.quantity}{flow.unit}
                    </Text>
                    <Text className={styles.flowAfter}>
                      余 {flow.afterQty.available}{flow.unit} / 总 {flow.afterQty.total}{flow.unit}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

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
