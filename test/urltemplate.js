var test = require("tap").test;
var urltemplate = require("../index");

test("static url",function(t){
  var fn = urltemplate({
    route : "/hello/world"
  });

  t.equal(typeof(fn),"function","static url template type");
  t.equal(fn(),"/hello/world","static url template output with no arguments");
  t.equal(fn("abc",123),"/hello/world","static url template ignores arguments");

  t.end();
});

test("static url with prefix",function(t){
  var fn = urltemplate({
    route : "/hello/world",
    prefix : "/plang"
  });

  t.equal(typeof(fn),"function","static url with prefix template type");
  t.equal(fn(),"/plang/hello/world","static url with prefix template with no arguments");
  t.equal(fn("abc",123),"/plang/hello/world","static url with prefix template ignores arguments");

  t.end();
});

test("single parameter url",function(t){
  var fn = urltemplate({
    route : "/hello/:world"
  });

  t.equal(typeof(fn),"function","single parameter url template is function");
  t.equal(fn(),"/hello/:world","single parameter url template with no arguments");
  t.equal(fn("abc"),"/hello/abc","single parameter url template with argument");
  t.equal(fn("abc",123),"/hello/abc","single parameter url template with extra argument");
  t.equal(fn({world:123}),"/hello/123","single parameter url template with object argument");

  t.end();
});

test("single parameter url with prefix",function(t){
  var fn = urltemplate({
    route : "/hello/:world",
    prefix : "/plang"
  });

  t.equal(typeof(fn),"function","single parameter url with prefix template is function");
  t.equal(fn(),"/plang/hello/:world","single parameter url with prefix template with no arguments");
  t.equal(fn("abc"),"/plang/hello/abc","single parameter url with prefix template with one argument");
  t.equal(fn("abc",123),"/plang/hello/abc","single parameter url with prefix template with an extra argument");
  t.equal(fn({world:123}),"/plang/hello/123","single parameter url with prefix template with object argument");

  t.end();
});

test("multi parameter url",function(t){
  var fn = urltemplate({
    route : "/:hello/:world"
  });

  t.equal(typeof(fn),"function","multi parameter url template is function");
  t.equal(fn(),"/:hello/:world","multi parameter url template wih no arguments");
  t.equal(fn("abc"),"/abc/:world","single parameter url template with one argument");
  t.equal(fn("abc",123),"/abc/123","single parameter url template with two arguments");
  t.equal(fn("abc",123,"blang"),"/abc/123","single parameter url template with an extra argument");
  t.equal(fn({world:123}),"/:hello/123","single parameter url template with object parameter");

  t.end();
});

test("multi parameter url with prefix",function(t){
  var fn = urltemplate({
    route : "/:hello/:world",
    prefix : "/plang"
  });

  t.equal(typeof(fn),"function","multi parameter url with prefix template is function");
  t.equal(fn(),"/plang/:hello/:world","multi parameter url with prefix template wih no arguments");
  t.equal(fn("abc"),"/plang/abc/:world","single parameter url with prefix template with one argument");
  t.equal(fn("abc",123),"/plang/abc/123","single parameter url with prefix template with two arguments");
  t.equal(fn("abc",123,"blang"),"/plang/abc/123","single parameter url with prefix template with an extra argument");
  t.equal(fn({world:123}),"/plang/:hello/123","single parameter url with prefix template with object parameter");

  t.end();
});