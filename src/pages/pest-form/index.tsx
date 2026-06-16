import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { PestRecord } from '@/types'

const typeOptions = [
  { value: 'disease', label: '病害' },
  { value: 'pest', label: '虫害' },
]

const severityOptions = [
  { value: 'mild', label: '轻微' },
  { value: 'moderate', label: '中度' },
  { value: 'severe', label: '严重' },
]

const statusOptions = [
  { value: 'monitoring', label: '观察中' },
  { value: 'treated', label: '已处理' },
  { value: 'resolved', label: '已解决' },
]

const PestFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addPestRecord = useAppStore(state => state.addPestRecord)
  const updatePestRecord = useAppStore(state => state.updatePestRecord)
  const deletePestRecord = useAppStore(state => state.deletePestRecord)
  const getPestRecordById = useAppStore(state => state.getPestRecordById)
  const fields = useAppStore(state => state.fields)

  const [formData, setFormData] = useState<Partial<PestRecord>>({
    type: 'disease',
    fieldId: '',
    fieldName: '',
    name: '',
    severity: 'mild',
    date: new Date().toISOString().split('T')[0],
    method: '',
    pesticide: '',
    operator: '',
    status: 'monitoring',
  })

  const fieldNames = fields.map(f => f.name)

  useEffect(() => {
    if (mode === 'edit' && id) {
      const record = getPestRecordById(id)
      if (record) {
        setFormData(record)
        Taro.setNavigationBarTitle({ title: '编辑病虫记录' })
      }
    } else {
      Taro.setNavigationBarTitle({ title: '新增病虫记录' })
    }
  }, [mode, id, getPestRecordById])

  const handleInputChange = (key: keyof PestRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleFieldChange = (index: number) => {
    const field = fields[index]
    if (field) {
      setFormData(prev => ({ ...prev, fieldId: field.id, fieldName: field.name }))
    }
  }

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      Taro.showToast({ title: '请输入病虫害名称', icon: 'none' })
      return
    }
    if (!formData.fieldName?.trim()) {
      Taro.showToast({ title: '请选择地块', icon: 'none' })
      return
    }
    if (!formData.method?.trim()) {
      Taro.showToast({ title: '请输入防治方法', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addPestRecord(formData as Omit<PestRecord, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updatePestRecord(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条病虫记录吗？',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          deletePestRecord(id)
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
            <Text className={styles.formLabel}>类型</Text>
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
              <Text className={styles.required}>*</Text>名称
            </Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入病虫害名称"
                value={formData.name}
                onInput={(e) => handleInputChange('name', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>发生地块
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
            <Text className={styles.formLabel}>严重程度</Text>
            <View className={styles.formControl}>
              <View className={styles.severityOptions}>
                {severityOptions.map(opt => (
                  <Text
                    key={opt.value}
                    className={classnames(styles.severityOption, { [styles.active]: formData.severity === opt.value })}
                    onClick={() => handleInputChange('severity', opt.value)}
                  >
                    {opt.label}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>发生日期</Text>
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
        </View>

        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>防治信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>防治方法
            </Text>
            <View className={styles.formControl}>
              <Textarea
                className={styles.textarea}
                placeholder="请输入防治方法"
                value={formData.method}
                onInput={(e) => handleInputChange('method', e.detail.value)}
                autoHeight
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>用药情况</Text>
            <View className={styles.formControl}>
              <Textarea
                className={styles.textarea}
                placeholder="请输入用药情况（选填）"
                value={formData.pesticide}
                onInput={(e) => handleInputChange('pesticide', e.detail.value)}
                autoHeight
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>负责人</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入负责人"
                value={formData.operator}
                onInput={(e) => handleInputChange('operator', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>状态</Text>
            <View className={styles.formControl}>
              <View className={styles.statusOptions}>
                {statusOptions.map(opt => (
                  <Text
                    key={opt.value}
                    className={classnames(styles.statusOption, { [styles.active]: formData.status === opt.value })}
                    onClick={() => handleInputChange('status', opt.value)}
                  >
                    {opt.label}
                  </Text>
                ))}
              </View>
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

export default PestFormPage
