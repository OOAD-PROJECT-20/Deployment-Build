# 🛁 Bathware System - E-Commerce Platform

A full-stack e-commerce platform for bathroom products with user management, product catalog, cart, quotations, and support ticketing system.

## 🏗️ Architecture

- **Backend:** Spring Boot (Java 21) with MySQL/PostgreSQL
- **Frontend:** React.js with React Router
- **Deployment:** Render.com (Backend + Database) + Netlify (Frontend)

## 🚀 Quick Start - Local Development

### Prerequisites
- Java 21
- Node.js 16+
- MySQL 8.0+ (for local development)
- Maven 3.8+

### Backend Setup

1. Navigate to backend directory:
```bash
cd BathwareNew
```

2. Configure database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bathware_system
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run the backend:
```bash
mvn spring-boot:run
```

Backend will start on: http://localhost:8080

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd BathwareNew/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will start on: http://localhost:3000

## 🌐 Deployment

For easy deployment to production, see our comprehensive guides:

### 📚 Deployment Documentation

1. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide with screenshots and troubleshooting
2. **[QUICK_START.md](QUICK_START.md)** - Quick reference checklist

### ⚡ Quick Deployment Summary

1. **Push code to GitHub**
2. **Deploy Database & Backend on Render.com** (Free tier available)
3. **Deploy Frontend on Netlify** (Free tier available)
4. **Total time: ~30 minutes**
5. **Total cost: $0/month** (on free tiers)

See the full guides for detailed instructions!

## 📂 Project Structure

```
BathwareNew/
├── src/                          # Backend source code
│   ├── main/
│   │   ├── java/backend/user_profile_backend/
│   │   │   ├── config/          # Security & CORS config
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── model/           # Database entities
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── service/         # Business logic
│   │   │   └── dto/             # Data transfer objects
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-prod.properties
│   └── test/                    # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── config/              # API configuration
│   │   └── styles/              # CSS files
│   ├── public/                  # Static assets
│   └── package.json
├── Database/                     # SQL schema files
├── Dockerfile                    # Docker configuration
├── render.yaml                   # Render deployment config
└── pom.xml                      # Maven dependencies
```

## 🔑 Key Features

### User Management
- User registration and authentication
- Role-based access control (Admin/Customer)
- Profile management

### Product Management
- Product catalog with categories (Water Closets, Basins, Bathroom Sets, Others)
- Product CRUD operations (Admin only)
- Image upload support
- Stock management

### Shopping Features
- Shopping cart
- Quotation requests
- Order management
- Payment proof upload

### Admin Features
- User management
- Product management
- Quotation approval/rejection
- Order tracking
- Support ticket management

### Support System
- Customer support tickets
- Ticket status tracking (Open, In Progress, Closed)
- Admin response system

## 🛠️ Technologies Used

### Backend
- Spring Boot 3.5.6
- Spring Security
- Spring Data JPA
- MySQL / PostgreSQL
- Maven
- Java 21

### Frontend
- React 19
- React Router 7
- Axios
- Lucide React (icons)
- CSS3

### Deployment
- Docker
- Render.com (Backend & Database)
- Netlify (Frontend)
- Git & GitHub

## 🔒 Security Features

- Password encryption (BCrypt)
- CORS configuration
- Session-based authentication
- Role-based authorization
- Secure file upload handling

## 📧 Email Configuration

The system uses Gmail SMTP for sending emails. Configure in `application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

⚠️ **Note:** Use Gmail App Password, not your regular password.

## 🐛 Troubleshooting

### Backend won't start
- Check database connection settings
- Ensure MySQL/PostgreSQL is running
- Verify Java 21 is installed

### Frontend won't connect to backend
- Check API_BASE_URL in `frontend/src/config/api.js`
- Verify backend is running on correct port
- Check CORS settings in backend

### Deployment issues
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) troubleshooting section
- Check build logs in Render/Netlify dashboards
- Verify environment variables are set correctly

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Cart & Quotations
- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart` - Add to cart
- `POST /api/quotations` - Create quotation
- `GET /api/quotations/user/{userId}` - Get user quotations

### Support
- `GET /api/support` - Get all tickets
- `POST /api/support` - Create ticket
- `PUT /api/support/{id}` - Update ticket status
- `DELETE /api/support/{id}` - Delete ticket

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/{id}` - Update user (Admin)
- `GET /api/admin/quotations` - Get all quotations (Admin)
- `PUT /api/admin/quotations/{id}` - Update quotation status (Admin)

## 🤝 Contributing

This is a private project. For contributions, please follow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

For questions or support, contact the development team.

---

**Happy Coding! 🚀**

