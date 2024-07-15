# **Project**

- Initialized Project using **npm init**.

#### Installed Packages

**express**, **mongoose**, **jsonwebtoken**, **bcrypt**, **cors**, **dotenv**, **validator**.

- **npm start** or **npm run dev** for starting project.
- created two models:- **_Product_** and **_User_**
- For user created two apis: - **1. Register**, **2. Login**
- For Product created four apis:- **1.add Product**, **2.update Product**, **3.get Product**, **4.delete Product**

## User

### Register

- it accecpts username, password, role, email
- if the fileds empty or user already exists it throws an error
- used validator package to check the _email_ and _password_ is valid or not
- it accepts three types of users only 1. admin, 2.manager, 3.staff
- password hasing using bcrypt package
- if all validations are passed it generates a JWT Token using _jsonwebtoken_ package

### Login

- it accecpts email and password
- it check the user entered password with db stored password using bcrypt

## products

- created crud operations
- created a middleware function to check the user has right to access the products or not
- added this middleware to each prodcut related function
- here product **creation(post)** and **delete** is access by admin only
- product **update(put)** and **Read(get)** is access by admin and manager
