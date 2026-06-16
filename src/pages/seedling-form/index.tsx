import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { SeedlingInfo } from '@/types'

const herbOptions = ['人参', '三七', '黄精', '铁皮石斛', '天麻', '当归', '白术', '川芎', '黄连', '川贝']

const statusOptions = [
  { value: 'nursery', label: '育苗中' },
  { value: 'available', label: '可供应' },
  { value: 'transplanted', label: '已移栽' },
]

const qualityOptions = [
  { value: 'excellent', label: '优等' },
  { value: 'good', label: '良好' },
  { value: 'normal', label: '一般' },
]

const sourceOptions = ['自主繁育', '外购', '外购驯化', '组培苗', '野生采集']

const SeedlingFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addSeedling = useAppStore(state => state.addSeedling)
  const updateSeedling = useAppStore(state => state.updateSeedling)
  const deleteSeedling = useAppStore(state => state.deleteSeedling)
  const getSeedlingById = useAppStore(state => state.getSeedlingById)
  const fields = useAppStore(state => state.fields)
  const fieldNames = fields.map(f => f.name)

  const [formData, setFormData] = useState<Partial<SeedlingInfo>>({
    name: '',
    variety: '',
    herbType: '',
    source: '',
    quantity: 0,
    nurseryDate: '',
    fieldId: '',
    fieldName: '',
    status: 'nursery',
    quality: 'good',
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      const seedling = getSeedlingById(id)
      if (seedling) {
        setFormData(seedling)
        Taro.setNavigationBarTitle({ title: '编辑种苗' })
      }
    } else {
      Taro.setNavigationBarTitle({ title: '新增种苗' })
    }
  }, [mode, id, getSeedlingById])

  const handleInputChange = (key: keyof SeedlingInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleFieldChange = (index: number) => {
    const field = fields[index]
    if (field) {
      setFormData(prev => ({
        ...prev,
        fieldId: field.id,
        fieldName: field.name,
        herbType: field.herbType || prev.herbType
      }))
    }
  }

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      Taro.showToast({ title: '请输入种苗名称', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addSeedling(formData as Omit<SeedlingInfo, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updateSeedling(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条种苗记录吗？',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          deleteSeedling(id)
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
              <Text className={styles.required}>*</Text>种苗名称
            </Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入种苗名称"
                value={formData.name}
                onInput={(e) => handleInputChange('name', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>品种</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入品种"
                value={formData.variety}
                onInput={(e) => handleInputChange('variety', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>药材品种</Text>
            <View className={styles.formControl}>
              <Picker
                mode="selector"
                range={herbOptions}
                value={herbOptions.indexOf(formData.herbType || '')}
                onChange={(e) => handleInputChange('herbType', herbOptions[e.detail.value])}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.herbType })}>
                  {formData.herbType || '请选择药材品种'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>对应地块</Text>
            <View className={styles.formControl}>
              <Picker
                mode="selector"
                range={fieldNames}
                value={fieldNames.indexOf(formData.fieldName || '')}
                onChange={(e) => handleFieldChange(e.detail.value)}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.fieldName })}>
                  {formData.fieldName || '请选择对应地块'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>来源</Text>
            <View className={styles.formControl}>
              <Picker
                mode="selector"
                range={sourceOptions}
                value={sourceOptions.indexOf(formData.source || '')}
                onChange={(e) => handleInputChange('source', sourceOptions[e.detail.value])}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.source })}>
                  {formData.source || '请选择来源'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>数量(株)</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                type="number"
                placeholder="请输入数量"
                value={String(formData.quantity || '')}
                onInput={(e) => handleInputChange('quantity', Number(e.detail.value))}
              />
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>育苗信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>育苗日期</Text>
            <View className={styles.formControl}>
              <Picker
                mode="date"
                value={formData.nurseryDate}
                onChange={(e) => handleInputChange('nurseryDate', e.detail.value)}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.nurseryDate })}>
                  {formData.nurseryDate || '请选择育苗日期'}
                </Text>
              </Picker>
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

export default SeedlingFormPage
