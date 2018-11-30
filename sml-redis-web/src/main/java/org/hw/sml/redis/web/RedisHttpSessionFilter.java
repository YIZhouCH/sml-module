package org.hw.sml.redis.web;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import javax.servlet.http.HttpSession;

public class RedisHttpSessionFilter  implements Filter{
	

    public static final String TOKEN_HEADER_NAME = "x-auth-token";
   
    private RedisConnection redisConnection;
    
    private boolean isCreate=false;


    public RedisHttpSessionFilter(String url,boolean isCreate){
    	redisConnection=new RedisConnection(url);
    	this.isCreate=isCreate;
    }


    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        RedisSessionRequestWrapper requestWrapper = new RedisSessionRequestWrapper((HttpServletRequest) request);
        RedisSessionResponseWrapper responseWrapper = new RedisSessionResponseWrapper((HttpServletResponse) response, requestWrapper);
        chain.doFilter(requestWrapper, responseWrapper);
    }

    private final class RedisSessionRequestWrapper extends HttpServletRequestWrapper{

        private HttpServletRequest request;

        private String token;
        /**
         * Constructs a request object wrapping the given request.
         *
         * @param request
         * @throws IllegalArgumentException if the request is null
         */
        public RedisSessionRequestWrapper(HttpServletRequest request) {
            super(request);
            this.request = request;
            //this.token = request.getHeader(TOKEN_HEADER_NAME);
            request.setAttribute(RedisHttpSession.isSendFirstCookie,isCreate);
            Cookie[] cookies=request.getCookies();
            if(cookies!=null){
	            for(Cookie cookie:cookies){
	            	if(cookie.getName().equals(RedisHttpSession.SESSIONKEY)){
	            		if(redisConnection.exists(RedisHttpSession.SESSION_PREFIX+cookie.getValue())){
	            			this.token=cookie.getValue();
	            			request.setAttribute(RedisHttpSession.isSendFirstCookie,false);
	            			break;
	            		}
	            	}
	            }
            }
           
        }

        @Override
        public HttpSession getSession(boolean create) {
            if (token != null) {
                return RedisHttpSession.createWithExistSession(token,request.getServletContext(),redisConnection);
            } else if (create){
            	RedisHttpSession session = RedisHttpSession.createNew(request.getServletContext(),redisConnection);
                token = session.getId();
                return session;
            } else {
                return null;
            }
        }

        @Override
        public HttpSession getSession() {
            return getSession(true);
        }

        @Override
        public String getRequestedSessionId() {
            return token;
        }
    }

    private final class RedisSessionResponseWrapper extends HttpServletResponseWrapper {
        /**
         * Constructs a response adaptor wrapping the given response.
         *
         * @param response
         * @throws IllegalArgumentException if the response is null
         */
        public RedisSessionResponseWrapper(HttpServletResponse response, RedisSessionRequestWrapper request) {
            super(response);
            //if session associate with token is not existed, create one for the response
            //response.setHeader(TOKEN_HEADER_NAME, request.getSession(true).getId());
            Object obj=request.getAttribute("isSendFirstCookie");
	        if(obj!=null&&(Boolean) request.getAttribute("isSendFirstCookie")){
		           Cookie cookie=new Cookie(RedisHttpSession.SESSIONKEY,request.getSession(isCreate).getId());
		           cookie.setDomain(request.getServerName());
		           cookie.setMaxAge(RedisHttpSession.DEFAULT_MAX_INACTIVE_INTERVAL_SECONDS);
		           cookie.setPath(request.getContextPath());
		           response.addCookie(cookie);
	         }
        }
    }

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		
	}


	@Override
	public void destroy() {
		
	}
}