import Layout from '@/layout'

export default {
  path: '/permission',
  component: Layout,
  meta: { id: 'permissions' },
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    meta: { title: '权限', icon: 'lock' }
  }]
}
