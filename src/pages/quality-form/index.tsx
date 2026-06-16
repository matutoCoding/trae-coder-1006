import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView, Input, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { QualityTest, TestItem, InventoryBatch } from '@/types'

const herbOptions = ['人参', '三七', '天麻', '黄精', '铁皮石斛', '当归', '白术', '其他']
const resultOptions = [
  { value: 'pending', label: '待检测' },
  { value: 'pass', label: '合格' },
  { value: 'fail', label: '不合格' },
]

const defaultTestItems: TestItem[] = [
  { name: '有机磷农药残留', category: 'pesticide', result: '未检出', standard: '≤0.05mg/kg', isPass: true },
  { name: '拟除虫菊酯', category: 'pesticide', result: '未检出', standard: '≤0.1mg/kg', isPass: true },
  { name: '铅(Pb)', category: 'heavyMetal', result: '0.3mg/kg', standard: '≤5.0mg/kg', isPass: true },
  { name: '镉(Cd)', category: 'heavyMetal', result: '0.05mg/kg', standard: '≤0.3mg/kg', isPass: true },
  { name: '砷(As)', category: 'heavyMetal', result: '0.2mg/kg', standard: '≤2.0mg/kg', isPass: true },
  { name: '汞(Hg)', category: 'heavyMetal', result: '0.01mg/kg', standard: '≤0.2mg/kg', isPass: true },
  { name: '铜(Cu)', category: 'heavyMetal', result: '8mg/kg', standard: '≤20mg/kg', isPass: true },
  { name: '菌落总数', category: 'microbe', result: '1000cfu/g', standard: '≤10000cfu/g', isPass: true },
  { name: '大肠杆菌', category: 'microbe', result: '未检出', standard: '不得检出', isPass: true },
  { name: '霉菌和酵母菌', category: 'microbe', result: '50cfu/g', standard: '≤100cfu/g', isPass: true },
  { name: '水分', category: 'other', result: '8.5%', standard: '≤12.0%', isPass: true },
  { name: '灰分', category: 'other', result: '3.2%', standard: '≤5.0%', isPass: true },
  { name: '浸出物', category: 'other', result: '25.6%', standard: '≥15.0%', isPass: true },
]

const QualityFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addQualityTest = useAppStore(state => state.addQualityTest)
  const updateQualityTest = useAppStore(state => state.updateQualityTest)
  const deleteQualityTest = useAppStore(state => state.deleteQualityTest)
  const getQualityTestById = useAppStore(state => state.getQualityTestById)
  const inventoryBatches = useAppStore(state => state.inventoryBatches)
  const harvestRecords = useAppStore(state => state.harvestRecords)

  const batchOptions = useMemo(() => {
    const harvestBatchNos = harvestRecords.filter(h => h.yield > 0).map(h => ({
      batchNo: h.batchNo,
      herbType: h.herbType,
      fieldName: h.fieldName,
      quantity: h.yield,
      unit: h.unit,
      quality: h.quality,
      date: h.harvestDate,
      source: 'harvest',
      label: `${h.batchNo} | ${h.herbType} | ${h.fieldName} (采收)`
    }))
    const invBatchNos = inventoryBatches.map(inv => ({
      batchNo: inv.batchNo,
      herbType: inv.herbType,
      fieldName: inv.fieldName,
      quantity: inv.availableQty,
      unit: inv.unit,
      quality: inv.quality,
      date: inv.warehouseDate,
      source: 'inventory',
      label: `${inv.batchNo} | ${inv.herbType} | ${inv.fieldName} (库存可售${inv.availableQty}${inv.unit})`
    }))
    const merged = new Map()
    invBatchNos.forEach(b => merged.set(b.batchNo, b))
    harvestBatchNos.forEach(b => { if (!merged.has(b.batchNo)) merged.set(b.batchNo, b) })
    return Array.from(merged.values())
  }, [inventoryBatches, harvestRecords])

  const batchLabels = batchOptions.map(b => b.label)

  const selectedBatch = useMemo(() => {
    return formData.batchNo ? batchOptions.find(b => b.batchNo === formData.batchNo) : undefined
  }, [formData.batchNo, batchOptions])

  const [formData, setFormData] = useState<Partial<QualityTest>>({
    batchNo: '',
    herbType: '',
    testDate: '',
    overallResult: 'pending',
    tester: '',
    testItems: defaultTestItems,
    remark: '',
  })

  const [herbIndex, setHerbIndex] = useState(0)
  const [resultIndex, setResultIndex] = useState(0)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (mode === 'edit' && id) {
      const test = getQualityTestById(id)
      if (test) {
        setFormData(test)
        Taro.setNavigationBarTitle({ title: '编辑检测' })
        const hIdx = herbOptions.indexOf(test.herbType)
        if (hIdx >= 0) setHerbIndex(hIdx)
        const rIdx = resultOptions.findIndex(r => r.value === test.overallResult)
        if (rIdx >= 0) setResultIndex(rIdx)
      }
    } else {
      setFormData(prev => ({
        ...prev,
        testDate: today,
      }))
      Taro.setNavigationBarTitle({ title: '新增检测' })
    }
  }, [mode, id, getQualityTestById])

  const handleInputChange = (key: keyof QualityTest, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleHerbChange = (e: any) => {
    const idx = Number(e.detail.value)
    setHerbIndex(idx)
    setFormData(prev => ({ ...prev, herbType: herbOptions[idx] }))
  }

  const handleResultChange = (e: any) => {
    const idx = Number(e.detail.value)
    setResultIndex(idx)
    const result = resultOptions[idx].value as 'pass' | 'fail' | 'pending'
    setFormData(prev => ({ ...prev, overallResult: result }))
  }

  const handleBatchChange = (e: any) => {
    const idx = Number(e.detail.value)
    const batch = batchOptions[idx]
    if (batch) {
      setFormData(prev => ({
        ...prev,
        batchNo: batch.batchNo,
        herbType: prev.herbType || batch.herbType,
      }))
      const hIdx = herbOptions.indexOf(batch.herbType)
      if (hIdx >= 0) setHerbIndex(hIdx)
    }
  }

  const handleSubmit = () => {
    if (!formData.batchNo?.trim()) {
      Taro.showToast({ title: '请输入批次号', icon: 'none' })
      return
    }
    if (!formData.herbType) {
      Taro.showToast({ title: '请选择药材品种', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addQualityTest(formData as Omit<QualityTest, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updateQualityTest(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条检测记录吗？',
      success: (res) => {
        if (res.confirm) {
          deleteQualityTest(id)
          Taro.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        }
      }
    })
  }

  const getResultClass = (result: string) => {
    if (result === 'pass') return styles.pass
    if (result === 'fail') return styles.fail
    return styles.pending
  }

  const getResultText = (result: string) => {
    if (result === 'pass') return '合格'
    if (result === 'fail') return '不合格'
    return '待检测'
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>关联批次</Text>
          <View className={styles.inputWrap}>
            <Picker
              mode="selector"
              range={batchLabels}
              value={formData.batchNo ? batchOptions.findIndex(b => b.batchNo === formData.batchNo) : 0}
              onChange={handleBatchChange}
            >
              <Text className={classnames(styles.pickerText, {
                [styles.placeholder]: !formData.batchNo
              })}>
                {formData.batchNo || '请选择采收/库存批次'}
              </Text>
            </Picker>
          </View>
        </View>

        {selectedBatch && (
          <View className={styles.batchInfo}>
            <Text className={styles.batchTitle}>🌿 批次信息</Text>
            <View className={styles.batchGrid}>
              <View className={styles.batchItem}>
                <Text className={styles.batchLabel}>药材品种</Text>
                <Text className={styles.batchValue}>{selectedBatch.herbType}</Text>
              </View>
              <View className={styles.batchItem}>
                <Text className={styles.batchLabel}>对应地块</Text>
                <Text className={styles.batchValue}>{selectedBatch.fieldName}</Text>
              </View>
              <View className={styles.batchItem}>
                <Text className={styles.batchLabel}>
                  {selectedBatch.source === 'inventory' ? '可售数量' : '采收产量'}
                </Text>
                <Text className={classnames(styles.batchValue, styles.availQty)}>
                  {selectedBatch.quantity}{selectedBatch.unit}
                </Text>
              </View>
              <View className={styles.batchItem}>
                <Text className={styles.batchLabel}>品质等级</Text>
                <Text className={styles.batchValue}>
                  {selectedBatch.quality === 'excellent' ? '优等' : selectedBatch.quality === 'good' ? '良好' : '一般'}
                </Text>
              </View>
              <View className={styles.batchItem}>
                <Text className={styles.batchLabel}>
                  {selectedBatch.source === 'inventory' ? '入库日期' : '采收日期'}
                </Text>
                <Text className={styles.batchValue}>{selectedBatch.date}</Text>
              </View>
              <View className={styles.batchItem}>
                <Text className={styles.batchLabel}>数据来源</Text>
                <Text className={styles.batchValue}>
                  {selectedBatch.source === 'inventory' ? '库存批次' : '采收记录'}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.formItem}>
          <Text className={styles.label}>药材品种</Text>
          <View className={styles.inputWrap}>
            <Picker
              mode="selector"
              range={herbOptions}
              value={herbIndex}
              onChange={handleHerbChange}
            >
              <Text className={classnames(styles.pickerText, {
                [styles.placeholder]: !formData.herbType
              })}>
                {formData.herbType || '请选择药材品种'}
              </Text>
            </Picker>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>检测日期</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入检测日期"
              value={formData.testDate}
              onInput={(e) => handleInputChange('testDate', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>检测人</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入检测人"
              value={formData.tester}
              onInput={(e) => handleInputChange('tester', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>检测结果</Text>
          <View className={styles.inputWrap}>
            <Picker
              mode="selector"
              range={resultOptions.map(r => r.label)}
              value={resultIndex}
              onChange={handleResultChange}
            >
              <Text className={classnames(styles.resultTag, getResultClass(formData.overallResult || 'pending'))}>
                {getResultText(formData.overallResult || 'pending')}
              </Text>
            </Picker>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>检测项目</Text>
        <Text style={{ fontSize: '24rpx', color: '#86909C', marginBottom: '16rpx' }}>
          共 {formData.testItems?.length || 0} 项检测指标
        </Text>
        {formData.testItems?.map((item, index) => (
          <View key={index} className={styles.formItem}>
            <Text className={styles.label}>{item.name}</Text>
            <View style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '26rpx', color: '#1d2129' }}>{item.result}</Text>
              <Text style={{ fontSize: '22rpx', color: item.isPass ? '#00B42A' : '#F53F3F' }}>
                {item.isPass ? '✓ 合格' : '✗ 不合格'}
              </Text>
            </View>
          </View>
        ))}
        <Text style={{ fontSize: '24rpx', color: '#86909C', textAlign: 'center', marginTop: '16rpx' }}>
          检测项目明细请在详情页查看完整信息
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>其他信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>备注</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.input}
              placeholder="请输入备注信息"
              value={formData.remark}
              onInput={(e) => handleInputChange('remark', e.detail.value)}
            />
          </View>
        </View>

        {mode === 'edit' && (
          <View className={classnames(styles.footerBtn, styles.btnDanger)} onClick={handleDelete}>
            删除检测记录
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <View className={classnames(styles.footerBtn, styles.btnOutline)} onClick={() => Taro.navigateBack()}>
          取消
        </View>
        <View className={classnames(styles.footerBtn, styles.btnPrimary)} onClick={handleSubmit}>
          保存
        </View>
      </View>
    </ScrollView>
  )
}

export default QualityFormPage
