import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useAppStore } from '@/store'
import { FieldInfo } from '@/types'

const statusOptions = [
  { value: 'growing', label: '生长中' },
  { value: 'harvested', label: '已采收' },
  { value: 'idle', label: '空闲' },
]

const soilOptions = ['砂壤土', '腐殖土', '黄壤土', '红壤土', '棕壤土', '黑土']

const herbOptions = ['人参', '三七', '黄精', '白术', '铁皮石斛', '天麻', '当归', '川芎', '金银花', '枸杞']

const FieldFormPage: React.FC = () => {
  const router = useRouter()
  const mode = router.params.mode || 'add'
  const id = router.params.id || ''

  const addField = useAppStore(state => state.addField)
  const updateField = useAppStore(state => state.updateField)
  const deleteField = useAppStore(state => state.deleteField)
  const getFieldById = useAppStore(state => state.getFieldById)

  const [formData, setFormData] = useState<Partial<FieldInfo>>({
    name: '',
    area: 0,
    location: '',
    soilType: '',
    herbType: '',
    plantDate: '',
    status: 'growing',
    growthYears: 0,
    description: '',
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      const field = getFieldById(id)
      if (field) {
        setFormData(field)
        Taro.setNavigationBarTitle({ title: '编辑药田' })
      }
    } else {
      Taro.setNavigationBarTitle({ title: '新增药田' })
    }
  }, [mode, id, getFieldById])

  const handleInputChange = (key: keyof FieldInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      Taro.showToast({ title: '请输入地块名称', icon: 'none' })
      return
    }
    if (!formData.herbType) {
      Taro.showToast({ title: '请选择种植品种', icon: 'none' })
      return
    }

    if (mode === 'add') {
      addField(formData as Omit<FieldInfo, 'id'>)
      Taro.showToast({ title: '添加成功', icon: 'success' })
    } else {
      updateField(id, formData)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }

    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个药田地块吗？',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          deleteField(id)
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
              <Text className={styles.required}>*</Text>地块名称
            </Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入地块名称"
                value={formData.name}
                onInput={(e) => handleInputChange('name', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>种植品种
            </Text>
            <View className={styles.formControl}>
              <Picker
                mode="selector"
                range={herbOptions}
                value={herbOptions.indexOf(formData.herbType || '')}
                onChange={(e) => handleInputChange('herbType', herbOptions[e.detail.value])}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.herbType })}>
                  {formData.herbType || '请选择种植品种'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>面积(亩)</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                type="digit"
                placeholder="请输入面积"
                value={String(formData.area || '')}
                onInput={(e) => handleInputChange('area', Number(e.detail.value))}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>位置</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                placeholder="请输入位置"
                value={formData.location}
                onInput={(e) => handleInputChange('location', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>土壤类型</Text>
            <View className={styles.formControl}>
              <Picker
                mode="selector"
                range={soilOptions}
                value={soilOptions.indexOf(formData.soilType || '')}
                onChange={(e) => handleInputChange('soilType', soilOptions[e.detail.value])}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.soilType })}>
                  {formData.soilType || '请选择土壤类型'}
                </Text>
              </Picker>
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>种植信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>定植日期</Text>
            <View className={styles.formControl}>
              <Picker
                mode="date"
                value={formData.plantDate}
                onChange={(e) => handleInputChange('plantDate', e.detail.value)}
              >
                <Text className={classnames(styles.pickerText, { [styles.placeholder]: !formData.plantDate })}>
                  {formData.plantDate || '请选择定植日期'}
                </Text>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>生长年限</Text>
            <View className={styles.formControl}>
              <Input
                className={styles.input}
                type="number"
                placeholder="请输入生长年限"
                value={String(formData.growthYears || '')}
                onInput={(e) => handleInputChange('growthYears', Number(e.detail.value))}
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

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>备注</Text>
            <View className={styles.formControl}>
              <Textarea
                className={styles.textarea}
                placeholder="请输入备注信息"
                value={formData.description}
                onInput={(e) => handleInputChange('description', e.detail.value)}
                autoHeight
              />
            </View>
          </View>
        </View>

        {mode === 'edit' && (
          <View className={styles.deleteBtn} onClick={handleDelete}>
            删除该地块
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

export default FieldFormPage
