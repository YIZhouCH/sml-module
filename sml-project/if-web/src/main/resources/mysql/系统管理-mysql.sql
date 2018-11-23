-- ---初始化表------------
-- -用户-----
CREATE TABLE `user` (
  `id` varchar(64) NOT NULL COMMENT '主键id',
  `login_name` varchar(64) NOT NULL COMMENT '登陆名',
  `name` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(64) NOT NULL COMMENT '密码',
  `salt` varchar(36) DEFAULT NULL COMMENT '密码加密盐',
  `sex` tinyint(2) NOT NULL DEFAULT '0' COMMENT '性别',
  `age` tinyint(2) DEFAULT '0' COMMENT '年龄',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `user_type` tinyint(2) NOT NULL DEFAULT '0' COMMENT '用户类别',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '用户状态',
  `organization_id` varchar(64) NOT NULL DEFAULT '0' COMMENT '所属机构',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDx_user_login_name` (`login_name`) USING BTREE
);
-- --角色-----
CREATE TABLE `role` (
  `id` varchar(64) NOT NULL COMMENT '主键id',
  `name` varchar(64) NOT NULL COMMENT '角色名',
  `seq` tinyint(2) NOT NULL DEFAULT '0' COMMENT '排序号',
  `description` varchar(255) DEFAULT NULL COMMENT '简介',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;
-- -资源-----
CREATE TABLE `resource` (
  `id` varchar(64) NOT NULL COMMENT '主键',
  `name` varchar(64) NOT NULL COMMENT '资源名称',
  `url` varchar(100) DEFAULT NULL COMMENT '资源路径',
  `open_mode` varchar(32) DEFAULT NULL COMMENT '打开方式 ajax,iframe',
  `description` varchar(255) DEFAULT NULL COMMENT '资源介绍',
  `icon` varchar(32) DEFAULT NULL COMMENT '资源图标',
  `pid` bigint(19) DEFAULT NULL COMMENT '父级资源id',
  `seq` tinyint(3) NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '状态',
  `opened` tinyint(2) NOT NULL DEFAULT '1' COMMENT '打开状态',
  `resource_type` tinyint(2) NOT NULL DEFAULT '0' COMMENT '资源类别',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
);
-- -组织部门------
CREATE TABLE `organization` (
  `id` varchar(64) NOT NULL COMMENT '主键id',
  `name` varchar(64) NOT NULL COMMENT '组织名',
  `address` varchar(500) DEFAULT NULL COMMENT '地址',
  `code` varchar(64) NOT NULL COMMENT '编号',
  `icon` varchar(32) DEFAULT NULL COMMENT '图标',
  `pid` varchar(64) DEFAULT NULL COMMENT '父级主键',
  `seq` tinyint(2) NOT NULL DEFAULT '0' COMMENT '排序',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
);
-- --角色资源关系----
CREATE TABLE `role_resource` (
  `id` varchar(64) NOT NULL COMMENT '主键id',
  `role_id` varchar(64) NOT NULL COMMENT '角色id',
  `resource_id` varchar(64) NOT NULL COMMENT '资源id',
  PRIMARY KEY (`id`)
);
-- --用户角色关系------
CREATE TABLE `user_role` (
  `id` varchar(64) NOT NULL COMMENT '主键id',
  `user_id` varchar(64) NOT NULL COMMENT '用户id',
  `role_id` varchar(64) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`id`)
);
-- --系统日志表-------
CREATE TABLE `sys_log` (
  `id` varchar(64) NOT NULL COMMENT '主键id',
  `login_name` varchar(255) DEFAULT NULL COMMENT '登陆名',
  `module_name` varchar(255) DEFAULT NULL COMMENT '模块名',
  `opt_type` varchar(255) DEFAULT NULL COMMENT '操作类型',
  `req_content` varchar(4000) DEFAULT NULL COMMENT '请求内容',
  `resp_content` varchar(4000) DEFAULT NULL COMMENT '请求内容',
  `client_ip` varchar(255) DEFAULT NULL COMMENT '客户端ip',
  `status` int(11) DEFAULT '0' COMMENT '请求成功状态',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `time_cast` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
-- -------------------------初始化数据---------
INSERT INTO user VALUES ('1512969951253', 'hw', 'ww', 'AB83EB0ABC0701D9', '2b0c5696b904ee0ad1c2cc67b7bcce42', '0', '2', '23', '1', '0', '1512820019420', '2017-12-11 13:26:09');
INSERT INTO user VALUES ('1512987356081', 'huangwen', 'huangwen', 'EC72D9EDB0FF4096C6332F4F7954B373', '911dd5f950f7444afaa59c7b1e0ca4b1', '0', '11', '123', '1', '0', '1512820042077', '2017-12-11 18:16:21');

INSERT INTO role VALUES ('1512893636688', 'admin', '0', '超级管理员', '0', '2017-12-10 16:13:56');
INSERT INTO role VALUES ('1512961198752', 'test', '0', 'test', '0', '2017-12-11 10:59:58');

INSERT INTO resource VALUES ('1512828229250', '部门管理', '/pages/systemManager/organization.jsp', 'iframe', '', 'fi-results-demographics', '1512887356641', '2', '0', '1', '0', '2017-12-09 22:03:49');
INSERT INTO resource VALUES ('1512833308058', '列表', '/sml/query/system-organization-qry', 'ajax', '', 'fi-list', '1512828229250', '0', '0', '0', '2', '2017-12-09 23:28:28');
INSERT INTO resource VALUES ('1512833464349', '添加', '/sml/update/system-organization-up/insert', 'ajax', '', 'fi-link', '1512889231305', '1', '0', '0', '2', '2017-12-09 23:31:04');
INSERT INTO resource VALUES ('1512833684880', '编辑', '/sml/update/system-organization-up/update', 'ajax', '', 'fi-link', '1512889633492', '3', '0', '0', '2', '2017-12-09 23:34:44');
INSERT INTO resource VALUES ('1512833841081', '删除', '/sml/update/system-organization-up/delete', 'ajax', '', 'fi-page-delete', '1512828229250', '4', '0', '0', '1', '2017-12-09 23:37:21');
INSERT INTO resource VALUES ('1512887356641', '权限管理', '', '', '', 'fi-folder', '0', '0', '0', '1', '0', '2017-12-10 14:29:16');
INSERT INTO resource VALUES ('1512889231305', '添加', '/pages/systemManager/organizationAdd.jsp', 'iframe', '', 'fi-page-add', '1512828229250', '1', '0', '0', '1', '2017-12-10 15:00:31');
INSERT INTO resource VALUES ('1512889633492', '编辑', '/pages/systemManager/organizationEdit.jsp', 'iframe', '', 'fi-page-edit', '1512828229250', '3', '0', '0', '1', '2017-12-10 15:07:13');
INSERT INTO resource VALUES ('1512890311089', '资源管理', '/pages/systemManager/resource.jsp', 'iframe', '', 'fi-database', '1512887356641', '0', '0', '1', '0', '2017-12-10 15:18:31');
INSERT INTO resource VALUES ('1512890376798', '列表', '/sml/query/system-resource-qry', 'ajax', '', 'fi-list', '1512890311089', '0', '0', '0', '2', '2017-12-10 15:19:36');
INSERT INTO resource VALUES ('1512890436941', '添加', '/pages/systemManager/resourceAdd.jsp', 'iframe', '', 'fi-page-add', '1512890311089', '1', '0', '0', '1', '2017-12-10 15:20:36');
INSERT INTO resource VALUES ('1512890489052', '添加', '/sml/update/system-resource-up/insert', 'ajax', '', 'fi-link', '1512890436941', '0', '0', '0', '2', '2017-12-10 15:21:29');
INSERT INTO resource VALUES ('1512890606885', '编辑', '/pages/systemManager/resourceEdit.jsp', 'iframe', '', 'fi-page-edit', '1512890311089', '2', '0', '0', '1', '2017-12-10 15:23:26');
INSERT INTO resource VALUES ('1512890647801', '编辑', '/sml/update/system-resource-up/update', 'ajax', '', 'fi-link', '1512890606885', '0', '0', '0', '2', '2017-12-10 15:24:07');
INSERT INTO resource VALUES ('1512890739714', '删除', '/sml/update/system-resource-up/delete', 'ajax', '', 'fi-page-delete', '1512890311089', '3', '0', '0', '2', '2017-12-10 15:25:39');
INSERT INTO resource VALUES ('1512958600313', '角色管理', '/pages/systemManager/role.jsp', 'iframe', '', 'fi-torso-business', '1512887356641', '1', '0', '0', '0', '2017-12-11 10:16:40');
INSERT INTO resource VALUES ('1512959345879', '列表', '/sml/query/system-role-qry', 'ajax', '', 'fi-list', '1512958600313', '0', '0', '0', '2', '2017-12-11 10:29:05');
INSERT INTO resource VALUES ('1512959398190', '添加', '/pages/systemManager/roleAdd.jsp', 'iframe', '', 'fi-page-add', '1512958600313', '1', '0', '0', '1', '2017-12-11 10:29:58');
INSERT INTO resource VALUES ('1512959449033', '添加', '/sml/update/system-role-up/insert', 'ajax', '', 'fi-link', '1512959398190', '0', '0', '0', '2', '2017-12-11 10:30:49');
INSERT INTO resource VALUES ('1512959509973', '编辑', '/pages/systemManager/roleEdit.jsp', 'ajax', '', 'fi-page-edit', '1512958600313', '2', '0', '0', '1', '2017-12-11 10:31:49');
INSERT INTO resource VALUES ('1512959593148', '编辑', '/sml/update/system-role-up/update', 'ajax', '', 'fi-link', '1512959509973', '3', '0', '0', '2', '2017-12-11 10:33:13');
INSERT INTO resource VALUES ('1512959717328', '删除', '/sml/update/system-role-up/delete', 'ajax', '', 'fi-page-delete', '1512958600313', '4', '0', '0', '2', '2017-12-11 10:35:17');
INSERT INTO resource VALUES ('1512959772767', '授权', '/pages/systemManager/roleGrant.jsp', 'iframe', '', 'fi-check', '1512958600313', '5', '0', '0', '1', '2017-12-11 10:36:12');
INSERT INTO resource VALUES ('1512959862443', '角色资源关系查询', '/sml/query/system-roleResource-qry', 'ajax', '', 'fi-link', '1512959772767', '0', '0', '0', '2', '2017-12-11 10:37:42');
INSERT INTO resource VALUES ('1512959918094', '授权', '/sml/update/common/roleGrant', 'ajax', '', 'fi-link', '1512959772767', '1', '0', '0', '2', '2017-12-11 10:38:38');
INSERT INTO resource VALUES ('1512983750390', '用户管理', '/pages/systemManager/user.jsp', 'iframe', '', 'fi-torsos-all', '1512887356641', '5', '0', '1', '0', '2017-12-11 17:15:50');
INSERT INTO resource VALUES ('1512983884762', '列表', '/sml/query/system-user-qry', 'ajax', '', 'fi-list', '1512983750390', '0', '0', '0', '2', '2017-12-11 17:18:04');
INSERT INTO resource VALUES ('1512983925213', '添加', '/pages/systemManager/userAdd.jsp', 'iframe', '', 'fi-page-add', '1512983750390', '1', '0', '0', '1', '2017-12-11 17:18:45');
INSERT INTO resource VALUES ('1512983968670', '添加', '/sml/update/system-user-up/insert', 'ajax', '', 'fi-link', '1512983925213', '0', '0', '0', '2', '2017-12-11 17:19:28');
INSERT INTO resource VALUES ('1512984003892', '编辑', '/pages/systemManager/userEdit.jsp', 'iframe', '', 'fi-page-edit', '1512983750390', '2', '0', '0', '1', '2017-12-11 17:20:03');
INSERT INTO resource VALUES ('1512984056912', '编辑', '/sml/update/system-user-up/update', 'ajax', '', 'fi-link', '1512984003892', '0', '0', '0', '2', '2017-12-11 17:20:56');
INSERT INTO resource VALUES ('1512984102169', '删除', '/sml/update/system-user-up/delete', 'ajax', '', 'fi-page-delete', '1512983750390', '4', '0', '0', '2', '2017-12-11 17:21:42');
INSERT INTO resource VALUES ('1512986656404', '接口管理', '', '', '', 'fi-list', '0', '0', '0', '0', '0', '2017-12-11 18:04:16');
INSERT INTO resource VALUES ('1512986725780', '接口管理', '/pages/interfaceManager/interfaceManager.jsp', 'iframe', '', 'fi-results-demographics', '1512986656404', '0', '0', '0', '0', '2017-12-11 18:05:25');
INSERT INTO resource VALUES ('1513130314731', '系统模块', '', '', '', 'fi-list', '0', '1', '0', '0', '0', '2017-12-13 09:58:34');
INSERT INTO resource VALUES ('1513130416942', '首页', '/pages/index.jsp', 'ajax', '', 'fi-home', '1513130314731', '0', '0', '0', '2', '2017-12-13 10:00:16');
INSERT INTO resource VALUES ('1513134966289', '编辑密码', '/pages/systemManager/userEditPwd.jsp', 'iframe', '', 'fi-page-edit', '1512983750390', '3', '0', '0', '1', '2017-12-13 11:16:06');
INSERT INTO resource VALUES ('1513135021280', '编辑密码', '/sml/update/system-user-up/updatePwd', 'ajax', '', 'fi-link', '1513134966289', '0', '0', '0', '2', '2017-12-13 11:17:01');
INSERT INTO resource VALUES ('1513139892966', '编辑', '/pages/interfaceManager/editInterface.jsp', 'iframe', '', 'fi-page-edit', '1512986725780', '0', '0', '0', '1', '2017-12-13 12:38:12');
INSERT INTO resource VALUES ('1513139962359', '测试样例', '/pages/interfaceManager/egQuery.jsp', 'ajax', '', 'fi-link', '1512986725780', '2', '0', '0', '1', '2017-12-13 12:39:22');
INSERT INTO resource VALUES ('1513140345349', '接口集', '', '', '', 'fi-list', '1512986725780', '4', '0', '0', '1', '2017-12-13 12:45:45');
INSERT INTO resource VALUES ('1513140398657', '接口管理相关', '/sml/query/if-**', 'ajax', '', 'fi-link', '1513140345349', '0', '0', '0', '2', '2017-12-13 12:46:38');
INSERT INTO resource VALUES ('1513244280213', '系统日志', '/pages/systemManager/syslog.jsp', 'iframe', '', 'fi-info', '1513244370688', '2', '0', '0', '0', '2017-12-14 17:38:00');
INSERT INTO resource VALUES ('1513244339630', '查询', '/sml/query/system-syslog-qry', 'ajax', '', 'fi-link', '1513244280213', '0', '0', '0', '2', '2017-12-14 17:38:59');
INSERT INTO resource VALUES ('1513244370688', '日志模块', '', '', '', 'fi-folder', '0', '3', '0', '0', '0', '2017-12-14 17:39:30');

INSERT INTO organization VALUES ('1512819994652', '中国移动', '', 'china', 'fi-folder', '00', '0', '2017-12-09 19:46:34');
INSERT INTO organization VALUES ('1512820019420', '东信', '', 'eastcom', 'fi-folder', '00', '0', '2017-12-09 19:46:59');
INSERT INTO organization VALUES ('1512820042077', '东信上海', 'zjbr', 'sh-eastcom', 'fi-folder', '1512820019420', '0', '2017-12-09 19:47:22');


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


INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-organization-qry', '系统管理-组织部门查询', '1', '20171208162801', '接口', 'hw', null, '0');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-user-qry', '系统管理-用户-查询', '1', '20171208162801', '系统管理-用户-查询', 'hw', null, '7');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-user-up', '系统管理-用户-更新', '1', '20171208162801', '系统管理-角色-更新', 'hw', null, '8');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-syslog-qry', '系统管理-日志-查询', '1', '20171208162801', '系统管理-日志-查询', 'hw', null, '7');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-organization-up', '系统管理-组织-更新', '1', '20171208162801', '接口', 'hw', null, '1');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-resource-qry', '系统管理-资源-查询', '1', '20171208162801', '接口', 'hw', null, '3');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-resource-up', '系统管理-资源-更新', '1', '20171208162801', '系统管理-资源-更新', 'hw', null, '2');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-role-qry', '系统管理-角色-查询', '1', '20171208162801', '系统管理-角色-查询', 'hw', null, '4');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-role-up', '系统管理-角色-更新', '1', '20171208162801', '系统管理-角色-更新', 'hw', null, '5');
INSERT INTO dm_co_ba_cfg_rcpt_if_menu VALUES ('system-roleResource-qry', '系统管理-角色资源-查询', '1', '20171208162801', '接口', 'hw', null, '6');


INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-organization-qry', '<if test=\" \'@type\'==\'grid\' \">\r\n    select id,name,name as text,address,code,icon as \"iconCls\",pid,seq,create_time\r\n   from organization where 1=1\r\n <isNotEmpty property=\"id\"> and id=#id#</isNotEmpty>\r\norder by seq\r\n</if> ', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=create_time\r\nnewFields=create_time@date(\'yyyy-MM-dd HH:mm:ss\')\r\nigFieldFilter=true', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"type\",\"type\":\"char\",\"defaultValue\":\"grid\",\"descr\":\"grid|tree\",\"enabled\":\"0\"},\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"id\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-组织部门查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-organization-up', '<if test=\" \'@upType\'==\'insert\' \">\r\n insert into organization(id,name,code,address,pid,seq,icon,create_time)\r\nvalues (#id#,#name#,#code#,#address#,#pid#,#seq#,#icon#,#create_time#)\r\n</if>\r\n<if test=\" \'@upType\'==\'update\' \">\r\nupdate organization set name=#name#,code=#code#,address=#address#,pid=#pid#,seq=#seq#,icon=#icon#\r\nwhere id=#id#\r\n</if>\r\n<if test=\" \'@upType\'==\'delete\' \">\r\ndelete from organization where id=#id#\r\n</if>', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=\r\nnewFields=\r\nigFieldFilter=false', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"#{smlDateHelper.date().getTime().toString()}\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"seq\",\"type\":\"number\",\"defaultValue\":\"\",\"descr\":\"seq\",\"enabled\":\"0\"},\r\n{\"name\":\"icon\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"icon\",\"enabled\":\"0\"},\r\n{\"name\":\"code\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"code\",\"enabled\":\"0\"},\r\n{\"name\":\"create_time\",\"type\":\"date\",\"defaultValue\":\"#{smlDateHelper.date()}\",\"descr\":\"create_time\",\"enabled\":\"0\"},\r\n{\"name\":\"address\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"address\",\"enabled\":\"0\"},\r\n{\"name\":\"pid\",\"type\":\"char\",\"defaultValue\":\"00\",\"descr\":\"pid\",\"enabled\":\"0\"},\r\n{\"name\":\"upType\",\"type\":\"char\",\"defaultValue\":\"insert\",\"descr\":\"upType\",\"enabled\":\"0\"},\r\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"name\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-组织-更新', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-resource-qry', 'select id,name,name as text,url urls,open_mode,description,icon,icon as iconCls,pid,seq,case when status=\'0\' then \'正常\' else \'停用\' end as status_show,status,case when opened=\'1\' then \'打开\' else \'关闭\' end as opened_show,opened ,case when resource_type=\'0\' then \'菜单\' when resource_type=\'1\' then \'按纽\' else \'接口\' end as resource_type_show,resource_type,create_time from resource \r\nwhere 1=1\r\n<isNotEmpty property=\"resource_type\"> and resource_type in (#resource_type#)</isNotEmpty>\r\n<isNotEmpty property=\"user_name\"> \r\nand id in(select resource_id from role_resource where role_id  in(select role_id from user_role where user_id in(select id from user where login_name=#user_name#)))\r\n</isNotEmpty>\r\norder by seq', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=create_time\r\nnewFields=create_time@date(\'yyyy-MM-dd HH24:mm:ss\')\r\nigFieldFilter=true', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"resource_type\",\"type\":\"array-char\",\"defaultValue\":\"0,1,2\",\"descr\":\"resource_type\",\"enabled\":\"0\"},\r\n{\"name\":\"user_name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"user_name\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-资源-查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-resource-up', '<if test=\" \'@upType\'==\'insert\' \">\r\ninsert into resource(id,name,url,open_mode,description,icon,pid,seq,status,opened,resource_type,create_time)\r\nvalues(#id#,#name#,#urls#,#open_mode#,#description#,#icon#,#pid#,#seq#,#status#,#opened#,#resource_type#,#create_time#)\r\n</if>\r\n<if test=\" \'@upType\'==\'update\' \">\r\nupdate resource set name=#name#,url=#urls#,open_mode=#open_mode#,description=#description#,icon=#icon#,pid=#pid#,seq=#seq#,status=#status#,opened=#opened#,resource_type=#resource_type#\r\nwhere id=#id#\r\n</if>\r\n<if test=\" \'@upType\'==\'delete\' \">\r\ndelete from resource where id=#id#\r\n</if>', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=\r\nnewFields=\r\nigFieldFilter=false', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"#{smlDateHelper.date().getTime().toString()}\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"seq\",\"type\":\"number\",\"defaultValue\":\"\",\"descr\":\"seq\",\"enabled\":\"0\"},\r\n{\"name\":\"icon\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"icon\",\"enabled\":\"0\"},\r\n{\"name\":\"open_mode\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"open_mode\",\"enabled\":\"0\"},\r\n{\"name\":\"create_time\",\"type\":\"date\",\"defaultValue\":\"#{smlDateHelper.date()}\",\"descr\":\"create_time\",\"enabled\":\"0\"},\r\n{\"name\":\"urls\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"url\",\"enabled\":\"0\"},\r\n{\"name\":\"pid\",\"type\":\"char\",\"defaultValue\":\"00\",\"descr\":\"pid\",\"enabled\":\"0\"},\r\n{\"name\":\"upType\",\"type\":\"char\",\"defaultValue\":\"insert\",\"descr\":\"upType\",\"enabled\":\"0\"},\r\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"name\",\"enabled\":\"0\"},\r\n{\"name\":\"description\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"description\",\"enabled\":\"0\"},\r\n{\"name\":\"status\",\"type\":\"number\",\"defaultValue\":\"\",\"descr\":\"status\",\"enabled\":\"0\"},\r\n{\"name\":\"opened\",\"type\":\"number\",\"defaultValue\":\"\",\"descr\":\"opened\",\"enabled\":\"0\"},\r\n{\"name\":\"resource_type\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"resource_type\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-资源-更新', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-role-qry', '<select id=\"select\">\r\n    select id,name,name as text,\'fi-torso-business\' as iconCls,description,status,case when status=\'0\' then \'正常\' else \'停用\' end as status_show,seq,create_time\r\n   from role where 1=1\r\n <isNotEmpty property=\"id\"> and id=#id#</isNotEmpty>\r\n\r\n</select>\r\n <if test=\" \'@queryType\'==\'select\' \">\r\n      select * from (<included id=\"select\"/> \r\n<isNotEmpty property=\"sort\"> \r\n     order by $sort$ $order$\r\n</isNotEmpty>) t limit  #start#,#rows#\r\n</if>\r\n <if test=\" \'@queryType\'==\'count\' \">\r\n      select  count(1) from (<included id=\"select\"/>) t\r\n</if>', 'PageDataBuilder\r\n#分页相关参数名称标识设定\r\npageMark=page\r\nlimitMark=rows\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=create_time\r\nnewFields=create_time@date(\'yyyy-MM-dd HH:mm:ss\')\r\nigFieldFilter=true', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"type\",\"type\":\"char\",\"defaultValue\":\"grid\",\"descr\":\"grid|tree\",\"enabled\":\"0\"},\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"rows\",\"type\":\"number\",\"defaultValue\":\"10\",\"descr\":\"每页大小\",\"enabled\":\"0\"},\r\n{\"name\":\"page\",\"type\":\"number\",\"defaultValue\":\"1\",\"descr\":\"当前页\",\"enabled\":\"0\"},\r\n{\"name\":\"sort\",\"type\":\"char\",\"defaultValue\":\"seq\",\"descr\":\"排序字段\",\"enabled\":\"0\"},\r\n{\"name\":\"order\",\"type\":\"char\",\"defaultValue\":\"asc\",\"descr\":\"排序\",\"enabled\":\"0\"},\r\n{\"name\":\"queryType\",\"type\":\"char\",\"defaultValue\":\"select\",\"descr\":\"查询类型\",\"enabled\":\"0\"},\r\n{\"name\":\"start\",\"type\":\"number\",\"defaultValue\":\"0\",\"descr\":\"start\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-角色-查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-role-up', '<if test=\" \'@upType\'==\'insert\' \">\r\n insert into role(id,name,description,seq,status,create_time)\r\nvalues (#id#,#name#,#description#,#seq#,#status#,#create_time#)\r\n</if>\r\n<if test=\" \'@upType\'==\'update\' \">\r\nupdate role set name=#name#,description=#description#,status=#status#,seq=#seq#\r\nwhere id=#id#\r\n</if>\r\n<if test=\" \'@upType\'==\'delete\' \">\r\ndelete from role where id=#id#\r\n</if>', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=\r\nnewFields=\r\nigFieldFilter=false', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"#{smlDateHelper.date().getTime().toString()}\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"seq\",\"type\":\"number\",\"defaultValue\":\"\",\"descr\":\"seq\",\"enabled\":\"0\"},\r\n{\"name\":\"create_time\",\"type\":\"date\",\"defaultValue\":\"#{smlDateHelper.date()}\",\"descr\":\"create_time\",\"enabled\":\"0\"},\r\n{\"name\":\"description\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"description\",\"enabled\":\"0\"},\r\n{\"name\":\"upType\",\"type\":\"char\",\"defaultValue\":\"insert\",\"descr\":\"upType\",\"enabled\":\"0\"},\r\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"name\",\"enabled\":\"0\"},\r\n{\"name\":\"status\",\"type\":\"number\",\"defaultValue\":\"0\",\"descr\":\"status\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-角色-更新', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-roleResource-qry', 'select t1.id,name as text,url as attributes,open_mode,icon as iconCls,pid,seq,case when t2.id is null then \'false\' else \'true\' end as checked\r\n from resource  t1 left join role_resource t2\r\non t1.id=t2.resource_id and t2.role_id=#id#\r\nand t1.status=0\r\norder by seq', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=create_time,checked\r\nnewFields=create_time@date(\'yyyy-MM-dd HH24:mm:ss\'),checked@boolean(\'\')\r\nigFieldFilter=true', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"id\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-角色资源-查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-syslog-qry', '<select id=\"select\">\r\n     select * from sys_log\r\n</select>\r\n <if test=\" \'@queryType\'==\'select\' \">\r\n      select * from ( select * from (<included id=\"select\"/> ) tt\r\n<isNotEmpty property=\"sort\"> \r\n     order by $sort$ $order$\r\n</isNotEmpty>) t limit  #start#,#rows#\r\n</if>\r\n <if test=\" \'@queryType\'==\'count\' \">\r\n      select  count(1) from (<included id=\"select\"/>) t\r\n</if>', 'PageDataBuilder\r\n#分页相关参数名称标识设定\r\npageMark=page\r\nlimitMark=rows\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=create_time\r\nnewFields=create_time@date(\'yyyy-MM-dd HH:mm:ss\')\r\nigFieldFilter=true', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"type\",\"type\":\"char\",\"defaultValue\":\"grid\",\"descr\":\"grid|tree\",\"enabled\":\"0\"},\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"rows\",\"type\":\"number\",\"defaultValue\":\"10\",\"descr\":\"每页大小\",\"enabled\":\"0\"},\r\n{\"name\":\"page\",\"type\":\"number\",\"defaultValue\":\"1\",\"descr\":\"当前页\",\"enabled\":\"0\"},\r\n{\"name\":\"sort\",\"type\":\"char\",\"defaultValue\":\"create_time\",\"descr\":\"排序字段\",\"enabled\":\"0\"},\r\n{\"name\":\"order\",\"type\":\"char\",\"defaultValue\":\"asc\",\"descr\":\"排序\",\"enabled\":\"0\"},\r\n{\"name\":\"queryType\",\"type\":\"char\",\"defaultValue\":\"select\",\"descr\":\"查询类型\",\"enabled\":\"0\"},\r\n{\"name\":\"start\",\"type\":\"number\",\"defaultValue\":\"0\",\"descr\":\"start\",\"enabled\":\"0\"},\r\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"create_time\",\"enabled\":\"0\"},\r\n{\"name\":\"orgId\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"orgId\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-日志-查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-user-qry', '<select id=\"select\">\r\n  select \r\nt1.id,login_name,t1.name,password,salt,sex,age,phone,user_type,\r\ncase when status=\'0\' then \'管理员\' else \'用户\' end as user_type_show,\r\ncase when status=\'0\' then \'正常\' else \'停用\' end as status_show,\r\ncase when sex=\'0\' then \'男\' else \'女\' end as sex_show,\r\nstatus,organization_id,t2.name as org_name,t1.create_time,\r\nGROUP_CONCAT(t3.name) as roleLst,GROUP_CONCAT(t3.id) as roleIds\r\nfrom user t1 left join organization t2 on t1.organization_id=t2.id\r\nleft join (select t1.id,t1.name,t2.user_id from role t1 left join user_role t2\r\non t1.id=t2.role_id) t3 on t1.id=t3.user_id\r\nwhere 1=1\r\n <isNotEmpty property=\"id\"> and t1.id=#id#</isNotEmpty>\r\n<isNotEmpty property=\"name\"> and t1.login_name like \'%$name$%\'</isNotEmpty>\r\n<isNotEmpty property=\"orgId\"> and t2.Id=#orgId#</isNotEmpty>\r\ngroup by t1.id\r\n</select>\r\n <if test=\" \'@queryType\'==\'select\' \">\r\n      select * from ( select * from (<included id=\"select\"/> ) tt\r\n<isNotEmpty property=\"sort\"> \r\n     order by $sort$ $order$\r\n</isNotEmpty>) t limit  #start#,#rows#\r\n</if>\r\n <if test=\" \'@queryType\'==\'count\' \">\r\n      select  count(1) from (<included id=\"select\"/>) t\r\n</if>', 'PageDataBuilder\r\n#分页相关参数名称标识设定\r\npageMark=page\r\nlimitMark=rows\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=create_time\r\nnewFields=create_time@date(\'yyyy-MM-dd HH:mm:ss\')\r\nigFieldFilter=true', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"type\",\"type\":\"char\",\"defaultValue\":\"grid\",\"descr\":\"grid|tree\",\"enabled\":\"0\"},\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"rows\",\"type\":\"number\",\"defaultValue\":\"10\",\"descr\":\"每页大小\",\"enabled\":\"0\"},\r\n{\"name\":\"page\",\"type\":\"number\",\"defaultValue\":\"1\",\"descr\":\"当前页\",\"enabled\":\"0\"},\r\n{\"name\":\"sort\",\"type\":\"char\",\"defaultValue\":\"name\",\"descr\":\"排序字段\",\"enabled\":\"0\"},\r\n{\"name\":\"order\",\"type\":\"char\",\"defaultValue\":\"asc\",\"descr\":\"排序\",\"enabled\":\"0\"},\r\n{\"name\":\"queryType\",\"type\":\"char\",\"defaultValue\":\"select\",\"descr\":\"查询类型\",\"enabled\":\"0\"},\r\n{\"name\":\"start\",\"type\":\"number\",\"defaultValue\":\"0\",\"descr\":\"start\",\"enabled\":\"0\"},\r\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"name\",\"enabled\":\"0\"},\r\n{\"name\":\"orgId\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"orgId\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-用户-查询', null);
INSERT INTO dm_co_ba_cfg_rcpt_if VALUES ('system-user-up', '<if test=\" \'@upType\'==\'insert\' \">\r\ninsert into user(id,login_name,name,password,salt,sex,age,phone,user_type,status,organization_id,create_time) \r\nvalues(#id#,#login_name#,#name#,#password#,#salt#,#sex#,#age#,#phone#,#user_type#,#status#,#organization_id#,#create_time#)\r\n\r\n</if>\r\n<if test=\" \'@upType\'==\'update\' \">\r\nupdate user set name=#name#,login_name=#login_name#,status=#status#,sex=#sex#,age=#age#,phone=#phone#,user_type=#user_type#,\r\norganization_id=#organization_id#\r\n<isNotEmpty property=\"password\">,password=#password#</isNotEmpty>\r\nwhere id=#id#\r\n</if>\r\n<if test=\" \'@upType\'==\'delete\' \">\r\ndelete from user where id=#id#\r\n</if>', 'DefaultDataBuilder\r\n#拦截-返回key是否小写拦截\r\ntoLowerCaseForKey=false\r\n#拦截-返回oriFields,newFields是否忽视只返回配置字段\r\noriFields=\r\nnewFields=\r\nigFieldFilter=false', '{\r\n\"sqlParams\":\r\n[\r\n{\"name\":\"id\",\"type\":\"char\",\"defaultValue\":\"#{smlDateHelper.date().getTime().toString()}\",\"descr\":\"id\",\"enabled\":\"0\"},\r\n{\"name\":\"organization_id\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"organization_id\",\"enabled\":\"0\"},\r\n{\"name\":\"create_time\",\"type\":\"date\",\"defaultValue\":\"#{smlDateHelper.date()}\",\"descr\":\"create_time\",\"enabled\":\"0\"},\r\n{\"name\":\"sex\",\"type\":\"number\",\"defaultValue\":\"0\",\"descr\":\"sex\",\"enabled\":\"0\"},\r\n{\"name\":\"upType\",\"type\":\"char\",\"defaultValue\":\"insert\",\"descr\":\"upType\",\"enabled\":\"0\"},\r\n{\"name\":\"name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"name\",\"enabled\":\"0\"},\r\n{\"name\":\"status\",\"type\":\"number\",\"defaultValue\":\"0\",\"descr\":\"status\",\"enabled\":\"0\"},\r\n{\"name\":\"user_type\",\"type\":\"number\",\"defaultValue\":\"1\",\"descr\":\"user_type\",\"enabled\":\"0\"},\r\n{\"name\":\"login_name\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"login_name\",\"enabled\":\"0\"},\r\n{\"name\":\"age\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"age\",\"enabled\":\"0\"},\r\n{\"name\":\"phone\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"phone\",\"enabled\":\"0\"},\r\n{\"name\":\"salt\",\"type\":\"char\",\"defaultValue\":\"#{smlDateHelper.date().getTime().toString()}\",\"descr\":\"salt\",\"enabled\":\"0\"},\r\n{\"name\":\"password\",\"type\":\"char\",\"defaultValue\":\"\",\"descr\":\"password\",\"enabled\":\"0\"}\r\n]\r\n}', '0', '0', 'master', '系统管理-用户-更新', null);
