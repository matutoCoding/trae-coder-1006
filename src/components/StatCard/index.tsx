import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface StatCardProps {
  data: Array<{
    label: string
    value: string | number
    unit?: string
  }>
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  return (
    <View className={styles.statCard}>
      {data.map((item, index) => (
        <View key={index} className={styles.statItem}>
          <Text className={styles.statValue}>
            {item.value}
            <Text className={styles.statUnit}>{item.unit || ''}</Text>
          </Text>
          <Text className={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default StatCard
