import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import { useAppStore } from '@/store'
import { fieldStats } from '@/data/field'

const modules = [
  { key: 'field', icon: '🌿', title: '药田台账', desc: '地块档案 · GAP认证管理', bg: '#E8F5E9', color: '#2E7D32', isTab: true },
  { key: 'seedling', icon: '🌱', title: '种苗管理', desc: '道地种苗 · 繁育记录', bg: '#E0F2F1', color: '#00897B', isTab: false },
  { key: 'farm', icon: '👨‍🌾', title: '农事记录', desc: '施肥灌溉 · 田间管理', bg: '#FFF3E0', color: '#EF6C00', isTab: true },
  { key: 'pest', icon: '🐛', title: '病虫防治', desc: '绿色防控 · 病虫监测', bg: '#FCE4EC', color: '#C2185B', isTab: false },
  { key: 'harvest', icon: '🌻', title: '采收加工', desc: '采收计划 · 产地初加工', bg: '#FFF8E1', color: '#F57F17', isTab: false },
  { key: 'quality', icon: '🔬', title: '质量检测', desc: '农残检测 · 批次溯源', bg: '#E3F2FD', color: '#1565C0', isTab: true },
]

const quickActions = [
  { key: 'addField', icon: '➕', label: '新增地块', bg: '#E8F5E9' },
  { key: 'addFarm', icon: '📝', label: '记农事', bg: '#FFF3E0' },
  { key: 'addPest', icon: '🚨', label: '报病虫', bg: '#FCE4EC' },
  { key: 'addHarvest', icon: '🧺', label: '记采收', bg: '#FFF8E1' },
]

interface TodoItem {
  id: string
  icon: string
  title: string
  desc: string
  type: 'warning' | 'info' | 'success' | 'danger'
  route: string
}

const IndexPage: React.FC = () => {
  const qualityTests = useAppStore(state => state.qualityTests)
  const orders = useAppStore(state => state.orders)
  const inventoryBatches = useAppStore(state => state.inventoryBatches)
  const harvestRecords = useAppStore(state => state.harvestRecords)

  const todoList = useMemo<TodoItem[]>(() => {
    const todos: TodoItem[] = []

    const pendingHarvest = harvestRecords.filter(h => h.processingStatus !== 'finished' && h.processingStatus !== 'sliced' && h.yield > 0)
    pendingHarvest.forEach(h => {
      todos.push({
        id: `harvest-${h.id}`,
        icon: '🌻',
        title: '采收待加工',
        desc: `${h.herbType} 批次 ${h.batchNo}，产量 ${h.yield}${h.unit}`,
        type: 'info',
        route: '/pages/harvest/index'
      })
    })

    const rawHarvest = harvestRecords.filter(h => h.yield === 0)
    rawHarvest.forEach(h => {
      todos.push({
        id: `rawharvest-${h.id}`,
        icon: '🌱',
        title: '临近采收期',
        desc: `${h.herbType} ${h.fieldName}，预计 ${h.harvestDate} 采收`,
        type: 'warning',
        route: '/pages/harvest/index'
      })
    })

    const pendingTests = qualityTests.filter(t => t.overallResult === 'pending')
    pendingTests.forEach(t => {
      todos.push({
        id: `test-${t.id}`,
        icon: '🔬',
        title: '检测待出报告',
        desc: `${t.herbType} 批次 ${t.batchNo} 检测结果待录入`,
        type: 'warning',
        route: `/pages/quality-detail/index?id=${t.id}`
      })
    })

    const shippedOrders = orders.filter(o => o.status === 'shipped')
    shippedOrders.forEach(o => {
      todos.push({
        id: `order-${o.id}`,
        icon: '🚚',
        title: '订单待确认完成',
        desc: `${o.customer} - ${o.herbType} ${o.quantity}${o.unit}`,
        type: 'info',
        route: `/pages/order-detail/index?id=${o.id}`
      })
    })

    const pendingOrders = orders.filter(o => o.status === 'pending')
    pendingOrders.forEach(o => {
      todos.push({
        id: `produce-${o.id}`,
        icon: '📋',
        title: '订单待处理',
        desc: `${o.customer} - ${o.herbType} ${o.quantity}${o.unit}`,
        type: 'warning',
        route: `/pages/order-detail/index?id=${o.id}`
      })
    })

    const lowStock = inventoryBatches.filter(b => b.status === 'low_stock' || b.status === 'out_of_stock')
    lowStock.forEach(b => {
      todos.push({
        id: `inv-${b.id}`,
        icon: '📦',
        title: b.status === 'out_of_stock' ? '库存已售罄' : '库存偏低',
        desc: `${b.herbType} 批次 ${b.batchNo} 仅剩 ${b.availableQty}${b.unit}`,
        type: b.status === 'out_of_stock' ? 'danger' : 'warning',
        route: '/pages/inventory/index'
      })
    })

    return todos.slice(0, 8)
  }, [qualityTests, orders, inventoryBatches, harvestRecords])

  const handleModuleClick = (key: string, isTab: boolean) => {
    const routeMap: Record<string, string> = {
      field: '/pages/field/index',
      seedling: '/pages/seedling/index',
      farm: '/pages/farm/index',
      pest: '/pages/pest/index',
      harvest: '/pages/harvest/index',
      quality: '/pages/quality/index',
      order: '/pages/order/index',
      inventory: '/pages/inventory/index',
    }
    const url = routeMap[key]
    if (url) {
      if (isTab) {
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

  const handleTodoClick = (route: string) => {
    Taro.navigateTo({ url: route })
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

      {todoList.length > 0 && (
        <View className={styles.todoSection}>
          <View className={styles.todoHeader}>
            <Text className={styles.todoTitle}>📋 今日待办</Text>
            <Text className={styles.todoCount}>{todoList.length} 项</Text>
          </View>
          <View className={styles.todoList}>
            {todoList.map(item => (
              <View
                key={item.id}
                className={styles.todoItem}
                onClick={() => handleTodoClick(item.route)}
              >
                <View className={classnames(styles.todoIcon, styles[`todo-${item.type}`])}>
                  {item.icon}
                </View>
                <View className={styles.todoContent}>
                  <Text className={styles.todoItemTitle}>{item.title}</Text>
                  <Text className={styles.todoDesc}>{item.desc}</Text>
                </View>
                <Text className={styles.todoArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      )}

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
              onClick={() => handleModuleClick(item.key, item.isTab)}
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
          <View className={styles.moduleCard} onClick={() => handleModuleClick('inventory', false)}>
            <View className={styles.iconBox} style={{ backgroundColor: '#E8F5E9' }}>
              <Text>📊</Text>
            </View>
            <Text className={styles.title}>库存批次</Text>
            <Text className={styles.desc}>库存余量 · 批次管理</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default IndexPage
