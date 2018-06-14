module.exports = {
  title: '蜗牛老湿的个人网站',
  description: '资深程序员，擅长javascript，python',
  head: [
    ['link', { rel: 'icon', href: `/logo.ico` }]
  ],
  ga:"UA-120821049-1",
  themeConfig: {
    repo: 'shengxinjing',
    lastUpdated: '更新时间',
    nav: [
      { text: 'Javascript', link: '/javascript/' },
      { text: 'React', link: '/react/' },
    ],
    sidebar: {
      '/react/': [
        {
          title: 'React',
          collapsable: false,
          children: [
            '',
            'getting-started',
          ],
        },
      ],
      '/react-code/': [
        {
          title: 'React',
          collapsable: false,
          children: [
            '',
            'getting-started',
          ],
        },
      ],
    }
  },


}