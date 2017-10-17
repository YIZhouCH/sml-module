package org.sml.mybatis.plugins;

import java.sql.Clob;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.ibatis.executor.resultset.ResultSetHandler;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;

@Intercepts({ @Signature(type = ResultSetHandler.class, method = "handleResultSets", args = { Statement.class}) })
public class RstInterceptor implements Interceptor {
	public static final Object[] OBJSCLASS=new Object[]{};
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public Object intercept(Invocation invocation) throws Throwable {
        Object result = invocation.proceed();
        if (result instanceof List) {
            List resultList = (List) result;
            for (int i = 0; i < resultList.size(); i++) {
                if (resultList.get(i) instanceof Map) {
                	Map<String,Object> map=(Map<String, Object>) resultList.get(i);
                    for(Map.Entry<String,Object> entry:map.entrySet()){
                    	if(entry.getValue() instanceof Clob){
                    		Clob c=(Clob)entry.getValue();
                    		map.put(entry.getKey(),c.getSubString(1,(int) c.length()));
                    	}
                    }
                }
            }
        }
        return result;
    }

    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    public void setProperties(Properties arg0) {
    }
}