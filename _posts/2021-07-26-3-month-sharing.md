---
layout: post
categories: showed
toc: true
title: 从 0 到 1 搭建 ease 后端服务
---

该部分为后端团队 (2人) 从0 到 1 搭建的一套架构体系。

>
由于公司和团队的整体规模不大，从业务的发展和业务的复杂度来说，
应选择 **快速部署，成本(机器/运维和部署)低，依赖少，稳定性高** 的架构。

这里的架构主要由三部分构成

- Devops 基于 gitlab CI/CD 轻量级Devops, 可实现完整的快速部署，扩容的操作
- 业务 前后端分离，后端使用 BFF + Microservice 的架构，前端使用 React 技术栈
- 中间件 选择比较稳定的中间件，如 MySQL，Redis 和 ES 等。

从成本问题上考虑，大多数的中间件都是购买的，会根据现有的业务情况选择不同类型的中间件

## 架构
<div class="mermaid" markdown="0">
graph LR;
    arch([Ease 后端架构]);
    op([Devops]);
    op1(gitlab CI/CD)
    op11(自动部署)
    op12(快速扩容)
    op13(权限控制)
    op2(指标数据)
    op3(报警)
    op31(业务数据)
    op32(错误率)
    op33(服务器指标)
    op21(系统/业务数据)
    op22(SLO/SLI)
    op23(SBA)
    op24(压测)
    biz([业务]);
    biz1(Java);
    biz11(BFF <br >App);
    biz12(BFF <br >Admin);
    biz2(React+Antd);
    biz-m1(microservice<br > 内容)
    biz-m3(microservice<br > 支付)
    biz-m4(microservice<br > 用户)
    biz-other(...)
    biz22(CRM);
    biz23(H5);
    sys([中间件]);
    sys0(Nginx);
    sys00(HTTPS);
    sys01(反向代理);
    sys02(负载均衡);
    sys03(HTTP Auth);
    sys1(ELK);
    sys11(日志收集);
    sys12(报表输出);
    sys2(BI);
    sys3(MySQL);
    sys4(Redis);
    sys5(Pulsa队列);
    arch-->op & biz & sys;
    op-->op1 & op2 & op3;
    op1-->op11 & op12 & op13;
    op2-->op21 & op22 & op23 & op24;
    op3-->op31 & op32 & op33;
    biz-->biz1 & biz2;
    biz1-->biz11 & biz12;
    biz2-->biz22 & biz23;
    sys-->sys0 & sys1 & sys2 & sys3 & sys4 & sys5;
    sys1-->sys11 & sys12;
    sys0-->sys00 & sys01 & sys02 & sys03;
    biz11 --> biz-m3 & biz-m4
    biz11 & biz12 --> biz-m1 & biz-other

    style op fill:#f9f,stroke:#333,stroke-width:4px
    style biz fill:#f9f,stroke:#333,stroke-width:4px
    style sys fill:#f9f,stroke:#333,stroke-width:4px

    style op1 fill:#f96f,stroke:#333,stroke-width:4px
    style op2 fill:#f96f,stroke:#333,stroke-width:4px
    style biz1 fill:#f96f,stroke:#333,stroke-width:4px
    style biz2 fill:#f96f,stroke:#333,stroke-width:4px
    style sys0 fill:#f96f,stroke:#333,stroke-width:4px
    style sys1 fill:#f96f,stroke:#333,stroke-width:4px
    style sys2 fill:#f96f,stroke:#333,stroke-width:4px
    style sys3 fill:#f96f,stroke:#333,stroke-width:4px
    style sys4 fill:#f96f,stroke:#333,stroke-width:4px
    style sys5 fill:#f96f,stroke:#333,stroke-width:4px

    style op3 fill:#f96f,stroke-dasharray: 5 5
</div>

### Devops
<div class="mermaid" markdown="0">
graph LR;
    op([Devops]);
    op1(gitlab CI/CD)
    op11(自动部署)
    op12(快速扩容)
    op13(权限控制)
    op2(指标数据)
    op20(日志数据 <br > ELK)
    op21(SLO/SLI <br > Kibana看板)
    op22(系统数据 <br > Netdata)
    op23(业务数据 <br > BI看板)
    op24(SBA <br > Spring Metrics)
    op25(服务质量 <br > TPS)
    op3(报警)
    op31(业务数据)
    op32(错误率)
    op33(服务器指标)
    op-->op1 & op2 & op3;
    op1-->op11 & op12 & op13;
    op2-->op20 & op21 & op22 & op23 & op24 & op25;
    op3-->op31 & op32 & op33;
    click op11 "https://gitlab.easeprime.com/ease/backend_service/-/blob/dev/.gitlab-ci.yml#L17" _blank
    click op12 "https://gitlab.easeprime.com/ease/nginx-prod-conf/-/blob/master/sites-enabled-erb/java" _blank
    click op13 "https://gitlab.easeprime.com/ease/backend_service/-/settings/ci_cd" _blank
    click op1 "https://docs.gitlab.com/ee/ci/introduction/img/gitlab_workflow_example_11_9.png" _blank
    click op20 "https://es-ras1ax3s.kibana.tencentelasticsearch.com:5601/app/discover#/?_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!f,value:900000),time:(from:now-24h,to:now))&_a=(columns:!(message,container.name),filters:!(),index:'16ad3800-cf56-11eb-83c7-d711353ac049',interval:auto,query:(language:kuery,query:''),sort:!())" _blank
    click op21 "http://bi.easeprime.com/question/9?type=STORY&percent=0.99&day=30&playCount=10&dayCreatedAt=30" _blank
    click op22 "http://metrics.easeprime.com" _blank
    click op23 "http://bi.easeprime.com/question/9?type=STORY&percent=0.99&day=30&playCount=10&dayCreatedAt=30" _blank
    click op24 "http://sba.easeprime.com" _blank
    style op3 fill:#f96f,stroke-dasharray: 5 5
</div>

#### Gitlab
1. 时间线

    <div class="mermaid" markdown="0">
    graph LR;
        zero([搭建 gitlab <br /> 4C8G]);
        onlyDev([单分支部署 <br /> dev]);
        multiDev([多分支部署 单机器部署<br /> dev, relase_xxx]);
        multiMachine([多机器部署 <br /> main, backup1, backup2]);
        rollback([支持快速回滚 <br /> app-release1.jar <br /> app-release2.jar <br /> ...]);
        zero-->onlyDev-->multiDev-->multiMachine-->rollback
    </div>

2. 遇到的一些坑

    - 需要在每一台机器中安装 [gitlab-runner](https://docs.gitlab.com/runner/)，runner 需要执行 build/deploy 步骤需要很高的权限
      <details>
      <summary  markdown="0">
      eg
      </summary>
      ```
      gitlab-runner ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /usr/bin/cp
      ```
      </details>
    - gitlab 需要和每一个 runner 进行心跳连接, 存储对应的信息, 再加上很多文件操作, 非常[耗费内存](https://docs.gitlab.com/omnibus/settings/memory_constrained_envs.html), 需要设置服务器 SWAP
      <details>
      <summary  markdown="0">
      swap
      </summary>
      > Swap is **a dedicated space on disk that is used when physical RAM is full**.
      </details>
    - gitlab 和 gitee 对比

      | 维度 | gitee | gitlab |
      | :-------------: | :-------------: | :-------------: |
      | 运维成本 | 低 | [较高](https://github.com/sameersbn/docker-gitlab/blob/master/docker-compose.yml) |
      | CI/CD能力 | 低，本身的 Gitee Go 在[内测](https://gitee.com/help/articles/4293#article-header0)中, 官方建议使用 Jenkins 等第三方工具 | 高, gitlab-runner 已具备完整生产能力 |
      | 稳定性 | 高 | 低 |
      | 安全性 | 较高 | 高 |
      | 是否收费 | 基本功能免费, CI/CD 有对应的免费时长 | 免费 |

### 业务
<div class="mermaid" markdown="0">
graph LR;
    biz([业务]);
    biz1(Java);
    biz11(BFF <br >App);
    biz12(BFF <br >Admin);
    biz2(React+Antd);
    biz-m1(microservice<br > 内容<br >单曲 合集 Q&E 老师等)
    biz-m3(microservice<br > 支付<br > 微信 支付宝 华为支付 苹果支付)
    biz-m4(microservice<br > 用户<br >登录/注册 反馈 VIP信息)
    biz-m5(microservice<br > 运营活动<br > 广告 Banner 优惠活动)
    biz-m6(microservice<br > 用户日志<br >音频播放日志)
    biz-m7(microservice<br > RBAC<br >权限 角色)
    biz22(CRM);
    biz23(H5);
    biz-->biz1 & biz2;
    biz1-->biz11 & biz12;
    biz2-->biz22 & biz23;
    biz11 --> biz-m3 & biz-m4 & biz-m6
    biz11 & biz12 --> biz-m1 & biz-m5 & biz-m7
</div>

#### BFF
BFF, Backend for Frontend

BFF 层为流量入口, 主要处理 鉴权，参数校验，拼装 microservice 接口中需要的参数，并聚合各个 microservice 的返回结果, 一般来说，我们的缓存也会放在 BFF 层

<div class="mermaid" markdown="0">
graph LR;
    biz1(首页为你接口 <br />/tag/media/group/v2/forYou);
    check(校验参数 获取用户id);
    biz11(内容<br >单曲 合集 Q&E 老师等);
    biz12(用户<br > VIP信息);
    biz13(运营活动<br > 广告 Banner 优惠活动);
    biz14(用户日志<br >音频播放日志);
    final(聚合数据)
    biz1-->check-->biz11 & biz12 & biz13 & biz14-->final;

    style biz11 fill:#f96f,stroke-dasharray: 5 5
    style biz13 fill:#f96f,stroke-dasharray: 5 5
</div>

### 中间件
<div class="mermaid" markdown="0">
graph LR;
    sys([中间件]);
    sys0(Nginx);
    sys00(HTTPS);
    sys01(反向代理);
    sys02(负载均衡);
    sys03(HTTP Auth);
    sys1(ELK);
    sys11(日志收集);
    sys12(报表输出);
    sys2(BI/大数据);
    sys3(MySQL);
    sys4(Redis);
    sys5(Pulsa队列);
    sys-->sys0 & sys1 & sys2 & sys3 & sys4 & sys5;
    sys0-->sys00 & sys01 & sys02 & sys03;
    sys1-->sys11 & sys12;
</div>

#### Nginx
1. 时间线

    <div class="mermaid" markdown="0">
    graph LR;
        doInMachine([服务器进行配置]);
        restart([手动进行重启服务]);
        hard([扩容困难且容易配置错误]);
        gitLab([配置文件用git进行管理]);
        erb([配置文件模板化 <br > 支持环境变量]);
        ci([gitlab-ci核心数据配置 <br > 进行配置检查 和 服务重启]);
        doInMachine-->restart-->hard-->gitLab-->erb-->ci
    </div>

    - [nginx-dev&qa-conf](https://gitlab.easeprime.com/ease/nginx-stage-conf)
    - [nginx-prod-conf](https://gitlab.easeprime.com/ease/nginx-prod-conf)

    <details>
    <summary  markdown="0">
    Nginx CI 过程
    </summary>
    1. 编写 ERB 文件, 如 java-dev-erb 文件
        ```
        upstream java_dev_server {
           server <%= ENV["JAVA_DEV_HOST"] %>:8880;
           server <%= ENV["JAVA_DEV_HOST"] %>:8881;
        }
        server {
                listen 80;

                server_name dev-api.easeprime.com;
                location / {
                    proxy_pass http://java_dev_server;
                }
        }
        ```
    2. 在 gitlab-ci 中配置环境变量
        ```
        variables:
          DEV_HOST: 172.21.0.7 
          JAVA_DEV_HOST: $DEV_HOST
        ```
    3. 生成最终的配置文件
        ```
        erb java-dev-erb java-dev
        ```
    4. 拷贝文件, 并检查配置, 无问题后重启 nginx
        ```
        nginx -t
        nginx -s reload
        ```
    </details>

2. 遇到的一些坑

    - nginx 的配置文件[不支持环境变量](https://serverfault.com/questions/577370/how-can-i-use-environment-variables-in-nginx-conf)，只能通过 shell 脚本如 envsubstr 或者第三方工具来进行配置，这里用的是 ruby 的 [erb](https://docs.ruby-lang.org/en/2.3.0/ERB.html) 生成的 nginx 配置文件
    - nginx 的配置语法比较 tricky, 学习成本比较高

    <details>
    <summary  markdown="0">
    eg.
    </summary>
    ```
     location ~* /swagger-ui/.+\.html$ {
       proxy_pass http://java_dev_server;

     auth_basic "Private Property";
     auth_basic_user_file /etc/nginx/.htpasswd;
     }
    ```
    </details>

#### ELK
<details>
<summary  markdown="0">
what is ELK?
</summary>

>[E，elasticsearch; L，logstash; K，kibana](https://www.elastic.co/static-res/images/elk/elk-stack-elkb-diagram.svg)
>
beats 收集日志, logstash 处理日志, elasticsearch 存储日志, kibana 查询数据。例子如下
>
1. filebeat收集服务日志: 
  ```
  { "message": "2021-07-27 10:52:42.066  INFO 1 --- ..., url = /api/advertisement/detail, caller = {}, params = [{"code":"relax"}], result = {"code":"200","status":200}, time cost = 3 ms" }
  ```
2. logstash处理, 将 message 中的 url 和 耗时提取出来
  ```
  {
        "message": "原来的message字段",
        "url": "/api/advertisement/detail",
        "timeCost": 3
  }
  ```
3. ES存储数据，并更新结构数据, 自动添加 url 和 timecost 字段
4. Kibana 统一提供查询, 可以通过 url 和 timecost 字段进行[查询和聚合处理](https://es-ras1ax3s.kibana.tencentelasticsearch.com:5601/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(message,container.name,reqUri,reqTime),filters:!(),index:'16ad3800-cf56-11eb-83c7-d711353ac049',interval:auto,query:(language:kuery,query:''),sort:!()))
</details>

1. 时间线

    <div class="mermaid" markdown="0">
    graph LR;
        mainMade([自建 ELK]);
        buy([购买 ES 集群 和 Kibana]);
        logstash([自建 Logstash]);
        handle([利用 Logstash 处理数据]);
        upload([上传处理后的数据至 ES]);
        kanban([搭建 SLO/SLI 看板]);
        mainMade-->buy-->logstash-->handle-->upload-->kanban
    </div>

2. 遇到的一些坑

    - elasticsearch 本身会使用堆外内存, 即使设置了最大内存限制 Xmx 也没有用, 很容易导致 OOM
    - logstash 本身的 [gork 功能](https://logz.io/blog/logstash-grok/)很强大, 但是很难[调试](https://es-ras1ax3s.kibana.tencentelasticsearch.com:5601/app/dev_tools#/grokdebugger), 而且在 ES 的字段类型重建 [tricky](https://discuss.elastic.co/t/how-to-update-a-field-type-of-existing-index-in-elasticsearch/53892)
      <details>
      <summary  markdown="0">
      eg
      </summary>
      ```ruby
      input { beats { port => 5044 } tcp { port => 5000 } }

      filter {
        grok {
          match => { "message" => ['%{TIMESTAMP_ISO8601:reqTime}  %{GREEDYDATA} %{URIPATH:reqUri}, %{GREEDYDATA}time cost = %{NUMBER:reqCostMs} ms'] }
        }
        mutate {
          convert => { "reqCostMs" => "integer" }
        }
        date {
          match => [ "reqTime", "ISO8601", "YYYY-MM-dd HH:mm:ss", "YYYY-MM-dd HH:mm:ss.ZZZ" ]
            target => "reqTime"
            locale => "en"
        }
      }
      output {
        elasticsearch {
          hosts => "172.21.16.2:9200"
            ecs_compatibility => disabled
        }
      }
      ```
      </details>


## What the next...
- 生产优先
  + 推荐
  + 搜索
  + 分享
  + 营销活动
  + 大数据分析
- 服务化
  + K8S
  + 核心 SLO/SLI 统计和监控

  > 只有在业务量起来之后，推荐，大数据，微服务这些才会有意义

<div class="mermaid" markdown="0">
graph LR;
    op([Devops]);
    op1(gitlab CI/CD)
    op10(K8S)
    op11(自动部署)
    op12(快速扩容)
    op13(权限控制)
    op14(日志输出)
    op15(监控报警)
    op2(指标数据)
    op21(SLO/SLI <br > Kibana看板)
    op22(系统数据 <br > Netdata)
    op23(业务数据 <br > BI看板)
    op3(报警)
    op31(业务数据)
    op32(错误率)
    op33(服务器指标)
    op-->op1 & op2 & op3;
    op1-->op10-->op11 & op12 & op13 & op14 & op15;
    op2-->op21 & op22 & op23;
    op3-->op31 & op32 & op33;
    click op11 "https://gitlab.easeprime.com/ease/backend_service/-/blob/dev/.gitlab-ci.yml#L17" _blank
    click op12 "https://gitlab.easeprime.com/ease/nginx-prod-conf/-/blob/master/sites-enabled-erb/java" _blank
    click op13 "https://gitlab.easeprime.com/ease/backend_service/-/settings/ci_cd" _blank
    click op1 "https://docs.gitlab.com/ee/ci/introduction/img/gitlab_workflow_example_11_9.png" _blank
    click op20 "https://es-ras1ax3s.kibana.tencentelasticsearch.com:5601/app/discover#/?_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!f,value:900000),time:(from:now-24h,to:now))&_a=(columns:!(message,container.name),filters:!(),index:'16ad3800-cf56-11eb-83c7-d711353ac049',interval:auto,query:(language:kuery,query:''),sort:!())" _blank
    click op21 "http://bi.easeprime.com/question/9?type=STORY&percent=0.99&day=30&playCount=10&dayCreatedAt=30" _blank
    click op22 "http://metrics.easeprime.com" _blank
    click op23 "http://bi.easeprime.com/question/9?type=STORY&percent=0.99&day=30&playCount=10&dayCreatedAt=30" _blank
    click op24 "http://sba.easeprime.com" _blank

    style op10 fill:#f96f,stroke-dasharray: 5 5
    style op11 fill:#f96f,stroke-dasharray: 5 5
    style op12 fill:#f96f,stroke-dasharray: 5 5
    style op13 fill:#f96f,stroke-dasharray: 5 5
    style op14 fill:#f96f,stroke-dasharray: 5 5
    style op15 fill:#f96f,stroke-dasharray: 5 5
    style op3 fill:#f96f,stroke-dasharray: 5 5
</div>
