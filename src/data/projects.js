/* 项目卡片数据。
   截图放在 public/assets/ 下，所以路径直接写绝对 URL，
   构建时原样复制、不参与打包（图片不需要哈希，换图直接覆盖文件即可）。
   width / height 填图片真实像素，浏览器据此预留位置，避免加载时页面跳动 */
const projects = [
  {
    id: 'sports',
    title: '校园运动会报名与成绩管理系统',
    image: '/assets/sports.png',
    alt: '校园运动会报名与成绩管理系统截图',
    width: 875,
    height: 877,
    desc: '独立设计并开发的校园运动会全流程管理平台，涵盖项目设置、学生报名、裁判打分与成绩公示等环节。通过报名冲突检测和成绩计算优化，有效降低了人工统计出错率，提升了赛事组织效率。',
    tags: ['Python', 'Django', 'MySQL', 'Vue'],
  },
  {
    id: 'okr',
    title: 'OKR 智能管理系统',
    image: '/assets/OKR.png',
    alt: 'OKR 智能管理系统截图',
    width: 959,
    height: 951,
    desc: '支持集团战略级OKR的层级穿透与部门分解，在线创建目标并设定5个由AI智能生成的关键结果，覆盖依赖关系、进度跟踪、报告生成与数据仪表盘等全流程管理功能，帮助企业高效落地目标管理闭环。',
    tags: ['Claude API', 'Python', 'JavaScript', '前端可视化'],
  },
  {
    id: 'carbon',
    title: '碳排放实时监测面板',
    image: '/assets/carbon.png',
    alt: '碳排放实时监测面板截图',
    width: 959,
    height: 953,
    desc: '对接企业碳排放数据库，实现数据的实时提取与指标计算，并以图表和仪表盘形式进行动态可视化展示。为管理层提供了直观的碳排放监控工具，支持及时决策与异常预警。',
    tags: ['Claude API', 'MySQL', 'Python', '数据可视化'],
  },
];

export default projects;
