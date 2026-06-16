import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { HarvestRecord } from '@/types'

const qualityOptions = [
  { value: 'excellent', label: '优等' },
  { value: 'good', label: '良好' },
  { value: 'normal', label: '一般' },
]

const processingStatusOptions = [
  { value: 'raw', label: '原料' },
  { value: 'drying', label: '晾晒中' },
  { value: 'sliced', label: '已切片' },
  { value: 'finished', label: '成品' },
]

const unitOptions = ['kg', 'g', '吨']

const HarvestFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addHarvestRecord = useAppStore(state => state.addHarvestRecord)
  const updateHarvestRecord = useAppStore(state => state.updateHarvestRecord)
  const deleteHarvestRecord = useAppStore(state => state.deleteHarvestRecord)
  const getHarvestRecordById = useAppStore(state => state.getHarvestRecordById)
  const fields = useAppStore(state => state.fields)

  const [formData, setFormData] = useState<Partial<HarvestRecord>>({
    fieldId: '',
    fieldName: '',
    herbType: '',
    harvestDate: new Date().toISOString().split('T')[0],
    yield: 0,
    unit: 'kg',
    quality: 'good',
    operator: '',
    growthYears: 0,
    processingStatus: 'raw',
  })

  const fieldNames = fields.map(f => f.name)

  useEffect(() => {
    if (mode === 'edit' && id) {
      const record = getHarvestRecordById(id)
      if (record) {
        setFormData(record)
        Taro.setNavigationBarTitle({ title: '编辑采收记录' })
      }
    } else {
      Taro.setNavigationBarTitle({ title: '新增采收记录' })
    }
  }, [mode, id, getHarvestRecordById])

  const handleInputChange = (key: keyof HarvestRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleFieldChange = (index: number) => {
    const field = fields[index]
    if (field) {
      setFormData(prev => ({
        ...prev,
        fieldId: field.id,
        fieldName: field.name,
        herbType: field.herbType,
        growthYears: field.growthYears
      }))
    }
  }

  const handleSubmit = () => {
    if (!formData.fieldName?.trim()) {
      Taro.showToast({ title: '请选择地块', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addHarvestRecord(formData as Omit<HarvestRecord, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updateHarvestRecord(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条采收记录吗？',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          deleteHarvestRecord(id)
          Taro.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        }
      }
    })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.formContent}>
        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>采收地块
            </Text>
            <View className={styles.formControl}>
              <Picker
                mode="selector"
                range={fieldNames}
                value={fieldNames.indexOf(formData.fieldName || '')}
                onChange={(e) => handleFieldChange(e.detail.value)}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.fieldName })}>
                  {formData.fieldName || '请选择地块'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>药材品种</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="自动填充"
                value={formData.herbType}
                onInput={(e) => handleInputChange('herbType', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>采收日期</Text>
            <View className={styles.formControl}>
              <Picker
                mode="date"
                value={formData.harvestDate}
                onChange={(e) => handleInputChange('harvestDate', e.detail.value)}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.harvestDate })}>
                  {formData.harvestDate || '请选择日期'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>生长年限</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                type="digit"
                placeholder="请输入生长年限"
                value={String(formData.growthYears || '')}
                onInput={(e) => handleInputChange('growthYears', Number(e.detail.value))}
              />
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>采收详情</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>产量</Text>
            <View className={styles.formControl}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
                <Input
                  className={styles.input}
                  style={{ flex: 1 }}
                  type="digit"
                  placeholder="请输入产量"
                  value={String(formData.yield || '')}
                  onInput={(e) => handleInputChange('yield', Number(e.detail.value))}
                />
                <Picker
                  mode="selector"
                  range={unitOptions}
                  value={unitOptions.indexOf(formData.unit || 'kg')}
                  onChange={(e) => handleInputChange('unit', unitOptions[e.detail.value])}
                >
                  <Text style={{ fontSize: '28rpx', color: '#666', paddingRight: '16rpx' }}>
                    {formData.unit || 'kg'}
                  </Text>
                </Picker>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>品质等级</Text>
            <View className={styles.formControl}>
              <View className={styles.qualityOptions}>
                {qualityOptions.map(opt => (
                  <Text
                    key={opt.value}
                    className={classnames(styles.qualityOption, { [styles.active]: formData.quality === opt.value })}
                    onClick={() => handleInputChange('quality', opt.value)}
                  >
                    {opt.label}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>加工状态</Text>
            <View className={styles.formControl}>
              <View className={styles.statusOptions}>
                {processingStatusOptions.map(opt => (
                  <Text
                    key={opt.value}
                    className={classnames(styles.statusOption, { [styles.active]: formData.processingStatus === opt.value })}
                    onClick={() => handleInputChange('processingStatus', opt.value)}
                  >
                    {opt.label}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>采收人</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入采收人"
                value={formData.operator}
                onInput={(e) => handleInputChange('operator', e.detail.value)}
              />
            </View>
          </View>
        </View>

        {mode === 'edit' && (
          <View className={styles.deleteBtn} onClick={handleDelete}>
            删除该记录
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <View className={classnames(styles.btn, styles.btnOutline)} onClick={() => Taro.navigateBack()}>
          取消
        </View>
        <View className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSubmit}>
          {mode === 'add' ? '添加' : '保存'}
        </View>
      </View>
    </ScrollView>
  )
}

export default HarvestFormPage
