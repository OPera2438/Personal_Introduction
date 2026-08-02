/* 技能条数据。
   无障碍标签由 name 自动生成（`${name} 熟练度`），
   不再手写 —— 原来的静态 HTML 里六条 aria-label 全和名称对不上 */
const skills = [
  {
    name: 'Python',
    pct: 80,
    note: '日常主力语言，熟悉 Django 框架及 ORM，能完成基础的后端接口开发。',
  },
  {
    name: 'MySQL',
    pct: 75,
    note: '掌握数据库表设计、简单查询优化和事务处理。',
  },
  {
    name: 'AI / ML',
    pct: 75,
    note: '了解大模型 API 调用、Prompt 工程及 RAG 基本概念。',
  },
  {
    name: 'JavaScript / TypeScript',
    pct: 65,
    note: '熟悉 ES6+ 语法，结合 Axios 处理前后端通信。',
  },
  {
    name: 'Vue',
    pct: 60,
    note: '掌握组件化开发，配合 Bootstrap 实现页面布局。',
  },
  {
    name: 'Node.js',
    pct: 60,
    note: '了解 Express 框架，能编写简单的 RESTful 接口。',
  },
];

export default skills;
