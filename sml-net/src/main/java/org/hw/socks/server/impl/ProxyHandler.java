


package	org.hw.socks.server.impl;


import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;

import org.hw.sml.support.LoggerHelper;
import org.hw.socks.server.commons.Constants;
import org.hw.socks.server.commons.DebugLog;


public class ProxyHandler	implements	Runnable
{
	protected	Object	m_lock;
	
	
	
	protected	Thread		m_TheThread	= null;

	public	Socket			m_ClientSocket	= null;
	public	Socket			m_ServerSocket	= null;
	
	public	byte[]			m_Buffer		= null;
	
	public	InputStream		m_ClientInput	= null;
	public	OutputStream	m_ClientOutput	= null;
	public	InputStream		m_ServerInput	= null;
	public	OutputStream	m_ServerOutput	= null;
	protected String username;
	protected String password;
	
	public	ProxyHandler(Socket clientSocket, String username, String password) {	
		m_lock = this;
		m_ClientSocket = clientSocket;
		this.username=username;
		this.password=password;
		if( m_ClientSocket != null )	{
			try	{
				m_ClientSocket.setSoTimeout( Constants.DEFAULT_PROXY_TIMEOUT );
			}
			catch( SocketException e )	{
				LoggerHelper.getLogger().error(getClass(), "Socket Exception during seting Timeout." );
			}
		}
		
		m_Buffer = new byte[ Constants.DEFAULT_BUF_SIZE ];
		
		LoggerHelper.getLogger().debug(getClass(), "Proxy Created." );
	}
		
	public	void setLock( Object lock ) {
		this.m_lock = lock;
	}
	
	public	void	start()
	{
		m_TheThread = new Thread( this );
		m_TheThread.start();
		LoggerHelper.getLogger().debug(getClass(),"Proxy Started." );
	}

	public	void	stop()	{
	
		try	{
			if( m_ClientSocket != null )	m_ClientSocket.close();
			if( m_ServerSocket  != null )	m_ServerSocket.close();
		}
		catch( IOException e )	{
		}
		
		m_ClientSocket = null;
		m_ServerSocket  = null;
		
		LoggerHelper.getLogger().debug(getClass(),"Proxy Stopped." );
		
		m_TheThread.interrupt();
	}
	 
	public	void	run()
	{
		setLock( this );
		
		if( !prepareClient() )	{
			LoggerHelper.getLogger().debug(getClass(),"Proxy - client socket is null !" );
			return;
		}

		processRelay();

		close();
	}
	
	public	void close()		{
		try	{
			if( m_ClientOutput != null )	{
				m_ClientOutput.flush();
				m_ClientOutput.close();
			}
		}
		catch( IOException e )	{
		}
		try	{
			if( m_ServerOutput != null )	{
				m_ServerOutput.flush();
				m_ServerOutput.close();
			}
		}
		catch( IOException e )	{
		}
		
		try	{
			if( m_ClientSocket != null )	{
					m_ClientSocket.close();
				}
			}
			catch( IOException e )	{
		}
		
		try	{
			if( m_ServerSocket != null )	{
					m_ServerSocket.close();
				}
			}
			catch( IOException e )	{
		}
		
		m_ServerSocket = null;
		m_ClientSocket = null;
		
		LoggerHelper.getLogger().debug(getClass(),"Proxy Closed." );
	}
	
	public	void sendToClient( byte[] buffer )	{
		sendToClient( buffer, buffer.length );
	}
	
	public	void sendToClient( byte[] buffer, int len )	{
		if( m_ClientOutput == null )		return;
		if( len <= 0 || len > buffer.length )	return;
		
		try	{
			m_ClientOutput.write( buffer, 0, len );
			m_ClientOutput.flush();
		}
		catch( IOException e )	{
			LoggerHelper.getLogger().error(getClass(), "Sending data to client" );
		}
	}
	
	public void sendToServer( byte[] buffer )	{
		sendToServer( buffer, buffer.length );
	}
	
	public	void sendToServer( byte[] buffer, int len )	{
		if( m_ServerOutput == null )		return;
		if( len <= 0 || len > buffer.length )	return;
		
		try	{
			m_ServerOutput.write( buffer, 0, len );
			m_ServerOutput.flush();
		}
		catch( IOException e )	{
			LoggerHelper.getLogger().error(getClass(), "Sending data to server" );
		}
	}
	
	
	public	boolean	isActive()	{
		return	(m_ClientSocket != null && m_ServerSocket != null);	
	}
	
	
	public	void connectToServer( String server, int port ) throws IOException, UnknownHostException {

		if( server.equals("") )	{
			close();
			LoggerHelper.getLogger().error(getClass(),( "Invalid Remote Host Name - Empty String !!!" ));
			return;
		}
		
		m_ServerSocket = new Socket( server, port );
		m_ServerSocket.setSoTimeout( Constants.DEFAULT_PROXY_TIMEOUT );
		
		LoggerHelper.getLogger().debug(getClass(),"Connected to "+DebugLog.getInstance().getSocketInfo( m_ServerSocket ) );
		prepareServer();
	}

	protected void prepareServer() throws IOException	{
		synchronized( m_lock )
		{
			m_ServerInput  = m_ServerSocket.getInputStream();
			m_ServerOutput = m_ServerSocket.getOutputStream();
		}
	}
	
	public	boolean	prepareClient()	{
		if( m_ClientSocket == null )	return false;

		try	{
			m_ClientInput = m_ClientSocket.getInputStream();
			m_ClientOutput= m_ClientSocket.getOutputStream();
		}
		catch( IOException e )	{
			LoggerHelper.getLogger().debug(getClass(),"Proxy - can't get I/O streams!" );
			LoggerHelper.getLogger().debug(getClass(), e.toString() );
			return	false;
		}
		return	true;
	}
	
	

	Socks4Impl	comm = null;
	
	public	void processRelay()	{
		
		try	{
			byte SOCKS_Version	= getByteFromClient();
			switch( SOCKS_Version )	{
			case Constants.SOCKS4_Version:	comm = new Socks4Impl( this );
											break;
			case Constants.SOCKS5_Version:	{
				comm = new Socks5Impl( this );
				comm.setPassword(password);
				comm.setUsername(username);
				break;
			}
			default:	LoggerHelper.getLogger().debug(getClass(), "Invalid SOKCS version : "+SOCKS_Version );
						return;
			}
			LoggerHelper.getLogger().debug(getClass(), "Accepted SOCKS "+SOCKS_Version+" Request." );
			comm.authenticate( SOCKS_Version );
			
			comm.getClientCommand();
			switch ( comm.socksCommand )	{
			case Constants.SC_CONNECT	:comm.connect();
										relay();
										break;
			
			case Constants.SC_BIND	:	comm.bind();
										relay();
										break;
			
			case Constants.SC_UDP		:	comm.udp();
										break;
			}
		}
		catch( Exception   e )	{
			LoggerHelper.getLogger().error(getClass(), e.toString() );
			e.printStackTrace();
		}
	} 

	public	byte getByteFromClient() throws Exception {
		int	b;
		while( m_ClientSocket != null )		{
			
			try	{
				b = m_ClientInput.read();
			}
			catch( InterruptedIOException e )		{
				Thread.yield();
				continue;
			}
						
			return (byte)b; // return loaded byte
	
		} // while...
		throw	new Exception( "Interrupted Reading GetByteFromClient()");
	} // GetByteFromClient()...
	
	public	void relay()	{
	
		boolean	isActive = true;
		int		dlen = 0;

		while( isActive )	{
			
		//---> Check for client data <---
			
			dlen = checkClientData();
			
			if( dlen < 0 )	isActive = false;
			if( dlen > 0 )	{
				logClientData( dlen );
				sendToServer( m_Buffer, dlen );
			}
			
			//---> Check for Server data <---
			dlen = checkServerData();
			
			if( dlen < 0 )	isActive = false;
			if( dlen > 0 )	{
				logServerData( dlen );
				sendToClient( m_Buffer, dlen );
			}
			
			Thread.currentThread();
			Thread.yield();
		}	// while
	}
	
	

	public	int	 checkClientData()	{
		synchronized( m_lock )
		{
		//	The client side is not opened.
			if( m_ClientInput == null )	return -1;
	
			int	dlen = 0;
	
			try
			{
				dlen = m_ClientInput.read( m_Buffer, 0, Constants.DEFAULT_BUF_SIZE );
			}
			catch( InterruptedIOException e )		{
				return	0;
			}
			catch( IOException e )		{
				LoggerHelper.getLogger().debug(getClass(), "Client connection Closed!" );
				close();	//	Close the server on this exception
				return -1;
			}
	
			if( dlen < 0 )	close();
	
			return	dlen;
		}
	}
	
	public	int	checkServerData()	{
		synchronized( m_lock )
		{
		//	The client side is not opened.
			if( m_ServerInput == null )	return -1;
	
			int	dlen = 0;
	
			try
			{
				dlen = m_ServerInput.read( m_Buffer, 0, Constants.DEFAULT_BUF_SIZE );
			}
			catch( InterruptedIOException e )		{
				return	0;
			}
			catch( IOException e )		{
				LoggerHelper.getLogger().debug(getClass(),"Server connection Closed!" );
				close();	//	Close the server on this exception
				return -1;
			}
	
			if( dlen < 0 )	close();
	
			return	dlen;
		}
	}

	public	void	logServerData( int traffic )	{
		/*DebugLog.getInstance().println("Srv data : "+
					DebugLog.getInstance().getSocketInfo( m_ClientSocket ) +
					" << <"+
					comm.m_ServerIP.getHostName()+"/"+
					comm.m_ServerIP.getHostAddress()+":"+
					comm.m_nServerPort+"> : " + 
					traffic +" bytes." );*/
	}
	

	public	void	logClientData( int traffic )	{
		/*DebugLog.getInstance().println("Cli data : "+
					DebugLog.getInstance().getSocketInfo( m_ClientSocket ) +
					" >> <"+
					comm.m_ServerIP.getHostName()+"/"+
					comm.m_ServerIP.getHostAddress()+":"+
					comm.m_nServerPort+"> : " + 
					traffic +" bytes." );*/
	}
	public Socket getSocksServer() {
		return m_ServerSocket;
	}
}
