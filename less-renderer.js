define([], function(){

  function getLessVersion(lessc){
    if(lessc.version !== undefined){
      return lessc.version[0];
    } else if( typeof lessc.Parser === 'function'){
      return 1;
    } else {
      return 0;
    }
  }

  var LessRenderer = function(lessc){
    this.lessc = lessc;
  };


  LessRenderer.prototype.render = function(path, options, callback){
    var cssPath = '@import (multiple) "' + path + '";';
    var generation = getLessVersion(this.lessc);

    if (generation === 1) {
      //v1, use parser and toCSS
      new this.lessc.Parser(options).parse(cssPath, function(error, tree){
        var output = {
          css : tree.toCSS(options.less)
        };
        callback(error, output);
      });
    } else if (generation === 2) {
      //v2, use render and output
      this.lessc.render(cssPath, options, callback)
    } else {
      callback('unsuported less version ' + generation);
    }
  };

  return LessRenderer;

});