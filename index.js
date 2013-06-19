module.exports = function(config){
  if (config.route){
    return getFromExpressRoute(config.route,config.prefix);
  }
}

function getFromExpressRoute(route,routeprefix){
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
    fn.push("}");

    // allow leaving out args to leave params in
    for (var i=0, ii=params.length; i<ii; i++){
      fn.push(params[i]);
      fn.push("=");
      fn.push(params[i]);
      fn.push(" || ':");
      fn.push(params[i]);
      fn.push("';");
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
  fn.push(";})");

  return eval(fn.join(""),{});
};