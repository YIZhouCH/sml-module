-- 接口表---
create table DM_CO_BA_CFG_RCPT_IF
(
  id             VARCHAR(128) primary key,
  mainsql        text,
  rebuild_info   text,
  condition_info VARCHAR(4000) default '{}',
  cache_enabled  int DEFAULT '0',
  cache_minutes  int DEFAULT '5',
  db_id          VARCHAR(128),
  `describe`       VARCHAR(4000),
  update_time    datetime
);
create table DM_CO_BA_CFG_RCPT_IF_LOG
(
  id             VARCHAR(128),
  mainsql        text,
  rebuild_info   text,
  condition_info VARCHAR(4000) default '{}',
  cache_enabled  int DEFAULT '0',
  cache_minutes  int DEFAULT '5',
  db_id          VARCHAR(128),
  `describe`       VARCHAR(4000),
  update_time    datetime
);
-- 菜单表---
create table DM_CO_BA_CFG_RCPT_IF_MENU
(
  id          VARCHAR(128) primary key,
  name        VARCHAR(256),
  type        int,
  parent_id   VARCHAR(128),
  descr       VARCHAR(256),
  creator     VARCHAR(25),
  update_time VARCHAR(25),
  seq         int
);
-- 包装器表----
create table DM_CO_BA_CFG_RCPT_IF_BUILDER
(
  id        int primary key,
  name      VARCHAR(256),
  classpath VARCHAR(256),
  jar       VARCHAR(128),
  descr     VARCHAR(256),
  type      VARCHAR(25)
);
-- 测试样例表----
create table DM_CO_BA_CFG_RCPT_IF_EG
(
  id         VARCHAR(128),
  param_info VARCHAR(512),
  db_id      VARCHAR(128),
  descr      VARCHAR(128),
  url        VARCHAR(256),
  id_eg      VARCHAR(128) not null primary key
);
-- 初始化数据
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-test-001', 'if-test-001', '1', '20171204140641', '接口', 'hw', null, '2147483647');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('20161105165300', '接口管理', '0', '0', '接口管理', '', null, '0');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('0', '接口管理', '0', '00', '总目录', '', null, null);
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-enum-dss', '接口配置管理-数据源枚举', '1', '20161105165300', '接口', 'hw', null, '5');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngBuilderQuery', '接口配置管理-包装器枚举', '1', '20161105165300', '无', 'zxw', null, '1');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngEgQuery', '接口配置管理-测试样例查询', '1', '20161105165300', '接口配置管理-测试样例查询', 'zxw', '20171215151614', '7');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngEgUpdate', '接口配置管理-测试样例表update操作', '1', '20161105165300', 'hw', 'zxw', null, '8');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngFieldQuery', '接口配置管理-根据id查字段查询', '1', '20161105165300', '接口配置管理-根据id查字段查询', 'zxw', null, '9');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngIfUpdate', '接口配置管理-接口表update操作', '1', '20161105165300', '接口配置管理-接口表update操作', 'zxw', null, '10');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngLike', '接口配置管理-模糊查询', '1', '20161105165300', 'fq', 'zxw', '20171215152935', '3');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngLogUpdate', '接口配置管理-日志表update操作', '1', '20161105165300', '接口配置管理-日志表update操作', 'zxw', null, '11');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngMenu', '接口配置管理-菜单-展示', '1', '20161105165300', '测试', 'zxw', '20171215151827', '2');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-interMngTreeOrLike', '接口配置管理-树图展示', '1', '20161105165300', 'HW', 'zxw', '20171215151101', '6');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('if-cfg-copyInter', '接口配置管理-复制接口', '1', '20161105165300', '接口', 'hw', '20171215154325', '4');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('20171208162801', '系统管理', '0', '0', '目录', 'hw', '20171215154840', '2147483647');

-- 接口--
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-copyInter', '<if test=\" \'@opLinks\'==\'menu\' \">\ninsert into dm_co_ba_cfg_rcpt_if_menu\nselect #id#,#name#,type,parent_id,descr,creator,now(),seq from dm_co_ba_cfg_rcpt_if_menu where id=#oldId#\n</if>\n\n<if test=\" \'@opLinks\'==\'if\' \">\ninsert into dm_co_ba_cfg_rcpt_if\nselect #id#,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,#name#,NOW() from dm_co_ba_cfg_rcpt_if where id=#oldId#\n</if>\n\n', 'DefaultDataBuilder\n#拦截-返回key是否小写拦截\ntoLowerCaseForKey=false\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\noriFields=\nnewFields=\nigFieldFilter=false', '{\n\"sqlParams\":\n[\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"接口id\",\"enabled\":\"0\"},\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"接口名称\",\"enabled\":\"0\"},\n{\"name\":\"opLinks\",\"type\":\"char\",\"defaultValue\":\"menu-if\",\"descr\":\"menu-if\",\"enabled\":\"0\"},\n{\"name\":\"oldId\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"老接口id\",\"enabled\":\"0\"}\n]\n}', '0', '0', 'defJt', '接口配置管理-复制接口', '2017-12-15 15:43:25');
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-enum-dss', 'select \'defJt\' as \"id_\",\'默认\' as \"name_\" from dual\r\nunion all\r\nselect \'ahDC\' ,\'资源库\'  from dual\r\nunion all\r\nselect \'master\',\'系统库源\' from dual', 'GroupFieldDataBuilder\r\ngroupname=id_\r\noriFields=id_,name_\r\nnewFields=id_,name_@el(\'#{T(sun.misc.BASE64Encoder).encode(#{(\'$value\').getBytes()})}\')', '{}', '1', '120', 'defJt', '接口配置管理-数据源枚举', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngBuilderQuery', 'select ID,NAME,CLASSPATH,JAR,DESCR,TYPE from dm_co_ba_cfg_rcpt_if_builder ', '0\r\ntoLowerCaseForKey=false', 'defJt', '1', '120', 'defJt', '接口配置管理-包装器枚举', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngEgQuery', 'select ID,PARAM_INFO,DB_ID,DESCR,URL,ID_EG from DM_CO_BA_CFG_RCPT_IF_EG where id=#id#', 'DefaultDataBuilder\ntoLowerCaseForKey=false', '{\n\"sqlParams\":\n[\n{\"name\":\"id\",\"type\":\"char\",\"enabled\":\"1\"}\n]\n}', '0', '0', 'defJt', '接口配置管理-测试样例查询', '2017-12-15 15:16:14');
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngEgUpdate', '<if test=\" \'@update_type\'==\'insert\' \">\r\n  insert into DM_CO_BA_CFG_RCPT_IF_EG(id,param_info,db_id,descr,url,id_eg) values(#id#,#param_info#,#db_id#,#descr#,#url#,#id_eg#)\r\n</if>\r\n\r\n<if test=\" \'@update_type\'==\'delete\' \">\r\n  delete from DM_CO_BA_CFG_RCPT_IF_EG where id_eg=#id_eg#\r\n</if>\r\n\r\n<if test=\" \'@update_type\'==\'deleteId\' \">\r\n  delete from DM_CO_BA_CFG_RCPT_IF_EG where id=#id#\r\n</if>\r\n\r\n\r\n<if test=\" \'@update_type\'==\'update\' \">\r\n  update DM_CO_BA_CFG_RCPT_IF_EG set id=#id#,param_info=#param_info#,db_id=#db_id#,descr=#descr#,url=#url# where id_eg=#id_eg#\r\n</if>', '{\"type\":\"0\"}', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"id\"},\r\n{\"name\":\"param_info\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"db_id\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"descr\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"url\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"update_type\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"id_eg\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"}\r\n]\r\n}', '0', '0', 'defJt', '接口配置管理-测试样例表update操作', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngFieldQuery', ' select\r\n<isNotEmpty property=\"fields\">\r\n    $fields$\r\n</isNotEmpty>\r\n<isEmpty property=\"fields\">\r\n        ID, MAINSQL,REBUILD_INFO,CONDITION_INFO,CACHE_ENABLED,CACHE_MINUTES,DB_ID,`DESCRIBE`,UPDATE_TIME\r\n</isEmpty>\r\nfrom  dm_co_ba_cfg_rcpt_if  where id=#id#', '{\"type\":\"0\"}', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"enabled\":\"1\"},\r\n{\"name\":\"fields\",\"type\":\"char\",\"enabled\":\"1\",\"defaultValue\":\"\",\"descr\":\"是否所有\"}\r\n]\r\n}', '0', '0', 'defJt', '接口配置管理-根据id查字段查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngIfUpdate', '<if test=\" \'@update_type\'==\'insert\' \">\r\n  insert into dm_co_ba_cfg_rcpt_if(id,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,`describe`,update_time)\r\n  values(#id#,#mainsql#,#rebuild_info#,#condition_info#,#cache_enabled#,#cache_minutes#,#db_id#,#describe#,#update_time#)\r\n</if>\r\n\r\n<if test=\" \'@update_type\'==\'delete\' \">\r\n  delete from dm_co_ba_cfg_rcpt_if where id=#id#\r\n</if>\r\n\r\n\r\n<if test=\" \'@update_type\'==\'update\' \">\r\n  update dm_co_ba_cfg_rcpt_if set mainsql=#mainsql#,rebuild_info=#rebuild_info#,condition_info=#condition_info#,\r\n  cache_enabled=#cache_enabled#,cache_minutes=#cache_minutes#,db_id=#db_id#,`describe`=#describe#,update_time=#update_time#  where id=#id#\r\n</if>', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=\r\nnewFields=\r\nigFieldFilter=false', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"id\"},\r\n{\"name\":\"mainsql\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"rebuild_info\",\"type\":\"number\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"condition_info\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"cache_enabled\",\"type\":\"number\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"cache_minutes\",\"type\":\"number\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n\r\n{\"name\":\"db_id\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"describe\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"update_time\",\"type\":\"date\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"update_type\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"}\r\n]\r\n}', '0', '0', 'defJt', '接口配置管理-接口表update操作', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngLike', '<select id=\"select\">\nselect substring(id,1,instr(id,\'-\')-1)  SIGN ,id ID,case when `describe` is null then id else `describe` end as `DESCRIBE`  from dm_co_ba_cfg_rcpt_if where 1=1\n<isNotEmpty property=\"id\"> and  id like \'%\'||#id#||\'%\'  </isNotEmpty>\n<isNotEmpty property=\"describe\"> and (`describe` like \'%\'||#describe#||\'%\'  or id like \'%\'||#describe#||\'%\')</isNotEmpty>\n</select>\n<if test=\" \'@queryType\'==\'select\' \">\n     <included id=\"select\"/> limit 0,$limit$ \n</if>\n<if test=\" \'@queryType\'==\'count\' \">\n     select count(1) from (<included id=\"select\"/>) t\n</if>\n\n', 'PageDataBuilder\n#分页相关参数名称标识设定\npageMark=page\nlimitMark=limit\n#拦截-返回key是否小写拦截\ntoLowerCaseForKey=false\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\noriFields=UPDATE_TIME\nnewFields=UPDATE_TIME@date(\'yyyy-MM-dd HH:mm:ss\')\nigFieldFilter=true', '{\n  \"sqlParams\": [\n    {\n      \"name\": \"id\",\n      \"type\": \"char\",\n      \"defaultValue\": \"\",\n      \"descr\": \"id\",\n      \"enabled\": \"1\"\n    },\n    {\n      \"name\": \"describe\",\n      \"type\": \"char\",\n      \"defaultValue\": \"\",\n      \"descr\": \"id\",\n      \"enabled\": \"1\"\n    },\n    {\n      \"name\": \"queryType\",\n      \"type\": \"char\",\n      \"defaultValue\": \"count\",\n      \"descr\": \"查询选择\",\n      \"enabled\": \"1\"\n    },\n    {\n      \"name\": \"page\",\n      \"type\": \"number\",\n      \"defaultValue\": \"1\",\n      \"descr\": \"当前页\",\n      \"enabled\": \"1\"\n    },\n    {\n      \"name\": \"limit\",\n      \"type\": \"char\",\n      \"defaultValue\": \"10\",\n      \"descr\": \"每页大小\",\n      \"enabled\": \"1\"\n    },\n    {\n      \"name\": \"sidx\",\n      \"type\": \"char\",\n      \"defaultValue\": \"id\",\n      \"descr\": \"排序字段\",\n      \"enabled\": \"1\"\n    },\n    {\n      \"name\": \"sord\",\n      \"type\": \"char\",\n      \"defaultValue\": \"asc\",\n      \"descr\": \"排序方式\",\n      \"enabled\": \"1\"\n    }\n  ]\n}', '0', '0', 'defJt', '接口配置管理-模糊查询', '2017-12-15 15:29:35');
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngLogUpdate', '<if test=\" \'@update_type\'==\'insert\' \">\r\n  insert into DM_CO_BA_CFG_RCPT_IF_LOG(id,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,`describe`,update_time) \r\n  values(#id#,#mainsql#,#rebuild_info#,#condition_info#,#cache_enabled#,#cache_minutes#,#db_id#,#describe#,#update_time#)\r\n</if>', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=\r\nnewFields=\r\nigFieldFilter=false', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"id\"},\r\n{\"name\":\"mainsql\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"rebuild_info\",\"type\":\"number\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"condition_info\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"cache_enabled\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"cache_minutes\",\"type\":\"number\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"db_id\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"describe\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"update_time\",\"type\":\"date\",\"enabled\":\"1\",\"descr\":\"地市id\"},\r\n{\"name\":\"update_type\",\"type\":\"char\",\"enabled\":\"1\",\"descr\":\"地市id\"}\r\n]\r\n}', '0', '0', 'defJt', '接口配置管理-日志表update操作', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngMenu', '<if test=\" \'@query_type\'==\'menu\' \">\nselect ID,NAME,TYPE,PARENT_ID,CREATOR,UPDATE_TIME,SEQ,DESCR from dm_co_ba_cfg_rcpt_if_menu order by type,seq,parent_id\n</if>\n\n<if test=\" \'@update_type\'==\'insert\' \">\ninsert into dm_co_ba_cfg_rcpt_if_menu(id,name,type,parent_id,descr,creator,update_time)\nvalues(#id#,#name#,#type#,#parent_id#,#descr#,#creator#,#update_time#)\n</if>\n\n<if test=\" \'@update_type\'==\'update\' \">\nupdate  dm_co_ba_cfg_rcpt_if_menu set name=#name#,type=#type#,parent_id=#parent_id#,\n descr = #descr#,  creator=#creator#, update_time=#update_time#  where id=#id#\n</if>\n\n<if test=\" \'@update_type\'==\'deleteIf\' \">\ndelete from dm_co_ba_cfg_rcpt_if_menu where id=#id#\n</if>\n\n<if test=\" \'@update_type\'==\'deleteMenu\' \">\ndelete from dm_co_ba_cfg_rcpt_if_menu where id=#id#\n</if>', '{\n\"type\":3,\n\"groupname\":\"ID\"\n}', 'query_type,char\nupdate_type,char\nid,char\nname,char\ntype,char\nparent_id,char\ndescr,char\ncreator,char\nupdate_time,char', '0', '0', 'defJt', '接口配置管理-菜单-展示', '2017-12-15 15:18:27');
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('if-cfg-interMngTreeOrLike', 'select substring(id,1,instr(id,\'-\')-1)  SIGN,id ID,case when `describe` is null then id else `describe` end `DESCRIBE`,update_time UPDATE_TIME from dm_co_ba_cfg_rcpt_if\nwhere id like \'%-%\'\n<isNotEmpty property=\"id\"> and id like \'%\'||#id#||\'%\' </isNotEmpty>\norder by sign ', 'GroupFieldDataBuilder\ngroupname=SIGN\noriFields=\nnewFields=', '{\n  \"sqlParams\": [\n    {\n      \"name\": \"id\",\n      \"type\": \"char\",\n      \"enabled\": \"1\",\n      \"defaultValue\": \"\"\n    },\n    {\n      \"name\": \"formatJson\",\n      \"type\": \"char\",\n      \"defaultValue\": \"false\",\n      \"enabled\": \"1\"\n    }\n  ]\n}', '0', '0', 'defJt', '接口配置管理-树图展示', '2017-12-15 15:11:01');

-- 包装器---
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('1', '分页页面请求，返回Result(count,datas)', 'PageDataBuilder', '', 'page=1\r\nlimit=20', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('10', '分组-返回-Map<Object,Map<String,Object>>', 'GroupFieldDataBuilder', '', 'groupname=\r\noriFields=\r\nnewFields=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('2', '默认包装器', 'DefaultDataBuilder', '', 'toLowerCaseForKey=false', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('3', '表头重命名包装求', 'FieldDataBuilder', '', 'oriFields=\r\nnewFields=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('4', '二次分组-Single返回-Map<V,Map<V,Map<K,V>>>', 'Group2FieldDataBuilder', '', 'groupname=\r\noriFields=\r\nnewFields=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('5', '二次分组-返回-Map<V,Map<V,List<Map<K,V>>>>', 'Group2FieldListDataBuilder', '', 'groupname=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('6', '分组-返回-Map<V,List<Map<K,V>>>', 'GroupDataBuilder', '', 'groupname=\r\ngroupFields=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('7', '重命名', 'MapDataBuilder', '', 'oriFields=\r\nnewFields=\r\nextMap=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('8', '结果格式包装器-返回-Map<String,List<Object>>', 'MapListDataBuilder', '', 'oriFields=\r\nnewFields=\r\nextMap=', '');
INSERT INTO dm_co_ba_cfg_rcpt_if_builder VALUES ('9', '排序并取TopN', 'OrderDataBuilder', '', 'orderName=\r\norderType=\r\ntopN=', '');

