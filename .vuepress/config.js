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
      // { text: 'Javascript', link: '/javascript/' },
      { text: '前端', link: '/fe/' },      
      { text: '读书', link: '/books/' },      
      // { text: 'React全家桶', link: '/react/' },
      { text: '造轮子', link: '/wheel/' },
      { text: '区块链', link: '/blockchain/' },
    ],
    sidebar: {
      '/fe/': [
        {
          title: '前端面试',
          collapsable: false,
          children: [
            'interview',
            'qa',
            '',
          ],
        },
      ],
      '/books/': [
        {
          title: '读书',
          collapsable: false,
          children: [
            '2019',
            'mpvue-update',
            '',
            
            

          ],
        },
      ],
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

      '/wheel/': [
        {
          title: '造轮子',
          collapsable: false,
          children: [
            '',
            'getting-started',
          ],
        },
      ],

      '/blockchain/': [
        {
          title: 'Blockchain',
          collapsable: false,
          children: [
            '',
            'build-block-with-nodejs',
          ],
        },
      ],
    }
  },


}