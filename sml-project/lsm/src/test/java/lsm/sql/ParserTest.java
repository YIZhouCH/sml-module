package lsm.sql;

import java.io.StringReader;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.parser.JSqlParser;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.Select;

public class ParserTest {
	public static void main(String[] args) throws JSQLParserException {
		JSqlParser jp=new CCJSqlParserManager();
		Statement stmt=		jp.parse(new StringReader("select a,d,c,d,e,f,h from dual t1,dual t2 where t1.a=t2.aa"));
		Select select = (Select) stmt;  
		System.out.println(select);
	}
}
