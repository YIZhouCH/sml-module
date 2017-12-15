

import javax.sql.DataSource;

import org.apache.ibatis.session.RowBounds;
import org.hw.sml.jdbc.JdbcTemplate;
import org.hw.sml.jdbc.impl.DefaultJdbcTemplate;
import org.hw.sml.mybatis.test.Test;
import org.hw.sml.queryplugin.SqlMarkup;
import org.hw.sml.support.aop.AbstractAspect;
import org.hw.sml.support.aop.Invocation;
import org.hw.sml.support.aop.MethodProxyFactory;
import org.hw.sml.support.ioc.BeanHelper;
import org.hw.sml.tools.Maps;
import org.sml.mybatis.MybatisProxyService;

public class Test1 {
	public static void main(String[] args) throws InterruptedException, IllegalArgumentException, SecurityException, IllegalAccessException, NoSuchFieldException {
		Test test=BeanHelper.getBean(MybatisProxyService.class).getMapper(Test.class);
		System.out.println(test.query(new RowBounds(0, 1)).size());
		System.out.println(test.queryOne().size());
		System.out.println(test.count("if"));
		System.out.println(test.queryUser());
		/*Configuration conf=BeanHelper.getBean(MybatisProxyService.class).getSqlSession("defJt").getConfiguration();
		Collection<String> lst=conf.getMappedStatementNames();
		conf.getMappedStatement("org.hw.sml.mybatis.test.Test.queryUser").getCache().clear();
		conf.getMappedStatement("queryUser").getCache().clear();*/

		System.out.println(test.queryUser());
		//System.out.println(Arrays.asList(ClassUtil.getInterfaces(SqlMarkupTemplate.class)));
		System.out.println(BeanHelper.getBean(SqlMarkup.class).querySql("id","select * from dual where 1=1  <isNotEmpty property=\"a\"> and 1=#a#</isNotEmpty>",new Maps<String,String>().put("a", "1").getMap()));
		JdbcTemplate jdbcTemplate=MethodProxyFactory.newProxyInstance(new DefaultJdbcTemplate(BeanHelper.getBean(DataSource.class)), new AbstractAspect() {
			public void doBefore(Invocation invocation) throws Throwable {
				System.out.println("start:"+invocation.getTarget().getClass());
				invocation.proceed();
			}
			
			public void doAfter(Invocation invocation) throws Throwable {
				System.out.println("end:"+invocation.getTarget().getClass());
			}
		});
		System.out.println(jdbcTemplate.queryForInt("select 1 from dual"));
			String name=Test1.class.getClassLoader().getResource("").getPath();
			System.out.println(name);
	}
}
