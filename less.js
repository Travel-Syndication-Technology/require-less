define(['require'], function(require) {

  var lessAPI = {};

  lessAPI.pluginBuilder = './less-builder';

  if (typeof window == 'undefined') {
    lessAPI.load = function(n, r, load) { load(); }
    return lessAPI;
  }

  lessAPI.normalize = function(name, normalize) {
    if (name.substr(name.length - 5, 5) == '.less')
      name = name.substr(0, name.length - 5);

    name = normalize(name);

    return name;
  }

  var head = document.getElementsByTagName('head')[0];

  var base = document.getElementsByTagName('base');
  base = base && base[0] && base[0] && base[0].href;
  var pagePath = (base || window.location.href.split('#')[0].split('?')[0]).split('/');
  pagePath[pagePath.length - 1] = '';
  pagePath = pagePath.join('/');

  var styleCnt = 0;
  var curStyle;
  lessAPI.inject = function(css) {
    if (styleCnt < 31) {
      curStyle = document.createElement('style');
      curStyle.type = 'text/css';
      head.appendChild(curStyle);
      styleCnt++;
    }
    if (curStyle.styleSheet)
      curStyle.styleSheet.cssText += css;
    else
      curStyle.appendChild(document.createTextNode(css));
  }

  lessAPI.load = function(lessId, req, load, config) {
    window.less = config.less || {};
    window.less.env = 'development';

    require(['./less-renderer', './lessc', './normalize'], function(LessRenderer, lessc, normalize) {
      var fileUrl = req.toUrl(lessId + '.less'),
          lessRenderer = new LessRenderer(lessc);

      lessRenderer.render(normalize.absoluteURI(fileUrl, pagePath), window.less, function(err, output){
        if (err) {
          load.error(err);
        } else {
          lessAPI.inject(normalize(output.css, fileUrl, pagePath));
          setTimeout(load, 7);
        }
      });

    });
  };

  return lessAPI;
});
