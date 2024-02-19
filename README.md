# NestJS Project - Blog App

This project is a NestJS application for managing a Blog app. It includes resources such as Authentication, Blogs, Topics, and Users.

## Table of Contents

- [Entities](#entities)
- [Resources](#resources)
- [CRUD Endpoints](#crud-endpoints)


## Entities

1. Blog
2. Permission
3. Role
4. Topic
5. User

## Resources

- Auth
- Blogs
- Topics
- Users


## CRUD Endpoints

### Users

- Create a new user account: `POST /user`
    dto:
    {
    "username": "",
    "emailId": "",
    "password": "",
    "firstName": "",
    "lastName": ""
    }
  
- Get user details: `GET /user/details`
  

### Login

- Authenticate and get an access token: `POST /auth/login`
    dto:
    {
    "username":"",
    "password":""
    }


### Topics

- Create a new topic: `POST /topic`
    dto:
    {
    "name":"",
    "desc":""
    }
  
- Assign a topic: `POST /topic/assign-topic`
    dto:
    {
     "username":"",
     "topicName:"" 
    }
  
- Dessign a topic: `PATCH /topic/deassign-topic`
    dto:
    {
     "username":"",
     "topicName:"" 
    }
  
### Blogs

- Create a new blog: `POST /blog`
  {
    "topicName":"",
    "name":"",
    "desc":"",
    "header":"",
    "body":"",
    "footer":""
  }
  
- Get all blogs of logged in user: `GET /blog`
- Get all blogs of a topic: `GET /blog/:topicname`
- Update a blog: `PATCH /blog/:blogname`
  {
    "topicName":"",
    "name":"",
    "desc":"",
    "header":"",
    "body":"",
    "footer":""
  }
    
- Delete a blog: `DELETE /blog/:blogname`


### Roles

- Assign a role: `POST /role/assign-role`
- Get user roles: `GET /role/user-roles`
