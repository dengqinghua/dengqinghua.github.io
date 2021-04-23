---
layout: post
categories: showed note
toc: true
title: maker of application
---

### 运维
#### 机器配置
4核8G

#### 用户配置
```
sudo su -
useradd YouName
passwd YouName
visudo
YouName ALL=(ALL) NOPASSWD:ALL

# 设置通用的目录
mkdir -p /var/www/site
chmod -R 777 /var/www/site
```

#### 软件安装
安装 git, docker, docker-compose, jq, gitlab-runner, node, nginx

--------
{: data-content=" git " }

```
sudo yum remove git*
sudo yum -y install https://packages.endpoint.com/rhel/7/os/x86_64/endpoint-repo-1.7-1.x86_64.rpm
sudo yum install git
```

--------
{: data-content=" gitlab-runner " }

[Ref](https://docs.gitlab.com/runner/install/linux-repository.html)

需要将 runner 加入到 root 中

```
sudo usermod -aG root gitlab-runner
```

--------
{: data-content=" node " }

```
curl -sL https://rpm.nodesource.com/setup_12.x | sudo bash -lu
sudo yum install -y nodejs
```

--------
{: data-content=" nginx " }

静态文件

```
server {
    listen 80;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;

    server_name admin.exmaple.com;

    client_max_body_size 200M;

    root /var/www/site/admin_dev;
    location / {
      index index.html index.htm;
      try_files $uri /index.html;
    }

    gzip on;
    gzip_buffers 32 4K;
    gzip_comp_level 6;
    gzip_min_length 100;
    gzip_types application/javascript text/css text/xml;
    gzip_disable "MSIE [1-6]\.";
    gzip_vary on;
}
```

SSL

```
server {
    listen 443 ssl;

    server_name api0.exmaple.com;
    ## 这个文件需要放在 /etc/nginx 的目录下
    ssl_certificate 1_api0.exmaple.com_bundle.crt;
    ssl_certificate_key 2_api0.exmaple.com.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;

    client_max_body_size 100M;

    location / {
      proxy_pass http://127.0.0.1:8888;
    }
}
```

负载均衡

```
upstream java_prod_server {
  server 127.0.0.1:8880;
  server 127.0.0.1:8881;
}
```

重定向

```
server {
  listen 80;

  server_name admin.exmaple.com;

  return 301 https://admin.exmaple.com$request_uri;
}
```

### 基础设施
#### gitlab
[Ref](https://github.com/jl-borges/docker-gitlab)

需要更改的配置

```
TZ=Asia/Shanghai
GITLAB_TIMEZONE=Asia/Shanghai
GITLAB_HOST=gitlab.youDomain.com

GITLAB_ROOT_PASSWORD=password!1234
GITLAB_ROOT_EMAIL=youEmail

SMTP_ENABLED=true
SMTP_DOMAIN=youDomain.com
SMTP_HOST=smtp.ym.163.com
SMTP_PORT=25
SMTP_USER=noreply@youDomain.com
SMTP_PASS=youDomainPsw
SMTP_STARTTLS=true
SMTP_TLS=false
SMTP_AUTHENTICATION=plain
```

下面是 CI 的配置例子

--------
{: data-content=" java " }

- [.gitlab-ci.yml](https://github.com/jl-borges/maker/blob/main/java/.gitlab-ci.yml)
- [deploy.sh](https://github.com/jl-borges/maker/blob/main/java/deploy.sh)
- [ci_setting.yml](https://github.com/jl-borges/maker/blob/main/java/ci_settings.xml)
- [Dockerfile](https://github.com/jl-borges/maker/blob/main/java/Dockerfile)

--------
{: data-content=" node " }

```
stages:
  - prod-build
  - prod-deploy
variables:
  BUILD_MACHINE_IP: 172.21.x.x
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
prod-build:
  stage: prod-build
  tags:
    - adminBuild
  script:
    - npm install --registry=https://registry.npm.taobao.org
    - npm run build:prod
    - mkdir -p /var/www/site/admin_prod
    - cp -rf $PWD/dist/** /var/www/site/admin_prod
prod-deploy:
  tags:
    - prod
  stage: prod-deploy
  when: manual
  script:
    - scp -Cr youName@$BUILD_MACHINE_IP:/var/www/site/admin_prod /var/www/site/
```

#### 其他

- [Maven](https://github.com/jl-borges/maker/blob/main/maven/docker-compose.yml)


  注: 密码需要到 /nexus-data/admin.password 里面去查看

- [Reviewboard](https://github.com/jl-borges/docker-reviewboard)

  注: 这里不能调用 docker-compose down, 该部分会删除记录... 重启的话, 执行 docker-compose restart

- [Spring boot admin](https://github.com/jl-borges/spring-boot-admin)

- [宝塔](https://github.com/jl-borges/baota?organization=jl-borges&organization=jl-borges)

### 中间件
- [MySQL](https://github.com/jl-borges/maker/blob/main/mysql/docker-compose.yml)
- [Redis](https://github.com/jl-borges/maker/blob/main/redis/docker-compose.yml)
- Kafak, TODO
- ES, TODO

### 业务系统
- Java, see legacy
- Antd-React, see legacy
