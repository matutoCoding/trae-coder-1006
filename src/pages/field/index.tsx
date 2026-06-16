import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import SectionHeader from '@/components/SectionHeader'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { FieldInfo } from '@/types'

const FieldPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const fields = useAppStore(state => state.fields)

  const fieldStats = useMemo(() => {
    const totalArea = fields.reduce((sum, f) => sum + f.area, 0)
    const growingCount = fields.filter(f => f.status === 'growing').length
    const harvestedCount = fields.filter(f => f.status === 'harvested').length
    const herbTypes = new Set(fields.map(f => f.herbType)).size
    return [
      { label: '地块总数', value: fields.length, unit: '块' },
      { label: '种植面积', value: totalArea, unit: '亩' },
      { label: '生长中', value: growingCount, unit: '块' },
      { label: '已采收', value: harvestedCount, unit: '块' },
    ]
  }, [fields])

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const handleFieldClick = (field: FieldInfo) => {
    Taro.navigateTo({ url: `/pages/field-form/index?mode=edit&id=${field.id}` })
  }

  const handleAddField = () => {
    Taro.navigateTo({ url: '/pages/field-form/index?mode=add' })
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className={styles.header}>
        <Text className={styles.title}>药田台账</Text>
        <Text className={styles.subtitle}>道地药材GAP规范化种植基地</Text>
      </View>

      <View className={styles.statsWrap}>
        <StatCard data={fieldStats} />
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionCard} onClick={handleAddField}>
          <View className={styles.actionIcon}>➕</View>
          <Text className={styles.actionText}>新增地块</Text>
        </View>
        <View className={styles.actionCard} onClick={() => Taro.showToast({ title: 'GAP认证', icon: 'none' })}>
          <View className={styles.actionIcon}>📋</View>
          <Text className={styles.actionText}>GAP认证</Text>
        </View>
      </View>

      <SectionHeader title="药田列表" subtitle={`共${fields.length}块`} extra={<Text style={{ color: '#2E7D32', fontSize: '24rpx' }}>查看全部</Text>} />

      <View className={styles.fieldList}>
        {fields.map(field => (
          <View
            key={field.id}
            className={styles.fieldCard}
            onClick={() => handleFieldClick(field)}
          >
            <View className={styles.cardHeader}>
              <Text className={styles.fieldName}>{field.name}</Text>
              <StatusTag status={field.status} />
            </View>

            <View className={styles.herbBadge}>{field.herbType}</View>

            <View className={styles.fieldInfo}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>面积</Text>
                <Text className={styles.infoValue}>{field.area} 亩</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>位置</Text>
                <Text className={styles.infoValue}>{field.location}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>土壤类型</Text>
                <Text className={styles.infoValue}>{field.soilType}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>定植日期</Text>
                <Text className={styles.infoValue}>{field.plantDate}</Text>
              </View>
            </View>

            <View className={styles.cardFooter}>
              <Text className={styles.growthInfo}>
                生长年限：<Text className={styles.growthYears}>{field.growthYears}年</Text>
              </Text>
              <Text style={{ fontSize: '24rpx', color: '#86909C' }}>查看详情 →</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.fab} onClick={handleAddField}>
        <Text>+</Text>
      </View>
    </ScrollView>
  )
}

export default FieldPage
