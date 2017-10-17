package org.sml.mybatis.plugins;


public class OracleDialect extends Dialect {

    public String getLimitString(String sql, int offset, int limit) {

        sql = sql.trim();
        StringBuilder pagingSelect = new StringBuilder(sql.length() + 100);
//        pagingSelect.append("select * from ( select row_.*, rownum rownum_ from ( ");
        pagingSelect.append("select * from (select row_.*, rownum rownum_ from ( ");
        pagingSelect.append(sql);
//        pagingSelect.append(" ) row_ ) where rownum_ > ").append(offset).append(" and rownum_ <= ").append(offset + limit);
        pagingSelect.append(" ) row_ where rownum <= ").append(offset + limit).append(" )  where rownum_ > ").append(offset);
        return pagingSelect.toString();
    }
}
