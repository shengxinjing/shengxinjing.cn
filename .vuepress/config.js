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
      { text: '读书', link: '/books/' },      
      // { text: 'React全家桶', link: '/react/' },
      { text: '构建自己的React', link: '/react-code/' },
      { text: '区块链', link: '/blockchain/' },
    ],
    sidebar: {
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