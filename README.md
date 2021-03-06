URLTemplate is a module for creating contextless template functions from simple express
routes. Those functions can then be passed in parameters as ordered arguments or
as a hash to retrieve the desired URL. Since the functions are contextless, they can
also be used client side.

    var ut = require("routetemplate");

    var myURL = ut({ route:"/article/:id" });

    myURL();           // => "/article/:id";
    myURL(123);        // => "/article/123"
    myURL({ id:123 }); // => "/article/123";


    var yourURL = ut({ route:"/blog/:blogid/:postid", prefix:"/your" });

    yourURL();                             // => "/your/blog/:blogid/:postid"
    yourURL("abc");                        // => "/your/blog/abc/:postid"
    yourURL("abc",123);                    // => "/your/blog/abc/123"
    yourURL({ blogid:"def", postid:456 }); // => "/your/blog/def/456"
    
Pass in an extra argument to add query parameters to the URL. An object argument will
be automatically encoded and converted to the form "key1=val1&key2=val2". If you use the
hash-first-argument form shown before, extra values are added in the same way.

## Configuration options

* *route* (req) - the simple express route to convert to a template function
* *prefix* (opt) - useful when creating templates for a bunch of URLs with common prefixess
* *jspath* (opt) - if you specify a path, routetemplate will write the resulting template function to that file as a requirable node module