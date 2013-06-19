URLTemplate is a module for creating contextless template functions from simple express
routes. Those functions can then be passed in parameters as ordered arguments or
as a hash to retrieve the desired URL. Since the functions are contextless, they can
also be used client side.

    var ut = require("urltemplate");

    var myURL = ut({ route:"/article/:id" });

    myURL();           // => "/article/:id";
    myURL(123);        // => "/article/123"
    myURL({ id:123 }); // => "/article/123";


    var yourURL = ut({ route:"/blog/:blogid/:postid", prefix:"/your" });

    yourURL();                             // => "/your/blog/:blogid/:postid"
    yourURL("abc");                        // => "/your/blog/abc/:postid"
    yourURL("abc",123);                    // => "/your/blog/abc/123"
    yourURL({ blogid:"def", postid:456 }); // => "/your/blog/def/456"