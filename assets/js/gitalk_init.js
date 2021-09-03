var locationId = (location.pathname).split("/").pop().substring(0, 49);

if (locationId) {
  var language = window.location.search.match("lang=en") ? "en" : "zh-CN"

  if (window.location.href.match("github")) {
    var gitalk = new Gitalk({
      clientID: '6fb66a3a035c9e957602',
      clientSecret: '41c3158997a8d1c1a69aa2f92b4cbece44390b30',
      repo: 'blog-github-page-comments',
      owner: 'dengqinghua',
      admin: ['dengqinghua'],
      id: locationId,
      distractionFreeMode: true,
      language: language
    });
  } else {
    var gitalk = new Gitalk({
      clientID: '6fb66a3a035c9e957602',
      clientSecret: '41c3158997a8d1c1a69aa2f92b4cbece44390b30',
      repo: 'blog_comments',
      owner: 'dengqinghua',
      admin: ['dengqinghua'],
      id: locationId,
      distractionFreeMode: true,
      language: language
    });
  }
}
