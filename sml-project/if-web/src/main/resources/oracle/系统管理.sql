-- ---初始化表------------
-- -用户-----
CREATE TABLE stm_user (
  id varchar(64) primary key,
  login_name varchar(64) NOT NULL,
  name varchar(64) NOT NULL,
  password varchar(64) NOT NULL,
  salt varchar(36) DEFAULT NULL,
  sex int  DEFAULT '0' ,
  age int DEFAULT '0' ,
  phone varchar(20) DEFAULT NULL ,
  user_type int  DEFAULT '0' ,
  status int  DEFAULT '0' ,
  organization_id varchar(64)  DEFAULT '0' ,
  create_time date NOT NULL 
);
-- --角色-----
CREATE TABLE stm_role (
  id varchar(64) primary key ,
  name varchar(64) NOT NULL,
  seq int  DEFAULT '0',
  description varchar(255)  ,
  status int  DEFAULT '0' ,
  create_time date
) ;
-- -资源-----
CREATE TABLE stm_resource (
  id varchar(64) primary key,
  name varchar(64) NOT NULL,
  url varchar(100) DEFAULT NULL,
  open_mode varchar(32) ,
  description varchar(255) ,
  icon varchar(32) ,
  pid number(19) ,
  seq number(3) DEFAULT '0',
  status number(2) DEFAULT '0' ,
  opened number(2)  DEFAULT '1' ,
  resource_type number(2)  DEFAULT '0',
  create_time date
);
-- -组织部门------
CREATE TABLE stm_organization (
  id varchar(64) primary key,
  name varchar(64) NOT NULL ,
  address varchar(500) ,
  code varchar(64) NOT NULL,
  icon varchar(32),
  pid varchar(64),
  seq number(2)  DEFAULT '0' ,
  create_time date
);
-- --角色资源关系----
CREATE TABLE role_resource (
  id varchar(64) primary key,
  role_id varchar(64) NOT NULL ,
  resource_id varchar(64) NOT NULL
);
-- --用户角色关系------
CREATE TABLE user_role (
  id varchar(64) primary key,
  user_id varchar(64) NOT NULL,
  role_id varchar(64) NOT NULL
);
-- --系统日志表-------
CREATE TABLE sys_log (
  id varchar(64) primary key,
  login_name varchar(255) ,
  module_name varchar(255) ,
  opt_type varchar(255) ,
  req_content varchar(4000) ,
  resp_content varchar(4000) ,
  client_ip varchar(255) ,
  status int DEFAULT '0' ,
  create_time date,
  time_cast int
);
-- -------------------------初始化数据---------
INSERT INTO stm_user VALUES ('1512969951253', 'hw', 'ww', 'AB83EB0ABC0701D9', '2b0c5696b904ee0ad1c2cc67b7bcce42', '0', '2', '23', '1', '0', '1512820019420', to_date('2017-12-11 13:26:09','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_user VALUES ('1512987356081', 'huangwen', 'huangwen', 'EC72D9EDB0FF4096C6332F4F7954B373', '911dd5f950f7444afaa59c7b1e0ca4b1', '0', '11', '123', '1', '0', '1512820042077', to_date('2017-12-11 18:16:21','yyyy-mm-dd hh24:mi:ss'));

INSERT INTO stm_role VALUES ('1512893636688', 'admin', '0', '超级管理员', '0',to_date('2017-12-10 16:13:56','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_role VALUES ('1512961198752', 'test', '0', 'test', '0',to_date('2017-12-11 10:59:58','yyyy-mm-dd hh24:mi:ss'));

INSERT INTO stm_resource VALUES ('1512828229250', '部门管理', '/pages/systemManager/organization.jsp', 'iframe', '', 'fi-results-demographics', '1512887356641', '2', '0', '1', '0',to_date('2017-12-09 22:03:49','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512833308058', '列表', '/sml/query/system-organization-qry', 'ajax', '', 'fi-list', '1512828229250', '0', '0', '0', '2',to_date('2017-12-09 23:28:28','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512833464349', '添加', '/sml/update/system-organization-up/insert', 'ajax', '', 'fi-link', '1512889231305', '1', '0', '0', '2',to_date('2017-12-09 23:31:04','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512833684880', '编辑', '/sml/update/system-organization-up/update', 'ajax', '', 'fi-link', '1512889633492', '3', '0', '0', '2',to_date('2017-12-09 23:34:44','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512833841081', '删除', '/sml/update/system-organization-up/delete', 'ajax', '', 'fi-page-delete', '1512828229250', '4', '0', '0', '1',to_date('2017-12-09 23:37:21','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512887356641', '权限管理', '', '', '', 'fi-folder', '0', '0', '0', '1', '0',to_date('2017-12-10 14:29:16','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512889231305', '添加', '/pages/systemManager/organizationAdd.jsp', 'iframe', '', 'fi-page-add', '1512828229250', '1', '0', '0', '1',to_date('2017-12-10 15:00:31','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512889633492', '编辑', '/pages/systemManager/organizationEdit.jsp', 'iframe', '', 'fi-page-edit', '1512828229250', '3', '0', '0', '1',to_date('2017-12-10 15:07:13','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890311089', '资源管理', '/pages/systemManager/resource.jsp', 'iframe', '', 'fi-database', '1512887356641', '0', '0', '1', '0',to_date('2017-12-10 15:18:31','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890376798', '列表', '/sml/query/system-resource-qry', 'ajax', '', 'fi-list', '1512890311089', '0', '0', '0', '2',to_date('2017-12-10 15:19:36','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890436941', '添加', '/pages/systemManager/resourceAdd.jsp', 'iframe', '', 'fi-page-add', '1512890311089', '1', '0', '0', '1',to_date('2017-12-10 15:20:36','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890489052', '添加', '/sml/update/system-resource-up/insert', 'ajax', '', 'fi-link', '1512890436941', '0', '0', '0', '2',to_date('2017-12-10 15:21:29','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890606885', '编辑', '/pages/systemManager/resourceEdit.jsp', 'iframe', '', 'fi-page-edit', '1512890311089', '2', '0', '0', '1',to_date('2017-12-10 15:23:26','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890647801', '编辑', '/sml/update/system-resource-up/update', 'ajax', '', 'fi-link', '1512890606885', '0', '0', '0', '2',to_date('2017-12-10 15:24:07','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512890739714', '删除', '/sml/update/system-resource-up/delete', 'ajax', '', 'fi-page-delete', '1512890311089', '3', '0', '0', '2',to_date('2017-12-10 15:25:39','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512958600313', '角色管理', '/pages/systemManager/role.jsp', 'iframe', '', 'fi-torso-business', '1512887356641', '1', '0', '0', '0',to_date('2017-12-11 10:16:40','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959345879', '列表', '/sml/query/system-role-qry', 'ajax', '', 'fi-list', '1512958600313', '0', '0', '0', '2',to_date('2017-12-11 10:29:05','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959398190', '添加', '/pages/systemManager/roleAdd.jsp', 'iframe', '', 'fi-page-add', '1512958600313', '1', '0', '0', '1',to_date('2017-12-11 10:29:58','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959449033', '添加', '/sml/update/system-role-up/insert', 'ajax', '', 'fi-link', '1512959398190', '0', '0', '0', '2',to_date('2017-12-11 10:30:49','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959509973', '编辑', '/pages/systemManager/roleEdit.jsp', 'ajax', '', 'fi-page-edit', '1512958600313', '2', '0', '0', '1',to_date('2017-12-11 10:31:49','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959593148', '编辑', '/sml/update/system-role-up/update', 'ajax', '', 'fi-link', '1512959509973', '3', '0', '0', '2',to_date('2017-12-11 10:33:13','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959717328', '删除', '/sml/update/system-role-up/delete', 'ajax', '', 'fi-page-delete', '1512958600313', '4', '0', '0', '2',to_date('2017-12-11 10:35:17','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959772767', '授权', '/pages/systemManager/roleGrant.jsp', 'iframe', '', 'fi-check', '1512958600313', '5', '0', '0', '1',to_date('2017-12-11 10:36:12','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959862443', '角色资源关系查询', '/sml/query/system-roleResource-qry', 'ajax', '', 'fi-link', '1512959772767', '0', '0', '0', '2',to_date('2017-12-11 10:37:42','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512959918094', '授权', '/sml/update/common/roleGrant', 'ajax', '', 'fi-link', '1512959772767', '1', '0', '0', '2',to_date('2017-12-11 10:38:38','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512983750390', '用户管理', '/pages/systemManager/user.jsp', 'iframe', '', 'fi-torsos-all', '1512887356641', '5', '0', '1', '0',to_date('2017-12-11 17:15:50','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512983884762', '列表', '/sml/query/system-user-qry', 'ajax', '', 'fi-list', '1512983750390', '0', '0', '0', '2',to_date('2017-12-11 17:18:04','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512983925213', '添加', '/pages/systemManager/userAdd.jsp', 'iframe', '', 'fi-page-add', '1512983750390', '1', '0', '0', '1',to_date('2017-12-11 17:18:45','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512983968670', '添加', '/sml/update/system-user-up/insert', 'ajax', '', 'fi-link', '1512983925213', '0', '0', '0', '2',to_date('2017-12-11 17:19:28','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512984003892', '编辑', '/pages/systemManager/userEdit.jsp', 'iframe', '', 'fi-page-edit', '1512983750390', '2', '0', '0', '1',to_date('2017-12-11 17:20:03','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512984056912', '编辑', '/sml/update/system-user-up/update', 'ajax', '', 'fi-link', '1512984003892', '0', '0', '0', '2',to_date('2017-12-11 17:20:56','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512984102169', '删除', '/sml/update/system-user-up/delete', 'ajax', '', 'fi-page-delete', '1512983750390', '4', '0', '0', '2',to_date('2017-12-11 17:21:42','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512986656404', '接口管理', '', '', '', 'fi-list', '0', '0', '0', '0', '0',to_date('2017-12-11 18:04:16','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1512986725780', '接口管理', '/pages/interfaceManager/interfaceManager.jsp', 'iframe', '', 'fi-results-demographics', '1512986656404', '0', '0', '0', '0',to_date('2017-12-11 18:05:25','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513130314731', '系统模块', '', '', '', 'fi-list', '0', '1', '0', '0', '0',to_date('2017-12-13 09:58:34','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513130416942', '首页', '/pages/index.jsp', 'ajax', '', 'fi-home', '1513130314731', '0', '0', '0', '2',to_date('2017-12-13 10:00:16','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513134966289', '编辑密码', '/pages/systemManager/userEditPwd.jsp', 'iframe', '', 'fi-page-edit', '1512983750390', '3', '0', '0', '1',to_date('2017-12-13 11:16:06','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513135021280', '编辑密码', '/sml/update/system-user-up/updatePwd', 'ajax', '', 'fi-link', '1513134966289', '0', '0', '0', '2',to_date('2017-12-13 11:17:01','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513139892966', '编辑', '/pages/interfaceManager/editInterface.jsp', 'iframe', '', 'fi-page-edit', '1512986725780', '0', '0', '0', '1',to_date('2017-12-13 12:38:12','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513139962359', '测试样例', '/pages/interfaceManager/egQuery.jsp', 'ajax', '', 'fi-link', '1512986725780', '2', '0', '0', '1',to_date('2017-12-13 12:39:22','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513140345349', '接口集', '', '', '', 'fi-list', '1512986725780', '4', '0', '0', '1',to_date('2017-12-13 12:45:45','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513140398657', '接口管理相关', '/sml/query/if-**', 'ajax', '', 'fi-link', '1513140345349', '0', '0', '0', '2',to_date('2017-12-13 12:46:38','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513244280213', '系统日志', '/pages/systemManager/syslog.jsp', 'iframe', '', 'fi-info', '1513244370688', '2', '0', '0', '0',to_date('2017-12-14 17:38:00','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513244339630', '查询', '/sml/query/system-syslog-qry', 'ajax', '', 'fi-link', '1513244280213', '0', '0', '0', '2',to_date('2017-12-14 17:38:59','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_resource VALUES ('1513244370688', '日志模块', '', '', '', 'fi-folder', '0', '3', '0', '0', '0',to_date('2017-12-14 17:39:30','yyyy-mm-dd hh24:mi:ss'));


INSERT INTO stm_organization VALUES ('1512819994652', '中国移动', '', 'china', 'fi-folder', '00', '0', to_date('2017-12-09 19:46:34','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_organization VALUES ('1512820019420', '东信', '', 'eastcom', 'fi-folder', '00', '0',to_date('2017-12-09 19:46:59','yyyy-mm-dd hh24:mi:ss'));
INSERT INTO stm_organization VALUES ('1512820042077', '东信上海', 'zjbr', 'sh-eastcom', 'fi-folder', '1512820019420', '0', to_date('2017-12-09 19:47:22','yyyy-mm-dd hh24:mi:ss'));


INSERT INTO role_resource VALUES ('15128936366881512984102169', '1512893636688', '1512984102169');
INSERT INTO role_resource VALUES ('15128936366881513135021280', '1512893636688', '1513135021280');
INSERT INTO role_resource VALUES ('15128936366881513134966289', '1512893636688', '1513134966289');
INSERT INTO role_resource VALUES ('15128936366881512984056912', '1512893636688', '1512984056912');
INSERT INTO role_resource VALUES ('15128936366881512984003892', '1512893636688', '1512984003892');
INSERT INTO role_resource VALUES ('15128936366881512983968670', '1512893636688', '1512983968670');
INSERT INTO role_resource VALUES ('15128936366881512983925213', '1512893636688', '1512983925213');
INSERT INTO role_resource VALUES ('15128936366881512983884762', '1512893636688', '1512983884762');
INSERT INTO role_resource VALUES ('15129150817511512887356641', '1512915081751', '1512887356641');
INSERT INTO role_resource VALUES ('15129150817511512890311089', '1512915081751', '1512890311089');
INSERT INTO role_resource VALUES ('15129150817511512890376798', '1512915081751', '1512890376798');
INSERT INTO role_resource VALUES ('15129150817511512890489052', '1512915081751', '1512890489052');
INSERT INTO role_resource VALUES ('15129149923091512890489052', '1512914992309', '1512890489052');
INSERT INTO role_resource VALUES ('15129149923091512890647801', '1512914992309', '1512890647801');
INSERT INTO role_resource VALUES ('15128935280121512890489052', '1512893528012', '1512890489052');
INSERT INTO role_resource VALUES ('15128935280121512890436941', '1512893528012', '1512890436941');
INSERT INTO role_resource VALUES ('15128935280121512890376798', '1512893528012', '1512890376798');
INSERT INTO role_resource VALUES ('15128935280121512890311089', '1512893528012', '1512890311089');
INSERT INTO role_resource VALUES ('15128935280121512887356641', '1512893528012', '1512887356641');
INSERT INTO role_resource VALUES ('15128935280121512890606885', '1512893528012', '1512890606885');
INSERT INTO role_resource VALUES ('15128935280121512890647801', '1512893528012', '1512890647801');
INSERT INTO role_resource VALUES ('15128935280121512890739714', '1512893528012', '1512890739714');
INSERT INTO role_resource VALUES ('15128935280121512828229250', '1512893528012', '1512828229250');
INSERT INTO role_resource VALUES ('15128935280121512833308058', '1512893528012', '1512833308058');
INSERT INTO role_resource VALUES ('15128935280121512833464349', '1512893528012', '1512833464349');
INSERT INTO role_resource VALUES ('15128935280121512889633492', '1512893528012', '1512889633492');
INSERT INTO role_resource VALUES ('15128935280121512833684880', '1512893528012', '1512833684880');
INSERT INTO role_resource VALUES ('15128936366881512983750390', '1512893636688', '1512983750390');
INSERT INTO role_resource VALUES ('15128936366881512833841081', '1512893636688', '1512833841081');
INSERT INTO role_resource VALUES ('15128936366881512833684880', '1512893636688', '1512833684880');
INSERT INTO role_resource VALUES ('15128936366881512889633492', '1512893636688', '1512889633492');
INSERT INTO role_resource VALUES ('15128936366881512833464349', '1512893636688', '1512833464349');
INSERT INTO role_resource VALUES ('15128936366881512889231305', '1512893636688', '1512889231305');
INSERT INTO role_resource VALUES ('15128936366881512833308058', '1512893636688', '1512833308058');
INSERT INTO role_resource VALUES ('15128936366881512828229250', '1512893636688', '1512828229250');
INSERT INTO role_resource VALUES ('15128936366881512959918094', '1512893636688', '1512959918094');
INSERT INTO role_resource VALUES ('15128936366881512959862443', '1512893636688', '1512959862443');
INSERT INTO role_resource VALUES ('15128936366881512959772767', '1512893636688', '1512959772767');
INSERT INTO role_resource VALUES ('15128936366881512959717328', '1512893636688', '1512959717328');
INSERT INTO role_resource VALUES ('15128936366881512959593148', '1512893636688', '1512959593148');
INSERT INTO role_resource VALUES ('15128936366881512959509973', '1512893636688', '1512959509973');
INSERT INTO role_resource VALUES ('15128936366881512959449033', '1512893636688', '1512959449033');
INSERT INTO role_resource VALUES ('15128936366881512959398190', '1512893636688', '1512959398190');
INSERT INTO role_resource VALUES ('15128936366881512959345879', '1512893636688', '1512959345879');
INSERT INTO role_resource VALUES ('15128936366881512958600313', '1512893636688', '1512958600313');
INSERT INTO role_resource VALUES ('15128936366881512890739714', '1512893636688', '1512890739714');
INSERT INTO role_resource VALUES ('15129611987521513244339630', '1512961198752', '1513244339630');
INSERT INTO role_resource VALUES ('15129611987521513244280213', '1512961198752', '1513244280213');
INSERT INTO role_resource VALUES ('15129611987521513244370688', '1512961198752', '1513244370688');
INSERT INTO role_resource VALUES ('15129611987521513130416942', '1512961198752', '1513130416942');
INSERT INTO role_resource VALUES ('15129611987521513130314731', '1512961198752', '1513130314731');
INSERT INTO role_resource VALUES ('15129611987521512890376798', '1512961198752', '1512890376798');
INSERT INTO role_resource VALUES ('15129611987521513140398657', '1512961198752', '1513140398657');
INSERT INTO role_resource VALUES ('15129611987521513140345349', '1512961198752', '1513140345349');
INSERT INTO role_resource VALUES ('15129611987521513139962359', '1512961198752', '1513139962359');
INSERT INTO role_resource VALUES ('15129611987521513139892966', '1512961198752', '1513139892966');
INSERT INTO role_resource VALUES ('15128936366881512890647801', '1512893636688', '1512890647801');
INSERT INTO role_resource VALUES ('15128936366881512890606885', '1512893636688', '1512890606885');
INSERT INTO role_resource VALUES ('15128936366881512890489052', '1512893636688', '1512890489052');
INSERT INTO role_resource VALUES ('15128936366881512890436941', '1512893636688', '1512890436941');
INSERT INTO role_resource VALUES ('15128936366881512890376798', '1512893636688', '1512890376798');
INSERT INTO role_resource VALUES ('15128936366881512890311089', '1512893636688', '1512890311089');
INSERT INTO role_resource VALUES ('15128936366881512887356641', '1512893636688', '1512887356641');
INSERT INTO role_resource VALUES ('15129611987521512986725780', '1512961198752', '1512986725780');
INSERT INTO role_resource VALUES ('15129611987521512986656404', '1512961198752', '1512986656404');

INSERT INTO user_role VALUES ('15129711624011512893636688', '1512971162401', '1512893636688');
INSERT INTO user_role VALUES ('15129711624011512961198752', '1512971162401', '1512961198752');
INSERT INTO user_role VALUES ('15129701815821512961198752', '1512970181582', '1512961198752');
INSERT INTO user_role VALUES ('15129673181651512893636688', '1512967318165', '1512893636688');
INSERT INTO user_role VALUES ('15129704456291512893636688', '1512970445629', '1512893636688');
INSERT INTO user_role VALUES ('15129702547211512893636688', '1512970254721', '1512893636688');
INSERT INTO user_role VALUES ('15129702869661512961198752', '1512970286966', '1512961198752');
INSERT INTO user_role VALUES ('15129673181651512961198752', '1512967318165', '1512961198752');
INSERT INTO user_role VALUES ('15129684527741512893636688', '1512968452774', '1512893636688');
INSERT INTO user_role VALUES ('15129701815821512893636688', '1512970181582', '1512893636688');
INSERT INTO user_role VALUES ('15129873560811512961198752', '1512987356081', '1512961198752');
INSERT INTO user_role VALUES ('15129699512531512893636688', '1512969951253', '1512893636688');
INSERT INTO user_role VALUES ('15129699512531512961198752', '1512969951253', '1512961198752');













--  系统管理--接口菜单------------
insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-organization-up', '<if test=" ''@upType''==''insert'' ">
 insert into stm_organization(id,name,code,address,pid,seq,icon,create_time)
values (#id#,#name#,#code#,#address#,#pid#,#seq#,#icon#,#create_time#)
</if>
<if test=" ''@upType''==''update'' ">
update stm_organization set name=#name#,code=#code#,address=#address#,pid=#pid#,seq=#seq#,icon=#icon#
where id=#id#
</if>
<if test=" ''@upType''==''delete'' ">
delete from stm_organization where id=#id#
</if>', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"#{smlDateHelper.date().getTime().toString()}","descr":"id","enabled":"0"},
{"name":"seq","type":"number","defaultValue":"","descr":"seq","enabled":"0"},
{"name":"icon","type":"char","defaultValue":"","descr":"icon","enabled":"0"},
{"name":"code","type":"char","defaultValue":"","descr":"code","enabled":"0"},
{"name":"create_time","type":"date","defaultValue":"#{smlDateHelper.date()}","descr":"create_time","enabled":"0"},
{"name":"address","type":"char","defaultValue":"","descr":"address","enabled":"0"},
{"name":"pid","type":"char","defaultValue":"00","descr":"pid","enabled":"0"},
{"name":"upType","type":"char","defaultValue":"insert","descr":"upType","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"name","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-组织-更新', to_date('15-12-2017 16:38:43', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-organization-qry', '<if test=" ''@type''==''grid'' ">
    select id "id",name "name",name as "text",address "address",code "code",icon as "iconCls",pid "pid",seq "seq",create_time "create_time"
   from stm_organization where 1=1
 <isNotEmpty property="id"> and id=#id#</isNotEmpty>
order by seq
</if> ', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"type","type":"char","defaultValue":"grid","descr":"grid|tree","enabled":"0"},
{"name":"id","type":"char","defaultValue":"","descr":"id","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-组织部门查询', to_date('15-12-2017 17:24:51', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-resource-up', '<if test=" ''@upType''==''insert'' ">
insert into stm_resource(id,name,url,open_mode,description,icon,pid,seq,status,opened,resource_type,create_time)
values(#id#,#name#,#urls#,#open_mode#,#description#,#icon#,#pid#,#seq#,#status#,#opened#,#resource_type#,#create_time#)
</if>
<if test=" ''@upType''==''update'' ">
update stm_resource set name=#name#,url=#urls#,open_mode=#open_mode#,description=#description#,icon=#icon#,pid=#pid#,seq=#seq#,status=#status#,opened=#opened#,resource_type=#resource_type#
where id=#id#
</if>
<if test=" ''@upType''==''delete'' ">
delete from stm_resource where id=#id#
</if>', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"#{smlDateHelper.date().getTime().toString()}","descr":"id","enabled":"0"},
{"name":"seq","type":"number","defaultValue":"","descr":"seq","enabled":"0"},
{"name":"icon","type":"char","defaultValue":"","descr":"icon","enabled":"0"},
{"name":"open_mode","type":"char","defaultValue":"","descr":"open_mode","enabled":"0"},
{"name":"create_time","type":"date","defaultValue":"#{smlDateHelper.date()}","descr":"create_time","enabled":"0"},
{"name":"urls","type":"char","defaultValue":"","descr":"url","enabled":"0"},
{"name":"pid","type":"char","defaultValue":"00","descr":"pid","enabled":"0"},
{"name":"upType","type":"char","defaultValue":"insert","descr":"upType","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"name","enabled":"0"},
{"name":"description","type":"char","defaultValue":"","descr":"description","enabled":"0"},
{"name":"status","type":"number","defaultValue":"","descr":"status","enabled":"0"},
{"name":"opened","type":"number","defaultValue":"","descr":"opened","enabled":"0"},
{"name":"resource_type","type":"char","defaultValue":"","descr":"resource_type","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-资源-更新', to_date('15-12-2017 17:24:40', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-role-qry', '<select id="select">
    select id "id",name "name",name as "text",''fi-torso-business'' as "iconCls",description "description",status "status",case when status=''0'' then ''正常'' else ''停用'' end as "status_show",seq "seq",create_time "create_time"
   from stm_role where 1=1
 <isNotEmpty property="id"> and id=#id#</isNotEmpty>
</select>
<if test=" ''@queryType''==''select'' ">
      select * from (select t1.*, rownum row_ from (<included id="select"/>
      <isNotEmpty property="sort">
            order by $sort$ $order$ nulls last
      </isNotEmpty>
      ) t1) where row_ >= (#page# - 1) * #rows# + 1 and row_ < #page# * #rows# + 1
 </if>
<if test=" ''@queryType''==''count'' ">
      select count(1) as "total"   from (<included id="select"/>)
</if> ', 'PageDataBuilder
#分页相关参数名称标识设定
pageMark=page
limitMark=rows
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=create_time
newFields=create_time@date(''yyyy-MM-dd HH:mm:ss'')
igFieldFilter=true', '{
  "sqlParams": [
    {
      "name": "type",
      "type": "char",
      "defaultValue": "grid",
      "descr": "grid|tree",
      "enabled": "0"
    },
    {
      "name": "id",
      "type": "char",
      "defaultValue": "",
      "descr": "id",
      "enabled": "0"
    },
    {
      "name": "rows",
      "type": "number",
      "defaultValue": "10",
      "descr": "每页大小",
      "enabled": "0"
    },
    {
      "name": "page",
      "type": "number",
      "defaultValue": "1",
      "descr": "当前页",
      "enabled": "0"
    },
    {
      "name": "sort",
      "type": "char",
      "defaultValue": "seq",
      "descr": "排序字段",
      "enabled": "0"
    },
    {
      "name": "order",
      "type": "char",
      "defaultValue": "asc",
      "descr": "排序",
      "enabled": "0"
    },
    {
      "name": "queryType",
      "type": "char",
      "defaultValue": "select",
      "descr": "查询类型",
      "enabled": "0"
    },
    {
      "name": "start",
      "type": "number",
      "defaultValue": "0",
      "descr": "start",
      "enabled": "0"
    }
  ]
}', 0, 0, 'master', '系统管理-角色-查询', to_date('15-12-2017 17:25:09', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-resource-qry', 'select id "id",name "name",name as "text",url "urls",open_mode "open_mode",description "description",icon "icon",
 icon as "iconCls",pid "pid",seq "seq",case when status=''0'' then ''正常'' else ''停用'' end as "status_show",status "status",case when opened=''1'' then ''打开'' else ''关闭'' end as "opened_show",opened "opened",case when resource_type=''0'' then ''菜单'' when resource_type=''1'' then ''按纽'' else ''接口'' end as "resource_type_show",resource_type "resource_type",create_time "create_time" from stm_resource 
where 1=1
<isNotEmpty property="resource_type"> and resource_type in (#resource_type#)</isNotEmpty>
<isNotEmpty property="user_name"> 
and id in(select resource_id from role_resource where role_id  in(select role_id from user_role where user_id in(select id from stm_user where login_name=#user_name#)))
</isNotEmpty>
order by seq', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=create_time
newFields=create_time@date(''yyyy-MM-dd HH24:mm:ss'')
igFieldFilter=true', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"","descr":"id","enabled":"0"},
{"name":"resource_type","type":"array-char","defaultValue":"0,1,2","descr":"resource_type","enabled":"0"},
{"name":"user_name","type":"char","defaultValue":"","descr":"user_name","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-资源-查询', to_date('15-12-2017 17:18:09', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-syslog-qry', '<select id="select">
     select * from sys_log
</select>

<if test=" ''@queryType''==''select'' ">
      select * from (select t1.*, rownum row_ from (select * from (<included id="select"/>)
      <isNotEmpty property="sort">
            order by $sort$ $order$ nulls last
      </isNotEmpty>
      ) t1) where row_ >= (#page# - 1) * #rows# + 1 and row_ < #page# * #rows# + 1
 </if>
<if test=" ''@queryType''==''count'' ">
      select count(1) as "total"   from (<included id="select"/>)
</if> ', 'PageDataBuilder
#分页相关参数名称标识设定
pageMark=page
limitMark=rows
#拦截-返回key是否小写拦截
toLowerCaseForKey=true
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=create_time
newFields=create_time@date(''yyyy-MM-dd HH:mm:ss'')
igFieldFilter=true', '{
"sqlParams":
[
{"name":"type","type":"char","defaultValue":"grid","descr":"grid|tree","enabled":"0"},
{"name":"id","type":"char","defaultValue":"","descr":"id","enabled":"0"},
{"name":"rows","type":"number","defaultValue":"10","descr":"每页大小","enabled":"0"},
{"name":"page","type":"number","defaultValue":"1","descr":"当前页","enabled":"0"},
{"name":"sort","type":"char","defaultValue":"create_time","descr":"排序字段","enabled":"0"},
{"name":"order","type":"char","defaultValue":"asc","descr":"排序","enabled":"0"},
{"name":"queryType","type":"char","defaultValue":"select","descr":"查询类型","enabled":"0"},
{"name":"start","type":"number","defaultValue":"0","descr":"start","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"create_time","enabled":"0"},
{"name":"orgId","type":"char","defaultValue":"","descr":"orgId","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-日志-查询', to_date('15-12-2017 17:25:35', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-user-qry', '<select id="select">
  select 
t1.id "id",login_name "login_name",t1.name "name",password "password",salt "salt",sex "sex",age "age",phone "phone",user_type "user_type",
case when status=''0'' then ''管理员'' else ''用户'' end as "user_type_show",
case when status=''0'' then ''正常'' else ''停用'' end as "status_show",
case when sex=''0'' then ''男'' else ''女'' end as "sex_show",
status "status",organization_id "organization_id",t2.name as "org_name",t1.create_time "create_time",
WM_CONCAT(t3.name) as "roleLst",WM_CONCAT(t3.id) as "roleIds"
from stm_user t1 left join stm_organization t2 on t1.organization_id=t2.id
left join (select t1.id,t1.name,t2.user_id from stm_role t1 left join user_role t2
on t1.id=t2.role_id) t3 on t1.id=t3.user_id
where 1=1
 <isNotEmpty property="id"> and t1.id=#id#</isNotEmpty>
<isNotEmpty property="name"> and t1.login_name like ''%$name$%''</isNotEmpty>
<isNotEmpty property="orgId"> and t2.Id=#orgId#</isNotEmpty>
group by t1.id,login_name,t1.name,password,salt,sex,age,phone,user_type,status,organization_id,t2.name,t1.create_time
</select>
 
<if test=" ''@queryType''==''select'' ">
      select * from (select t1.*, rownum row_ from (select * from (<included id="select"/>)
      <isNotEmpty property="sort">
            order by "$sort$" $order$ nulls last
      </isNotEmpty>
      ) t1) where row_ >= (#page# - 1) * #rows# + 1 and row_ < #page# * #rows# + 1
 </if>
<if test=" ''@queryType''==''count'' ">
      select count(1) as "total"   from (<included id="select"/>)
</if> ', 'PageDataBuilder
#分页相关参数名称标识设定
pageMark=page
limitMark=rows
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=create_time
newFields=create_time@date(''yyyy-MM-dd HH:mm:ss'')
igFieldFilter=true', '{
"sqlParams":
[
{"name":"type","type":"char","defaultValue":"grid","descr":"grid|tree","enabled":"0"},
{"name":"id","type":"char","defaultValue":"","descr":"id","enabled":"0"},
{"name":"rows","type":"number","defaultValue":"10","descr":"每页大小","enabled":"0"},
{"name":"page","type":"number","defaultValue":"1","descr":"当前页","enabled":"0"},
{"name":"sort","type":"char","defaultValue":"name","descr":"排序字段","enabled":"0"},
{"name":"order","type":"char","defaultValue":"asc","descr":"排序","enabled":"0"},
{"name":"queryType","type":"char","defaultValue":"select","descr":"查询类型","enabled":"0"},
{"name":"start","type":"number","defaultValue":"0","descr":"start","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"name","enabled":"0"},
{"name":"orgId","type":"char","defaultValue":"","descr":"orgId","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-用户-查询', to_date('15-12-2017 17:25:28', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-user-up', '<if test=" ''@upType''==''insert'' ">
insert into stm_user(id,login_name,name,password,salt,sex,age,phone,user_type,status,organization_id,create_time) 
values(#id#,#login_name#,#name#,#password#,#salt#,#sex#,#age#,#phone#,#user_type#,#status#,#organization_id#,#create_time#)

</if>
<if test=" ''@upType''==''update'' ">
update stm_user set name=#name#,login_name=#login_name#,status=#status#,sex=#sex#,age=#age#,phone=#phone#,user_type=#user_type#,
organization_id=#organization_id#
<isNotEmpty property="password">,password=#password#</isNotEmpty>
where id=#id#
</if>
<if test=" ''@upType''==''delete'' ">
delete from stm_user where id=#id#
</if>', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"#{smlDateHelper.date().getTime().toString()}","descr":"id","enabled":"0"},
{"name":"organization_id","type":"char","defaultValue":"","descr":"organization_id","enabled":"0"},
{"name":"create_time","type":"date","defaultValue":"#{smlDateHelper.date()}","descr":"create_time","enabled":"0"},
{"name":"sex","type":"number","defaultValue":"0","descr":"sex","enabled":"0"},
{"name":"upType","type":"char","defaultValue":"insert","descr":"upType","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"name","enabled":"0"},
{"name":"status","type":"number","defaultValue":"0","descr":"status","enabled":"0"},
{"name":"user_type","type":"number","defaultValue":"1","descr":"user_type","enabled":"0"},
{"name":"login_name","type":"char","defaultValue":"","descr":"login_name","enabled":"0"},
{"name":"age","type":"char","defaultValue":"","descr":"age","enabled":"0"},
{"name":"phone","type":"char","defaultValue":"","descr":"phone","enabled":"0"},
{"name":"salt","type":"char","defaultValue":"#{smlDateHelper.date().getTime().toString()}","descr":"salt","enabled":"0"},
{"name":"password","type":"char","defaultValue":"","descr":"password","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-用户-更新', to_date('15-12-2017 17:34:56', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-role-up', '<if test=" ''@upType''==''insert'' ">
 insert into stm_role(id,name,description,seq,status,create_time)
values (#id#,#name#,#description#,#seq#,#status#,#create_time#)
</if>
<if test=" ''@upType''==''update'' ">
update stm_role set name=#name#,description=#description#,status=#status#,seq=#seq#
where id=#id#
</if>
<if test=" ''@upType''==''delete'' ">
delete from stm_role where id=#id#
</if>', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=
newFields=
igFieldFilter=false', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"#{smlDateHelper.date().getTime().toString()}","descr":"id","enabled":"0"},
{"name":"seq","type":"number","defaultValue":"","descr":"seq","enabled":"0"},
{"name":"create_time","type":"date","defaultValue":"#{smlDateHelper.date()}","descr":"create_time","enabled":"0"},
{"name":"description","type":"char","defaultValue":"","descr":"description","enabled":"0"},
{"name":"upType","type":"char","defaultValue":"insert","descr":"upType","enabled":"0"},
{"name":"name","type":"char","defaultValue":"","descr":"name","enabled":"0"},
{"name":"status","type":"number","defaultValue":"0","descr":"status","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-角色-更新', to_date('15-12-2017 16:47:12', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF (ID, MAINSQL, REBUILD_INFO, CONDITION_INFO, CACHE_ENABLED, CACHE_MINUTES, DB_ID, DESCRIBE, UPDATE_TIME)
values ('system-roleResource-qry', 'select t1.id "id",name as "text",url as "attributes",open_mode "open_mode ",icon as "iconCls",pid "pid",seq "seq",case when t2.id is null then ''false'' else ''true'' end as "checked"
 from stm_resource  t1 left join role_resource t2
on t1.id=t2.resource_id and t2.role_id=#id#
and t1.status=0
order by seq', 'DefaultDataBuilder
#拦截-返回key是否小写拦截
toLowerCaseForKey=false
#拦截-返回oriFields,newFields是否忽视只返回配置字段
oriFields=create_time,checked
newFields=create_time@date(''yyyy-MM-dd HH24:mm:ss''),checked@boolean('''')
igFieldFilter=true', '{
"sqlParams":
[
{"name":"id","type":"char","defaultValue":"","descr":"id","enabled":"0"}
]
}', 0, 0, 'master', '系统管理-角色资源-查询', to_date('15-12-2017 17:25:22', 'dd-mm-yyyy hh24:mi:ss'));

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('20171208162801', '系统管理', 0, '0', '目录', 'hw', '20171215163210', 20171208162910);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-organization-qry', '系统管理-组织部门查询', 1, '20171208162801', '接口', 'hw', '20171215172451', 0);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-user-qry', '系统管理-用户-查询', 1, '20171208162801', '系统管理-用户-查询', 'hw', '20171215172528', 7);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-user-up', '系统管理-用户-更新', 1, '20171208162801', '系统管理-角色-更新', 'hw', '20171215173456', 8);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-syslog-qry', '系统管理-日志-查询', 1, '20171208162801', '系统管理-日志-查询', 'hw', '20171215172535', 7);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-organization-up', '系统管理-组织-更新', 1, '20171208162801', '接口', 'hw', '20171215163843', 1);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-resource-qry', '系统管理-资源-查询', 1, '20171208162801', '接口', 'hw', '20171215171809', 3);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-resource-up', '系统管理-资源-更新', 1, '20171208162801', '系统管理-资源-更新', 'hw', '20171215172440', 2);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-role-qry', '系统管理-角色-查询', 1, '20171208162801', '系统管理-角色-查询', 'hw', '20171215172509', 4);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-role-up', '系统管理-角色-更新', 1, '20171208162801', '系统管理-角色-更新', 'hw', '20171215164712', 5);

insert into DM_CO_BA_CFG_RCPT_IF_menu (ID, NAME, TYPE, PARENT_ID, DESCR, CREATOR, UPDATE_TIME, SEQ)
values ('system-roleResource-qry', '系统管理-角色资源-查询', 1, '20171208162801', '接口', 'hw', '20171215172522', 6);

