
  sml扩展功能包，可基于本身ioc功能，快速引入使用
## sml-server
  内置httpserver，Router-url路由配置，可快速开发rest风格接口服务，服务仅需要-Xxs=4M 即可启动。
```properties
  bean-smlServer=--class=org.hw.sml.server.SmlServer --p-port=${server.port} --p-webapp=${server.webapp} --init-method=init --isDelay=true --sleep=1
```
## sml-manager
  继承sml-server,javaee,servlet规范实现rest风格接口，引入servlet类即可使用，内置管理接口，通用接口，可直接使用sqlMarkup配置过接口
 ```xml
    <servlet>
		<servlet-name>sml-servlet</servlet-name>
		<servlet-class>org.hw.sml.manager.SmlServlet</servlet-class>
		<load-on-startup>2</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>sml-servlet</servlet-name>
		<url-pattern>/sml/*</url-pattern>
	</servlet-mapping>
```
  
## sml-status
  提供一套微服务体系，健康状态统计，简单心跳计算，服务管理等，提供常用的内置服务，可远程控制运行区间各对象参数，方法执行。
  
## sml-helper-jdbc-plugin
  提供对数据库访问操作常用接口,数据库元数据等信息的rest接口
  
## sml-mybatis
  整合mybatis功能，操作简便快速配置多数据源及映射包路径，多路径可用`,`号分隔
```properties
  jdbc.mybatis.dss={defJt:#{datasource}}
  jdbc.mybatis.mapper.package={defJt:'org.hw.sml.mybatis.test,org.hw.sml.mybatis.eee'}
```
## sml-office
  提供对csv，xlsx等文件的简单封装

## sml-server-master
  服务管理，包含管理界面，整体1m不到，管理所有已注册的服务，可访问所有已注册服务，日志等。
## sml-project
  常用项目服务实践
  ### if-web
  接口管理功能，可添加发布rest风格接口服务，现写现用
  ### lsm
  跟spring整合项目

