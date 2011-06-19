If you wan't to enable features like gzip, `https`,
or `json-query-paths` (like /json/node...) you want to use a proxy server.

We recommend nginx:

# Adding nginx as a proxy

The initial setup for a proxy is as easy as this:

    server { 
      listen 80;
      server_name xappy.myhost.tld;
      location / {
        proxy_pass        http://localhost:8000;
      }
    }

### Setting up HTTPS

.. is really something you should check the nginx documentation for.
However a simple example here:

    server { 
      listen 80;
      listen  443 ssl;
      server_name xappy.myhost.tld;
     
      ssl_certificate /etc/ssl/server.crt;
      ssl_certificate_key /etc/ssl/server.key;

      location / {
        proxy_pass        http://localhost:8000;
      }
    }

### Streaming without buffering

nginx, by default, only buffers 4k/8k from the backend server it's talking to
(e.g. xappy.js).
However if you want the real "streaming"-feeling you can simply turn of buffering
like so: `proxy_buffering   off;`

    location / {
      proxy_pass        http://localhost:8000;
      proxy_buffering   off;
    }

### gzip compression

    server {
      gzip on;
      gzip_types application/xml application/json;
      gzip_proxied any;
      location / {
        proxy_pass        http://localhost:8000;
        proxy_buffering   on;
      }
    }

NOTE: Using `gzip on;` and `proxy_buffering off;` simultaneously is possible,
but **NOT** recommended as it will send you little gzip-chucks with random sizes.

### Alternative ways of requesting JSON 

Xappy intentionally only implements one way of requesting JSON as an output
format (Request-Header `Content-Type: application/json`).
If however you want to use GET variables, custom paths or other crazy ways of
requesting JSON, here are a few examples:

    location /json/ {
      proxy_pass        http://localhost:8000;
      proxy_buffering   off;
      proxy_set_header  Content-Type "application/json";
    }

or:

    location / {
      proxy_pass        http://localhost:8000;
      if ($args = "json") { set $mytype "application/json";}
      proxy_set_header  Content-Type $mytype;
    }
