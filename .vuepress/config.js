module.exports = {
  title: '蜗牛老湿的个人网站',
  description: '资深程序员，擅长javascript，python',
  head: [
    ['link', { rel: 'icon', href: `/logo.ico` }]
  ],
  ga:"UA-120821049-1",
  themeConfig: {
    repo: 'shengxinjing',
    lastUpdated: 'Last Updated',
    docsDir: 'docs',
    nav: [
      { text: 'javascript', link: '/javascript/' },
      { text: 'react', link: '/react/' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            '',
            'getting-started',
            'examples-and-boilerplates',
            'app-structure',
            'router',
            'navigate-between-pages',
            'config',
            'add-404-page',
            'html-template',
            'with-dva',
            'load-on-demand',
            'deploy',
            'env-variables',
            'faq',
          ],
        },
      ],

    }
  },


}