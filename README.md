该项目是基于 [BMYBBS API](https://github.com/bmybbs/api) 重新设计的前端网页。

与上一代与后台代码紧密耦合的 nju09 不同，本项目独立于后台构建，所有网页框架均为静态页面，并通过 AJAX 与后台接口交互。

假设 API 端口已经运行在本地的 8081 端口，则推荐使用的 Nginx 配置文件为：

```
server {
	server_name			www.bmybbs.com;

# 普通方式
	listen 				80;

# ssl 方式
#	listen				443;
#	ssl					on;
#	ssl_certificate		/etc/nginx/bmybbs.com.chained.crt;
#	ssl_certificate_key	/etc/nginx/bmybbs.com.server.key;

	root				/var/www/bmyweb;
	index				index.html;

	gzip on;
	gzip_http_version 1.1;
	gzip_comp_level 6;
	gzip_types text/plain text/html text/css application/javascript application/x-javascript text/javascript text/xml application/xml application/rss+xml application/atom+xml application/rdf+xml;
	gzip_buffers 16 8k;
	gzip_disable "MSIE [1-6].(?!.*SV1)";

	location /api/ {
		proxy_pass http://127.0.0.1:8081/;
		proxy_redirect off;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
	}

	location /static/ {
		alias /var/www/static/;
	}

	location ~* \.(js|css)$ {
		expires 7d;
	}
}
```
