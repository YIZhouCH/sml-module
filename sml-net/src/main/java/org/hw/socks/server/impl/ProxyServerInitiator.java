

package	org.hw.socks.server.impl;



import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.ServerSocket;
import java.net.Socket;

import org.hw.sml.support.LoggerHelper;
import org.hw.socks.server.commons.Constants;
import org.hw.socks.server.commons.DebugLog;



public class ProxyServerInitiator	implements	Runnable
{
	
	
	protected	Object	m_lock;
	
	protected	Thread			m_TheThread		= null;

	protected	ServerSocket	m_ListenSocket	= null;
	
	protected	int				m_nPort			= 0;
	
	protected String username;
	protected String password;
	
	public	int		getPort()		{	return	m_nPort;		}

	public	ProxyServerInitiator(int listenPort) {
		
		m_lock = this;	
		m_nPort			= listenPort;
		LoggerHelper.getLogger().debug(getClass(),"SOCKS Server Created." );
	}
	
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public	void setLock( Object lock ) {
		this.m_lock = lock;
	}
	

	public	void start() {
		m_TheThread = new Thread( this );
		m_TheThread.start();
		LoggerHelper.getLogger().debug(getClass(), "SOCKS Server Started." );
	}

	public	void	stop()	{
		LoggerHelper.getLogger().debug(getClass(), "SOCKS Server Stopped." );
		m_TheThread.interrupt();
	}
	
	public	void	run()
	{
		setLock( this );
		listen();
		close();
	}

	public	void close() {
		
		if( m_ListenSocket != null )	{
			try	{
				m_ListenSocket.close();
			}
			catch( IOException e )	{
			}
		}
		m_ListenSocket = null;
		LoggerHelper.getLogger().debug(getClass(), "SOCKS Server Closed." );
	}
	
	public	boolean	isActive()	{
		return	(m_ListenSocket != null);	
	}
	
	
	private	void prepareToListen()	throws java.net.BindException, IOException {
		synchronized( m_lock )
		{
			m_ListenSocket = new ServerSocket( m_nPort );
			m_ListenSocket.setSoTimeout( Constants.LISTEN_TIMEOUT );
	
			if( m_nPort == 0 )	{
				m_nPort = m_ListenSocket.getLocalPort();
			}
			LoggerHelper.getLogger().debug(getClass(),"SOCKS Server Listen at Port : " + m_nPort );
		}
	}
	
	protected	void listen() {
	
		try
		{
			prepareToListen();
		}
		catch( java.net.BindException e )	{
			LoggerHelper.getLogger().error(getClass(), "The Port "+m_nPort+" is in use !" );
			LoggerHelper.getLogger().error(getClass(),e.toString() );
			return;
		}
		catch( IOException e )	{
			LoggerHelper.getLogger().error(getClass(), "IO Error Binding at port : "+m_nPort );
			return;
		}

		while( isActive() )	{
			checkClientConnection();
			Thread.yield();
		}
	}
	
	public	void checkClientConnection()	{
		synchronized( m_lock )
		{
		//	Close() method was probably called.
			if( m_ListenSocket == null )	return;
	
			try
			{
				Socket clientSocket = m_ListenSocket.accept();
				clientSocket.setSoTimeout( Constants.DEFAULT_SERVER_TIMEOUT );
				LoggerHelper.getLogger().debug(getClass(), "Connection from : " + DebugLog.getInstance().getSocketInfo( clientSocket ) );
				ProxyHandler proxy = new ProxyHandler(clientSocket,username,password);
				proxy.start();
			}
			catch( InterruptedIOException e )		{
			//	This exception is thrown when accept timeout is expired
			}
			catch( Exception e )	{
				LoggerHelper.getLogger().error(getClass(), e.toString() );
			}
		}	// synchronized
	}
}

