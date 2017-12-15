package org.hw.sml.mybatis.test;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.session.RowBounds;
import org.hw.sml.mybatis.test.dto.User;

public interface Test {
	public List query(RowBounds rowBounds);
	public Map queryOne();
	@Select("select count(1) from DM_CO_BA_CFG_RCPT_IF where id like '%'||#{id}||'%'")
	public int count(@Param("id")String id);
	public List<User> queryUser();
}
