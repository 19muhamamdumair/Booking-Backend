import React, { Component } from 'react'


class CustomErrorHandler extends Error {
  constructor(status,msg){
    super();
    this.status=status;
    this.message=msg
  }

  static alreadyExist(message){//it is not required to create an object for static class
    return new CustomErrorHandler(409,message);
  }
  
  static wrongCredentials(message='Username or Password is wrong'){
    return new CustomErrorHandler(401,message)
  }

  static unAuthorized(message='unAuthorized'){
    return new CustomErrorHandler(401,message)
  }

  static notFound(message='404 not Found'){
    return new CustomErrorHandler(404,message)
  }

  static serverError(message='Internal Server Error')
  {
    return new CustomErrorHandler(500,message);
  }
    
}
export default  CustomErrorHandler
