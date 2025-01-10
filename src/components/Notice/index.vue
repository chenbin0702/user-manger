<template>
  <el-popover
    placement="bottom"
    :width="300"
    trigger="click"
    popper-class="notice-popover"
  >
    <template #reference>
      <div class="notice-icon">
        <el-badge :value="unreadCount" :max="99">
          <el-icon :size="20"><Bell /></el-icon>
        </el-badge>
      </div>
    </template>

    <template #default>
      <div class="notice-container">
        <div class="notice-header">
          <span>通知</span>
          <el-button link type="primary" @click="markAllRead">全部已读</el-button>
        </div>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="通知" name="notification">
            <div class="notice-list">
              <div
                v-for="item in notifications"
                :key="item.id"
                class="notice-item"
                :class="{ unread: !item.read }"
                @click="readNotification(item)"
              >
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-time">{{ item.time }}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="消息" name="message">
            <div class="notice-list">
              <div
                v-for="item in messages"
                :key="item.id"
                class="notice-item"
                :class="{ unread: !item.read }"
                @click="readMessage(item)"
              >
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-time">{{ item.time }}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="notice-footer">
          <el-button link type="primary" @click="viewMore">查看更多</el-button>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bell } from '@element-plus/icons-vue'

const activeTab = ref('notification')

// 模拟数据
const notifications = ref([
  {
    id: 1,
    title: '系统将于今晚维护',
    time: '10分钟前',
    read: false
  },
  {
    id: 2,
    title: '您的设备申请已通过',
    time: '1小时前',
    read: false
  }
])

const messages = ref([
  {
    id: 1,
    title: '新的租赁订单待处理',
    time: '30分钟前',
    read: false
  },
  {
    id: 2,
    title: '用户反馈待回复',
    time: '2小时前',
    read: true
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length +
         messages.value.filter(m => !m.read).length
})

const readNotification = (item) => {
  item.read = true
}

const readMessage = (item) => {
  item.read = true
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
  messages.value.forEach(m => m.read = true)
}

const viewMore = () => {
  // 实现查看更多逻辑
}
</script>

<style scoped>
.notice-icon {
  padding: 8px;
  cursor: pointer;
  color: #666;
}

.notice-icon:hover {
  background-color: #f6f6f6;
  border-radius: 4px;
}

.notice-container {
  max-height: 400px;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
}

.notice-list {
  max-height: 300px;
  overflow-y: auto;
}

.notice-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notice-item:hover {
  background-color: #f5f7fa;
}

.notice-item.unread {
  background-color: #e6f7ff;
}

.notice-title {
  font-size: 14px;
  margin-bottom: 4px;
}

.notice-time {
  font-size: 12px;
  color: #909399;
}

.notice-footer {
  padding: 8px 16px;
  text-align: center;
  border-top: 1px solid #eee;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-popover.notice-popover) {
  padding: 0;
  min-width: 300px;
}
</style> 