create table DM_CO_BA_CFG_RCPT_IF
(
  id             VARCHAR2(128) not null,
  mainsql        CLOB,
  rebuild_info   CLOB default '{}',
  condition_info VARCHAR2(4000) default '{}',
  cache_enabled  NUMBER default 0,
  cache_minutes  NUMBER default 5,
  db_id          VARCHAR2(128),
  describe       VARCHAR2(4000),
  update_time    DATE default sysdate
);
insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngBuilderQuery', 'select * from dm_co_ba_cfg_rcpt_if_builder ', '0
toLowerCaseForKey=false', 'defJt', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngEgQuery', 'select * from DM_CO_BA_CFG_RCPT_IF_EG where id=#id#', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngEgUpdate', '<if test=" ''@update_type''==''insert'' ">
  insert into DM_CO_BA_CFG_RCPT_IF_EG(id,param_info,db_id,descr,url,id_eg) values(#id#,#param_info#,#db_id#,#descr#,#url#,#id_eg#)
</if>

<if test=" ''@update_type''==''delete'' ">
  delete from DM_CO_BA_CFG_RCPT_IF_EG where id_eg=#id_eg#
</if>

<if test=" ''@update_type''==''deleteId'' ">
  delete from DM_CO_BA_CFG_RCPT_IF_EG where id=#id#
</if>


<if test=" ''@update_type''==''update'' ">
  update DM_CO_BA_CFG_RCPT_IF_EG set id=#id#,param_info=#param_info#,db_id=#db_id#,descr=#descr#,url=#url# where id_eg=#id_eg#
</if>', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"param_info","type":"char","enabled":"1","descr":"地市id"},
{"name":"db_id","type":"char","enabled":"1","descr":"地市id"},
{"name":"descr","type":"char","enabled":"1","descr":"地市id"},
{"name":"url","type":"char","enabled":"1","descr":"地市id"},
{"name":"update_type","type":"char","enabled":"1","descr":"地市id"},
{"name":"id_eg","type":"char","enabled":"1","descr":"地市id"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngFieldQuery', '  select 
<isNotEmpty property="fields">
    $fields$
</isNotEmpty>
<isEmpty property="fields">
        id, mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,describe,update_time
</isEmpty>
from  dm_co_ba_cfg_rcpt_if  where id=#id#', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1"},
{"name":"fields","type":"char","enabled":"1","defaultValue":"","descr":"是否所有"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngIfUpdate', '<if test=" ''@update_type''==''insert'' ">
  insert into dm_co_ba_cfg_rcpt_if(id,mainsql,rebuild_info,condition_info,cache_enabled,cache_minutes,db_id,describe,update_time) 
  values(#id#,#mainsql#,#rebuild_info#,#condition_info#,#cache_enabled#,#cache_minutes#,#db_id#,#describe#,#update_time#)
</if>

<if test=" ''@update_type''==''delete'' ">
  delete from dm_co_ba_cfg_rcpt_if where id=#id#
</if>


<if test=" ''@update_type''==''update'' ">
  update dm_co_ba_cfg_rcpt_if set mainsql=#mainsql#,rebuild_info=#rebuild_info#,condition_info=#condition_info#,
  cache_enabled=#cache_enabled#,cache_minutes=#cache_minutes#,db_id=#db_id#,describe=#describe#,update_time=#update_time#  where id=#id#
</if>', '{"type":"0"}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"mainsql","type":"char","enabled":"1","descr":"地市id"},
{"name":"rebuild_info","type":"number","enabled":"1","descr":"地市id"},
{"name":"condition_info","type":"char","enabled":"1","descr":"地市id"},
{"name":"cache_enabled","type":"number","enabled":"1","descr":"地市id"},
{"name":"cache_minutes","type":"number","enabled":"1","descr":"地市id"},

{"name":"db_id","type":"char","enabled":"1","descr":"地市id"},
{"name":"describe","type":"char","enabled":"1","descr":"地市id"},
{"name":"update_time","type":"date","enabled":"1","descr":"地市id"},
{"name":"update_type","type":"char","enabled":"1","descr":"地市id"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngLike', '<select id="select">

select substr(id,1,instr(id,''-'',1)-1)  sign ,id,mainsql,rebuild_info,condition_info,cache_enabled,db_id,describe,to_char(update_time,''yyyy-mm-dd hh24:mi:ss'') update_time from dm_co_ba_cfg_rcpt_if where 1=1 
<isNotEmpty property="id"> and  id like ''%''||#id#||''%'' </isNotEmpty> 
<isNotEmpty property="describe"> and describe like ''%''||#describe#||''%'' </isNotEmpty> 

</select>

<if test=" ''@queryType''==''select'' ">
      select * from (select t1.*, rownum row_ from (<included id="select"/>  
      <isNotEmpty property="sidx">
            order by $sidx$ $sord$ nulls last
      </isNotEmpty>
      ) t1) where row_ >= (#page# - 1) * #limit# + 1 and row_ < #page# * #limit# + 1 
 </if>
<if test=" ''@queryType''==''count'' ">
      select count(1) as "total"   from (<included id="select"/>) 
</if> ', '{"classpath":"com.eastcom_sw.inas.core.service.jdbc.build.lmaps.PageDataBuilder"
}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1","descr":"id"},
{"name":"describe","type":"char","enabled":"1","descr":"id"},
{"name":"queryType","type":"char","enabled":"1","defaultValue":"count","descr":"地市id"},
{"name":"page","type":"number","enabled":"1","defaultValue":"1","descr":"地市id"},
{"name":"limit","type":"char","enabled":"1","defaultValue":"10","descr":"地市id"},
{"name":"sidx","type":"char","enabled":"1","defaultValue":"id","descr":"地市id"},
{"name":"sord","type":"char","enabled":"1","defaultValue":"asc","descr":"地市id"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngLogUpdate', 'select * from dm_co_ba_cfg_rcpt_if_builder ', '0
toLowerCaseForKey=false', 'defJt', 0, 5, 'if-cfg-interMngBuilderQuery', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngMenu', '<if test=" ''@query_type''==''menu'' ">
select * from dm_co_ba_cfg_rcpt_if_menu start with id=''0''
　　connect by prior id=parent_id
</if>

<if test=" ''@update_type''==''insert'' ">
insert into dm_co_ba_cfg_rcpt_if_menu(id,name,type,parent_id,descr,creator,update_time) 
values(#id#,#name#,#type#,#parent_id#,#descr#,#creator#,#update_time#)
</if>

<if test=" ''@update_type''==''update'' ">
update  dm_co_ba_cfg_rcpt_if_menu set name=#name#,type=#type#,parent_id=#parent_id#,
 descr = #descr#,  creator=#creator#, update_time=#update_time#  where id=#id#
</if>

<if test=" ''@update_type''==''deleteIf'' ">
delete from dm_co_ba_cfg_rcpt_if_menu where id=#id#
</if>

<if test=" ''@update_type''==''deleteMenu'' ">
delete from dm_co_ba_cfg_rcpt_if_menu where id in (select id from dm_co_ba_cfg_rcpt_if_menu start with id =#id# connect by prior id=parent_id)
</if>', '{
"type":3,
"groupname":"ID"
}', 'query_type,char
update_type,char
id,char
name,char
type,char
parent_id,char
descr,char
creator,char
update_time,char', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));

insert into dm_co_ba_cfg_rcpt_if (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('if-cfg-interMngTreeOrLike', 'select substr(id,1,instr(id,''-'',1)-1)  sign ,id,nvl(describe,id) describe,to_char(update_time,''yyyy-mm-dd hh24:mi:ss'') update_time from dm_co_ba_cfg_rcpt_if
where id like ''%-%''
<isNotEmpty property="id"> and id like ''%''||#id#||''%'' </isNotEmpty> 
order by sign ', '{
"type":2,
"groupname":"SIGN"
}', '{
"sqlParams":
[
{"name":"id","type":"char","enabled":"1"},
{"name":"formatJson","type":"char","defaultValue":"false","enabled":"1"}
]
}', 0, 5, 'defJt', '', to_date('07-03-2017 17:12:42', 'dd-mm-yyyy hh24:mi:ss'));


-- Create table
create table DM_CO_BA_CFG_RCPT_IF_MENU
(
  id          VARCHAR2(128) not null,
  name        VARCHAR2(256),
  type        NUMBER(1),
  parent_id   VARCHAR2(128),
  descr       VARCHAR2(256),
  creator     VARCHAR2(25),
  update_time VARCHAR2(25)
)

-- Create table
create table DM_CO_BA_CFG_RCPT_IF_BUILDER
(
  id        NUMBER(3),
  name      VARCHAR2(256),
  classpath VARCHAR2(256),
  jar       VARCHAR2(128),
  descr     VARCHAR2(256),
  type      VARCHAR2(25)
);

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (1, '分页页面请求，返回Result(count,datas)', 'PageDataBuilder', '', 'page=1
limit=20', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (10, '分组-返回-Map<Object,Map<String,Object>>', 'GroupFieldDataBuilder', '', 'groupname=
oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (2, '默认包装器', 'DefaultDataBuilder', '', 'toLowerCaseForKey=false', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (3, '表头重命名包装求', 'FieldDataBuilder', '', 'oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (4, '二次分组-Single返回-Map<V,Map<V,Map<K,V>>>', 'Group2FieldDataBuilder', '', 'groupname=
oriFields=
newFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (5, '二次分组-返回-Map<V,Map<V,List<Map<K,V>>>>', 'Group2FieldListDataBuilder', '', 'groupname=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (6, '分组-返回-Map<V,List<Map<K,V>>>', 'GroupDataBuilder', '', 'groupname=
groupFields=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (7, '重命名', 'MapDataBuilder', '', 'oriFields=
newFields=
extMap=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (8, '结果格式包装器-返回-Map<String,List<Object>>', 'MapListDataBuilder', '', 'oriFields=
newFields=
extMap=', '');

insert into dm_co_ba_cfg_rcpt_if_builder (ID, NAME, CLASSPATH, JAR, DESCR, TYPE)
values (9, '排序并取TopN', 'OrderDataBuilder', '', 'orderName=
orderType=
topN=', '');

