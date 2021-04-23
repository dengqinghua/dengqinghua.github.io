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

```
variables:
  JAR_FOLDER: /var/www/site/java
stages:
  - build
  - stage-deploy
  - prod-deploy
cache:
  paths:
    - .m2
build:
  stage: build
  variables:
    BE_CONTAINER_TEMP: backend_service_container_temp
  script:
    - mkdir -p .m2
    - docker build -t backend_service . --rm
    ## 生成临时 docker
    - docker create -ti --name $BE_CONTAINER_TEMP backend_service bash
    ## 拷贝打包的文件到指定的目录下 XXX: 注意需要在这里有对应的权限 /var/www/site/java
    - docker cp $BE_CONTAINER_TEMP:/build/server/target/backend-server-1.0-SNAPSHOT.jar $JAR_FOLDER/app.jar
    - docker cp $BE_CONTAINER_TEMP:/build/deploy.sh $JAR_FOLDER/deploy
    ## 备份缓存, 在下次使用
    - docker cp $BE_CONTAINER_TEMP:/build/.m2/repository .m2
    ## 删除临时 docker
    - docker rm $BE_CONTAINER_TEMP
dev-deploy:
  stage: stage-deploy
  variables:
    PROFILE_ENV: dev
    PORTS: 8880
    ## FIXME: 这里的机器IP 用于 spring boot admin, 理论上应该使用服务发现的方式 而不是配置 IP
    CURRENT_MACHINE_IP: 172.21.x.7
  script:
    - cd $JAR_FOLDER
    - ./deploy

qa-deploy:
  stage: stage-deploy
  variables:
    PROFILE_ENV: test
    PORTS: 9990 9991
    ## FIXME: 这里的机器IP 用于 spring boot admin, 理论上应该使用服务发现的方式 而不是配置 IP
    CURRENT_MACHINE_IP: 172.21.x.7
  script:
    - cd $JAR_FOLDER
    - ./deploy

prod-deploy:
  tags:
    - prod
  stage: prod-deploy
  when: manual
  variables:
    BUILD_MACHINE_IP: 172.21.x.7
    PROFILE_ENV: prod
    PORTS: 8880 8881
    ## FIXME: 这里的机器IP 用于 spring boot admin, 理论上应该使用服务发现的方式 而不是配置 IP
    CURRENT_MACHINE_IP: 172.21.x.7
  script:
    - scp -Cr kxkq@$BUILD_MACHINE_IP:$JAR_FOLDER/app.jar $JAR_FOLDER
    - scp -Cr kxkq@$BUILD_MACHINE_IP:$JAR_FOLDER/deploy $JAR_FOLDER
    - cd $JAR_FOLDER
    - ./deploy
```

Dockerfile

```
FROM maven:3.6.3-jdk-11-slim

WORKDIR /build
COPY ci_settings.xml .
COPY . /build
RUN mvn package -q -s ci_settings.xml -Dmaven.repo.local=/build/.m2/repository
```

ci_settings.xml

```
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
  https://maven.apache.org/xsd/settings-1.0.0.xsd">

  <servers>
    <server>
      <!--这是server的id（注意不是用户登陆的id），该id与distributionManagement中repository元素的id相匹配。 -->
      <id>nexus</id>
      <username>Youname</username>
      <password>Youpassword</password>
    </server>
  </servers>

  <!--为仓库列表配置的下载镜像列表。  -->
  <mirrors>
    <mirror>
      <!--该镜像的唯一标识符。id用来区分不同的mirror元素。  -->
      <id>nexus</id>
      <!--此处配置所有的构建均从私有仓库中下载 *代表所有，也可以写central -->
      <mirrorOf>*</mirrorOf>
      <name>central repository</name>
      <!--该镜像的URL。构建系统会优先考虑使用该URL，而非使用默认的服务器URL。  -->
      <url>http://maven.youDomain.com/repository/maven-public/</url>
    </mirror>
  </mirrors>

  <profiles>
    <profile>
      <id>nexus</id>
      <!--远程仓库列表，它是Maven用来填充构建系统本地仓库所使用的一组远程项目。  -->
      <repositories>
        <!--发布版本仓库-->
        <repository>
          <id>nexus</id>
          <!--地址是nexus中repository（Releases/Snapshots）中对应的地址-->
          <url>http://maven.youDomain.com/repository/maven-public/</url>
          <!--true或者false表示该仓库是否为下载某种类型构件（发布版，快照版）开启。 -->
          <releases>
            <enabled>true</enabled>
          </releases>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
        </repository>
      </repositories>

      <!-- 定义所有可能用到的插件仓库 -->
      <pluginRepositories>
        <pluginRepository>
          <id>aliyun-central</id>
          <url>http://maven.aliyun.com/repository/central</url>
        </pluginRepository>
      </pluginRepositories>
    </profile>
  </profiles>

  <!--激活配置-->
  <activeProfiles>
    <!--profile下的id-->
    <activeProfile>nexus</activeProfile>
  </activeProfiles>
</settings>
```

deploy.sh

```
[ -z "$PORTS" ] && echo "PORT not defined" && exit 1
[ -z "$CURRENT_MACHINE_IP" ] && echo "CURRENT_MACHINE_IP not defined"
[ -z "$PROFILE_ENV" ] && echo "PROFILE_ENV not defined" && exit 1
[ -z "$JAR_FOLDER" ] && echo "JAR_FOLDER not defined, set to /var/www/site/java" && JAR_FOLDER=/var/www/site/java

## 根据环境不同, 输出日志目录: /var/www/site/java/dev_backend_service.log
APP_NAME=${PROFILE_ENV}_backend_service;
TIMEOUT=60
JAVA_OPTION="-Xmx2g -Xms256m"

for PORT in $PORTS
  do
    CONTAINER_NAME=${APP_NAME}_${PORT};
    if [ "$(docker ps -aq -f status=running -f name="$CONTAINER_NAME")" ]
      then docker stop "$CONTAINER_NAME";
    fi
    sleep 0.5
    echo "Begin to run SpringApp: JAVA_OPTION: $JAVA_OPTION, profile: $PROFILE_ENV, port: $PORT, machineIP: $CURRENT_MACHINE_IP"
    ## 在启动的时候，配置了 spring boot admin 的监控的相关监控
    docker run -d \
      -p "${PORT}":8080 --rm \
      -v "$JAR_FOLDER"/app.jar:/app.jar \
      --name "$CONTAINER_NAME" \
      --env TZ=GMT+8 \
      --env SPRING_PROFILES_ACTIVE="$PROFILE_ENV" \
      --env spring.application.name="$APP_NAME"\
      --env spring.boot.admin.client.enabled=true\
      --env spring.boot.admin.client.instance.service-base-url="http://$CURRENT_MACHINE_IP:$PORT" \
      openjdk:11 \
      java -jar /app.jar "$JAVA_OPTION"

    READY=DOWN
    i=1
    until [ "$READY" == "UP" ]
    do
      ## XXX: 注意，这里需要安装 jq 这个软件, 用来解析 JSON, 否则会导致报错
      READY=$(curl --silent --fail 127.0.0.1:"${PORT}"/actuator/health | jq -r '.status.code')
      sleep 1;
      echo "SpringApp is starting... at ${i}s";
      ((i++))
      ## 默认设置 1分钟 超时, 如果在 1分钟 还未启动成功, 则认为服务无法启动
      if [[ "$i" == "$TIMEOUT" ]]; then
        echo "Timeout over ${TIMEOUT}s..."
        exit 1
      fi
    done
    echo 'SpringApp started';
    docker logs -f "$CONTAINER_NAME" >> $JAR_FOLDER/"$APP_NAME".log 2>&1 &
  done
```

--------
{: data-content=" node " }

```
stages:
  - qa-build
  - prod-build
  - dev-build
  - prod-deploy
variables:
  ## 这个是打包的机器, 为 线上的 qa 环境的机器
  BUILD_MACHINE_IP: 172.21.16.10
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
qa-build:
  stage: qa-build
  tags:
    - adminBuild
  script:
    - npm install --registry=https://registry.npm.taobao.org
    - npm run build:qa
    - mkdir -p /var/www/site/admin_qa
    - cp -rf $PWD/dist/** /var/www/site/admin_qa
dev-build:
  stage: dev-build
  tags:
    - adminBuild
  script:
    - npm install --registry=https://registry.npm.taobao.org
    - npm run build:dev
    - mkdir -p /var/www/site/admin_dev
    - cp -rf $PWD/dist/** /var/www/site/admin_dev
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
    - scp -Cr kxkq@$BUILD_MACHINE_IP:/var/www/site/admin_prod /var/www/site/
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
