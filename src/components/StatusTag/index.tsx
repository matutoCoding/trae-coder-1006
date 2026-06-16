import React from 'react'
import { Text } from '@tarojs/components'
import styles from './index.module.scss'
import { getStatusText, getStatusColor } from '@/utils'
import classnames from 'classnames'

interface StatusTagProps {
  status: string
  type?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

const StatusTag: React.FC<StatusTagProps> = ({ status, type = 'default' }) => {
  const color = getStatusColor(status)

  return (
    <Text
      className={classnames(styles.statusTag, styles[type])}
      style={{ color: color, backgroundColor: `${color}15` }}
    >
      {getStatusText(status)}
    </Text>
  )
}

export default StatusTag
