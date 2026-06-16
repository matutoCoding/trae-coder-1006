import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import { fieldStats } from '@/data/field'

const modules = [
  { key: 'field', icon: '🌿', title: '药田台账', desc: '地块档案 · GAP认证管理', bg: '#E8F5E9', color: '#2E7D32' },
  { key: 'seedling', icon: '🌱', title: '种苗管理', desc: '道地种苗 · 繁育记录', bg: '#E0F2F1', color: '#00897B' },
  { key: 'farm', icon: '👨‍🌾', title: '农事记录', desc: '施肥灌溉 · 田间管理', bg: '#FFF3E0', color: '#EF6C00' },
  { key: 'pest', icon: '🐛', title: '病虫防治', desc: '绿色防控 · 病虫监测', bg: '#FCE4EC', color: '#C2185B' },
  { key: 'harvest', icon: '🌻', title: '采收加工', desc: '采收计划 · 产地初加工', bg: '#FFF8E1', color: '#F57F17' },
  { key: 'quality', icon: '🔬', title: '质量检测', desc: '农残检测 · 批次溯源', bg: '#E3F2FD', color: '#1565C0' },
]

const quickActions = [
  { key: 'addField', icon: '➕', label: '新增地块', bg: '#E8F5E9' },
  { key: 'addFarm', icon: '📝', label: '记农事', bg: '#FFF3E0' },
  { key: 'addPest', icon: '🚨', label: '报病虫', bg: '#FCE4EC' },
  { key: 'addHarvest', icon: '🧺', label: '记采收', bg: '#FFF8E1' },
]

const IndexPage: React.FC = () => {
  const handleModuleClick = (key: string) => {
    const tabBarPages = ['field', 'farm', 'quality', 'order']
    const routeMap: Record<string, string> = {
      field: '/pages/field/index',
      seedling: '/pages/seedling/index',
      farm: '/pages/farm/index',
      pest: '/pages/pest/index',
      harvest: '/pages/harvest/index',
      quality: '/pages/quality/index',
      order: '/pages/order/index',
    }
    const url = routeMap[key]
    if (url) {
      if (tabBarPages.includes(key)) {
        Taro.switchTab({ url })
      } else {
        Taro.navigateTo({ url })
      }
    }
  }

  const handleQuickClick = (key: string) => {
    const routeMap: Record<string, string> = {
      addField: '/pages/field-form/index?mode=add',
      addFarm: '/pages/farm-form/index?mode=add',
      addPest: '/pages/pest-form/index?mode=add',
      addHarvest: '/pages/harvest-form/index?mode=add',
    }
    const url = routeMap[key]
    if (url) {
      Taro.navigateTo({ url })
    }
  }

  const handleOrderClick = () => {
    Taro.switchTab({ url: '/pages/order/index' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.welcome}>早上好，种植户老王</Text>
        <Text className={styles.title}>珍稀中药材GAP基地</Text>
        <Text className={styles.subtitle}>道地药材 · 绿色种植 · 全程溯源</Text>
      </View>

      <View className={styles.statsCard}>
        <StatCard data={fieldStats} />
      </View>

      <View className={styles.quickGrid}>
        {quickActions.map(item => (
          <View
            key={item.key}
            className={styles.quickItem}
            onClick={() => handleQuickClick(item.key)}
          >
            <View className={styles.icon} style={{ backgroundColor: item.bg }}>
              {item.icon}
            </View>
            <Text className={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.noticeCard}>
        <Text className={styles.noticeIcon}>📢</Text>
        <View className={styles.noticeContent}>
          <Text className={styles.noticeTitle}>农事提醒</Text>
          <Text className={styles.noticeText}>
            A1号地块人参即将进入采收期，请提前做好采收准备工作。C2号地块天麻已完成采收，请及时晾晒加工。
          </Text>
        </View>
      </View>

      <View className={styles.sectionWrap}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>业务模块</Text>
          <Text className={styles.more}>全部功能 →</Text>
        </View>
        <View className={styles.moduleGrid}>
          {modules.map(item => (
            <View
              key={item.key}
              className={styles.moduleCard}
              onClick={() => handleModuleClick(item.key)}
            >
              <View className={styles.iconBox} style={{ backgroundColor: item.bg }}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.title}>{item.title}</Text>
              <Text className={styles.desc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionWrap}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>销售中心</Text>
          <Text className={styles.more} onClick={handleOrderClick}>查看订单 →</Text>
        </View>
        <View className={styles.moduleGrid}>
          <View className={styles.moduleCard} onClick={handleOrderClick}>
            <View className={styles.iconBox} style={{ backgroundColor: '#EDE7F6' }}>
              <Text>📦</Text>
            </View>
            <Text className={styles.title}>药企订单</Text>
            <Text className={styles.desc}>订单管理 · 状态跟踪</Text>
          </View>
          <View className={styles.moduleCard} onClick={handleOrderClick}>
            <View className={styles.iconBox} style={{ backgroundColor: '#E8F5E9' }}>
              <Text>📊</Text>
            </View>
            <Text className={styles.title}>产销台账</Text>
            <Text className={styles.desc}>销售记录 · 往来账目</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default IndexPage
