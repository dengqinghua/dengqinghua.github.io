var locationId = (location.pathname).split("/").pop().substring(0, 49);

if (locationId) {
  var language = window.location.search.match("lang=en") ? "en" : "zh-CN"

  var gitalk = new Gitalk({
    clientID: '6fb66a3a035c9e957602',
    clientSecret: '399300ddd0e103846ed0bef3fd0b67938c302d1a',
    repo: 'blog_comments',
    owner: 'dengqinghua',
    admin: ['dengqinghua'],
    id: locationId,
    distractionFreeMode: true,
    language: language
  });

  gitalk.render('comment');
}
