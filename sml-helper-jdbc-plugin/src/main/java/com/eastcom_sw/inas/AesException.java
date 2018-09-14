package com.eastcom_sw.inas;

public class AesException extends Exception
{
  public AesException(String message, Throwable cause)
  {
    super(message, cause);
  }

  public AesException(String message) {
    super(message);
  }
}