module.exports = function(config){
  config.extraparams = config.extraparams || true;
  
  if (config.route){
    return getFromExpressRoute(config.route,config.prefix,config.extraparams);
  }
}

function getFromExpressRoute(route,routeprefix,extraparams){
  var reParam = /(\:\w+)/i,
      tokens = route.split(reParam).filter(function(v){ return v.length; }),
      params = tokens.filter(function(v){ return v.search(reParam)>-1; }).map(function(v){ return v.slice(1).replace(/[^\w]/g,''); }),
      fn = [];
  
  if (routeprefix && routeprefix.length){
    if (tokens.length && tokens[0].search(reParam)===-1)
      tokens[0] = routeprefix + tokens[0];
    else
      tokens.unshift(routeprefix);
  }
  
  if (extraparams){
    params.push("extraparams");
  }
  
  fn.push("(function(");
  fn.push(params.join(","));
  fn.push("){");
  
  // handle object-as-first-argument case
  if (params.length){
    fn.push("var tmp={};if (arguments[0] && arguments[0].constructor===Object){tmp=arguments[0];");
    for (var i=0, ii=params.length; i<ii; i++){
      fn.push(params[i]);
      fn.push("=tmp['");
      fn.push(params[i]);
      fn.push("'];");
    }
    
    // handle extra values in the object as extra params
    if (extraparams){
      fn.push("extraparams = [];");
      fn.push("for (var k in tmp){");
      fn.push("if (");
      fn.push(JSON.stringify(params));
      fn.push(".indexOf(k)===-1){");
      fn.push("extraparams.push(encodeURI(k)+'='+encodeURI(tmp[k]));");
      fn.push("}");
      fn.push("}");
      fn.push("extraparams=extraparams.join('&');");
    }
    
    fn.push("}");
    
    // if it isn't an object first-parameter, make sure extraparams is defined
    fn.push("else{");
    fn.push("extraparams = extraparams || '';");
    fn.push("if (typeof(extraparams)==='object'){");
    fn.push("tmp=[]; for (var k in extraparams){");
    fn.push("tmp.push(encodeURI(k)+'='+encodeURI(extraparams[k]));");
    fn.push("}");
    fn.push("extraparams=tmp.join('&');");
    fn.push("}");
    fn.push("}");
    
    // allow leaving out args to leave params in
    for (var i=0, ii=params.length; i<ii; i++){
      if (params[i]!=="extraparams"){
        fn.push(params[i]);
        fn.push("=");
        fn.push(params[i]);
        fn.push(" || ':");
        fn.push(params[i]);
        fn.push("';");
      }
    }
  }

  // return url
  fn.push("return ");
  fn.push(tokens.map(function(v){
    if (v.search(reParam)>-1)
      return v.slice(1).replace(/[^\w]/g,'');
    else
      return "'"+v+"'";
  }).join("+"));
  
  if (extraparams){
    if (route.indexOf("?")===-1)
      fn.push("+(extraparams.length ? '?'+extraparams : '')");
    else
      fn.push("+(extraparams.length ? '&'+extraparams : '')");
  }
  
  fn.push(";})");

  return eval(fn.join(""),{});
};