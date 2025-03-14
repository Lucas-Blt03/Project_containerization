# Event Management Web Application

## Description
This project is a web application based on a **microservices** architecture that allows users to create, manage, and register for events. The application is designed to be scalable and secure thanks to the use of **Docker**, **CI/CD with GitLab**, and an **optimized database management system**.

## Main Features
- **Event creation and management** (title, description, date, location, category)
- **Event registration and participation**
- **Advanced search and filtering**
- **User management and authentication** (if implemented)

## Project Architecture

### **1. Event Microservice**
- Event management (creation, update, deletion)
- Storing event information in **PostgreSQL**
- RESTful API developed with **Node.js (Express)**

### **2. User Microservice**
- User management and authentication
- Role and permission management (admin, user)
- Storing user data in **MongoDB**
- Developed with **FastAPI (Python)**

### **3. Frontend**
- User interface developed with **React**
- Connection to microservices via REST API
- Hot Reload enabled for smooth development

### **4. Nginx (Reverse Proxy)**
- Managing requests between the frontend and microservices
- Securing endpoints

## Technologies Used
- **Backend**:
  - **Event Microservice** → **Node.js (Express) + PostgreSQL**
  - **User Microservice** → **FastAPI + MongoDB**
- **Frontend**: **React**
- **Containerization**: **Docker, Docker Compose**
- **CI/CD**: **GitLab CI/CD**
- **Security**:
  - **Network isolation** of microservices via Docker
  - **JWT/OAuth2** for user authentication
- **Hot Reload**: **Bind mounts** for live development

## Installation and Execution

### **Prerequisites**
- **Docker** and **Docker Compose** installed
- **Node.js >= 16** (if developing outside a container)
- Access to **GitLab (gitlab.sre.paris)**

### **Installation**
1. **Clone the project**
   ```sh
   git clone ssh://git@gitlab.sre.paris:24366/2024-2025/esilv-4-a4-std-cdof4/Group-3.git
   cd Group-3
   ```

2. **Set up environment variables**
   - Create a `.env` file in each microservice (`event-service/.env` and `user-service/.env`)
   ```
   DATABASE_URL=postgres://user:password@db:5432/eventdb
   JWT_SECRET=TO_BE_COMPLETED
   ```

3. **Run the application with Docker Compose**
   ```sh
   docker-compose up --build
   ```

4. **Access the services**
   - **Frontend**: `http://localhost:3000`
   - **API Events**: `http://localhost:5000/api/events`
   - **API Users**: `http://localhost:5001/api/users`
   - **Nginx Proxy**: `http://localhost`

## Implemented Best Practices
✔️ **Full CI/CD** with tests and **security analysis of Dockerfiles**  
✔️ **Strict network isolation** between microservices  
✔️ **Persistent volumes** to prevent data loss  
✔️ **Use of a reverse proxy (Nginx)** to enhance security and scalability  
