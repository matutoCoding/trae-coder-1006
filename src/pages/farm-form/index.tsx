import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { FarmRecord } from '@/types'

const typeOptions = [
  { value: 'sowing', label: '播种' },
  { value: 'transplant', label: '移栽' },
  { value: 'fertilize', label: '施肥' },
  { value: 'irrigate', label: '灌溉' },
  { value: 'prune', label: '修剪' },
]

const unitOptions = ['kg', 'g', 'L', 'ml', '次', '株']

const FarmFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addFarmRecord = useAppStore(state => state.addFarmRecord)
  const updateFarmRecord = useAppStore(state => state.updateFarmRecord)
  const deleteFarmRecord = useAppStore(state => state.deleteFarmRecord)
  const getFarmRecordById = useAppStore(state => state.getFarmRecordById)
  const fields = useAppStore(state => state.fields)

  const [formData, setFormData] = useState<Partial<FarmRecord>>({
    type: 'fertilize',
    fieldId: '',
    fieldName: '',
    date: new Date().toISOString().split('T')[0],
    operator: '',
    description: '',
    quantity: 0,
    unit: 'kg',
  })

  const fieldNames = fields.map(f => f.name)

  useEffect(() => {
    if (mode === 'edit' && id) {
      const record = getFarmRecordById(id)
      if (record) {
        setFormData(record)
        Taro.setNavigationBarTitle({ title: '编辑农事记录' })
      }
    } else {
      Taro.setNavigationBarTitle({ title: '新增农事记录' })
    }
  }, [mode, id, getFarmRecordById])

  const handleInputChange = (key: keyof FarmRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleFieldChange = (index: number) => {
    const field = fields[index]
    if (field) {
      setFormData(prev => ({ ...prev, fieldId: field.id, fieldName: field.name }))
    }
  }

  const handleSubmit = () => {
    if (!formData.fieldName?.trim()) {
      Taro.showToast({ title: '请选择地块', icon: 'none' })
      return
    }
    if (!formData.description?.trim()) {
      Taro.showToast({ title: '请输入操作说明', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addFarmRecord(formData as Omit<FarmRecord, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updateFarmRecord(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条农事记录吗？',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          deleteFarmRecord(id)
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
              <Text className={styles.required}>*</Text>农事类型
            </Text>
            <View className={styles.formControl}>
              <View className={styles.typeOptions}>
                {typeOptions.map(opt => (
                  <Text
                    key={opt.value}
                    className={classnames(styles.typeOption, { [styles.active]: formData.type === opt.value })}
                    onClick={() => handleInputChange('type', opt.value)}
                  >
                    {opt.label}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>涉及地块
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
            <Text className={styles.formLabel}>操作日期</Text>
            <View className={styles.formControl}>
              <Picker
                mode="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.detail.value)}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.date })}>
                  {formData.date || '请选择日期'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>操作人员</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入操作人员"
                value={formData.operator}
                onInput={(e) => handleInputChange('operator', e.detail.value)}
              />
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>操作详情</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>用量</Text>
            <View className={styles.formControl}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
                <Input
                  className={styles.input}
                  style={{ flex: 1 }}
                  type="digit"
                  placeholder="请输入数量"
                  value={String(formData.quantity || '')}
                  onInput={(e) => handleInputChange('quantity', Number(e.detail.value))}
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
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>操作说明
            </Text>
            <View className={styles.formControl}>
              <Textarea
                className={styles.textarea}
                placeholder="请输入操作说明"
                value={formData.description}
                onInput={(e) => handleInputChange('description', e.detail.value)}
                autoHeight
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

export default FarmFormPage
