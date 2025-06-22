<template>
  <div class="timeline-container">
    
    <div v-for="(yearData, year) in groupedPosts" :key="year" class="year-section">
      <h2 class="year-title">{{ year }}年</h2>
      
      <div v-for="(monthData, month) in yearData" :key="month" class="month-section">
        <h3 class="month-title">{{ month }}月</h3>
        
        <div class="posts-list">
          <div v-for="post in monthData" :key="post.path" class="post-item">
            <div class="post-date">{{ formatDate(post.frontmatter.createTime) }}</div>
            <div class="post-content">
              <h4 class="post-title">
                <a :href="post.path">{{ post.title }}</a>
              </h4>
              <p class="post-excerpt" v-if="post.frontmatter.description">
                {{ post.frontmatter.description }}
              </p>
              <div class="post-tags" v-if="post.frontmatter.tags">
                <span v-for="tag in post.frontmatter.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="timeline-stats">
      <h3>📊 统计信息</h3>
      <ul>
        <li>总文章数：{{ totalPosts }}</li>
        <li>最新文章：{{ latestPost?.title || '暂无' }}</li>
        <li>最早文章：{{ earliestPost?.title || '暂无' }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Timeline',
  setup() {
    // 静态文章数据 - 确保组件能够正常工作
    const staticPosts = [
      {
        path: '/zustand/',
        title: 'Zustand 状态管理完整指南',
        frontmatter: {
          createTime: '2025/06/15',
          description: '深入学习和整理了 Zustand 状态管理库的完整文档',
          tags: ['React', 'State Management', 'Zustand']
        }
      },
      {
        path: '/life/keep/',
        title: '健身打卡记录',
        frontmatter: {
          createTime: '2025/05/11',
          description: '完成了为期一个月的肩部、手臂、后背训练计划',
          tags: ['健身', '打卡']
        }
      },
      {
        path: '/life/dinner/',
        title: '善意的晚饭',
        frontmatter: {
          createTime: '2025/04/23',
          description: '记录了一次温暖的聚餐经历',
          tags: ['碎念']
        }
      },
      {
        path: '/life/dj/',
        title: '致我最好的朋友董锦',
        frontmatter: {
          createTime: '2025/03/01',
          description: '记录了与好友的珍贵相聚时光',
          tags: ['社交', '朋友']
        }
      },
      {
        path: '/about/',
        title: '关于我',
        frontmatter: {
          createTime: '2025/03/08',
          description: '更新了个人介绍页面',
          tags: ['关于']
        }
      }
    ]

    // 获取所有文章页面
    const allPosts = computed(() => {
      return staticPosts.sort((a, b) => {
        const timeA = new Date(a.frontmatter.createTime).getTime()
        const timeB = new Date(b.frontmatter.createTime).getTime()
        return timeB - timeA
      })
    })

    // 按年份和月份分组
    const groupedPosts = computed(() => {
      const groups = {}

      allPosts.value.forEach(post => {
        const date = new Date(post.frontmatter.createTime)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        if (!groups[year]) {
          groups[year] = {}
        }
        if (!groups[year][month]) {
          groups[year][month] = []
        }

        groups[year][month].push(post)
      })

      return groups
    })

    const totalPosts = computed(() => allPosts.value.length)
    const latestPost = computed(() => allPosts.value[0])
    const earliestPost = computed(() => allPosts.value[allPosts.value.length - 1])

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}-${date.getDate()}`
    }

    return {
      groupedPosts,
      totalPosts,
      latestPost,
      earliestPost,
      formatDate
    }
  }
}
</script>

<style scoped>
.timeline-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  background: var(--vp-c-bg);
}

.timeline-description {
  color: var(--vp-c-text-2);
  margin-bottom: 4rem;
  text-align: center;
  font-size: 1.1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 主时间轴线 */
.timeline-container::before {
  content: '';
  position: absolute;
  left: 80px;
  top: 140px;
  bottom: 80px;
  width: 3px;
  background: linear-gradient(
    to bottom,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 50%,
    var(--vp-c-divider) 100%
  );
  border-radius: 2px;
  z-index: 1;
}

.year-section {
  margin-bottom: 3rem;
  position: relative;
}

.year-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  margin-bottom: 1.5rem;
  padding-left: 120px;
  position: relative;
  display: flex;
  align-items: center;
}

/* 年份节点 */
.year-title::before {
  content: '';
  position: absolute;
  left: 68px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: var(--vp-c-brand);
  border: 4px solid var(--vp-c-bg);
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 0 3px var(--vp-c-brand-light);
}

/* 年份连接线 */
.year-title::after {
  content: '';
  position: absolute;
  left: 92px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 2px;
  background: var(--vp-c-brand);
  z-index: 1;
}

.month-section {
  margin-bottom: 2rem;
  position: relative;
}

.month-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
  padding-left: 120px;
  position: relative;
  opacity: 0.8;
}

/* 月份节点 */
.month-title::before {
  content: '';
  position: absolute;
  left: 72px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-brand-light);
  border-radius: 50%;
  z-index: 2;
}

/* 月份连接线 */
.month-title::after {
  content: '';
  position: absolute;
  left: 88px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 1px;
  background: var(--vp-c-brand-light);
  z-index: 1;
}

.posts-list {
  padding-left: 120px;
}

.post-item {
  position: relative;
  margin-bottom: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--vp-c-divider-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.08),
    0 3px 10px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand-light);
}

/* 文章节点 */
.post-item::before {
  content: '';
  position: absolute;
  left: -168px;
  top: 24px;
  width: 12px;
  height: 12px;
  background: var(--vp-c-brand-soft);
  border: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  z-index: 2;
  transition: all 0.3s ease;
}

.post-item:hover::before {
  background: var(--vp-c-brand);
  transform: scale(1.2);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

/* 文章连接线 */
.post-item::after {
  content: '';
  position: absolute;
  left: -156px;
  top: 30px;
  width: 28px;
  height: 1px;
  background: var(--vp-c-brand-light);
  z-index: 1;
}

.post-date {
  font-size: 0.85rem;
  color: var(--vp-c-brand);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: inline-block;
  background: var(--vp-c-brand-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.post-content {
  flex: 1;
}

.post-title {
  margin: 0 0 0.8rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.post-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: var(--vp-c-brand);
}

.post-excerpt {
  color: var(--vp-c-text-2);
  margin: 0.8rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.post-tags {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider-light);
}

.tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand-light);
  transform: translateY(-1px);
}

.timeline-stats {
  margin-top: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider-light);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  position: relative;
  margin-left: 120px;
  margin-right: 0;
}

.timeline-stats:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.08),
    0 3px 10px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand-light);
}

/* 统计信息节点 */
.timeline-stats::before {
  content: '';
  position: absolute;
  left: -168px;
  top: 24px;
  width: 12px;
  height: 12px;
  background: var(--vp-c-brand-soft);
  border: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  z-index: 2;
  transition: all 0.3s ease;
}

.timeline-stats:hover::before {
  background: var(--vp-c-brand);
  transform: scale(1.2);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

/* 统计信息连接线 */
.timeline-stats::after {
  content: '';
  position: absolute;
  left: -156px;
  top: 30px;
  width: 28px;
  height: 1px;
  background: var(--vp-c-brand-light);
  z-index: 1;
}

.timeline-stats h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.timeline-stats ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.timeline-stats li {
  padding: 0.8rem 1rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider-light);
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.timeline-stats li:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand-light);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-container {
    padding: 1.5rem;
  }

  .timeline-container::before {
    left: 40px;
  }

  .year-title {
    font-size: 1.5rem;
    padding-left: 80px;
  }

  .year-title::before {
    left: 28px;
    width: 20px;
    height: 20px;
  }

  .year-title::after {
    left: 48px;
    width: 24px;
  }

  .month-title {
    font-size: 1.1rem;
    padding-left: 80px;
  }

  .month-title::before {
    left: 32px;
    width: 12px;
    height: 12px;
  }

  .month-title::after {
    left: 44px;
    width: 28px;
  }

  .posts-list {
    padding-left: 80px;
  }

  .post-item::before {
    left: -128px;
  }

  .post-item::after {
    left: -116px;
    width: 32px;
  }

  .post-item {
    padding: 1.2rem;
  }

  .timeline-stats {
    margin-left: 80px;
  }

  .timeline-stats::before {
    left: -128px;
  }

  .timeline-stats::after {
    left: -116px;
    width: 32px;
  }

  .timeline-stats ul {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .timeline-container {
    padding: 1rem;
  }

  .timeline-container::before {
    left: 30px;
  }

  .year-title {
    padding-left: 60px;
    font-size: 1.3rem;
  }

  .year-title::before {
    left: 18px;
    width: 16px;
    height: 16px;
  }

  .year-title::after {
    left: 34px;
    width: 20px;
  }

  .month-title {
    padding-left: 60px;
    font-size: 1rem;
  }

  .month-title::before {
    left: 22px;
    width: 10px;
    height: 10px;
  }

  .month-title::after {
    left: 32px;
    width: 22px;
  }

  .posts-list {
    padding-left: 60px;
  }

  .post-item::before {
    left: -108px;
  }

  .post-item::after {
    left: -96px;
    width: 26px;
  }

  .timeline-stats {
    margin-left: 60px;
  }

  .timeline-stats::before {
    left: -108px;
  }

  .timeline-stats::after {
    left: -96px;
    width: 26px;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .post-item {
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.2),
      0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .post-item:hover {
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3),
      0 3px 10px rgba(0, 0, 0, 0.4);
  }

  .timeline-stats {
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.2),
      0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .timeline-stats:hover {
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3),
      0 3px 10px rgba(0, 0, 0, 0.4);
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-item {
  animation: fadeInUp 0.6s ease-out;
}

.post-item:nth-child(even) {
  animation-delay: 0.1s;
}

.post-item:nth-child(odd) {
  animation-delay: 0.2s;
}

.timeline-stats {
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.3s;
}
</style>
