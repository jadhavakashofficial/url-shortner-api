# URL Shortener Service

A simple and efficient URL shortener service built with NestJS, MongoDB, and Mongoose. This service allows users to create shortened URLs with optional custom codes, track click analytics, and access comprehensive API documentation.

## Features

- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Short Codes**: Option to specify custom short codes for branded URLs
- **Click Analytics**: Track the number of clicks for each shortened URL
- **RESTful API**: Clean and intuitive API endpoints
- **Swagger Documentation**: Interactive API documentation available at `/docs`
- **Input Validation**: Robust validation for URLs and custom codes
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Prerequisites

Before running this application, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/url-shortener
PORT=3000
```

## Running the Application

### Local Development

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Standard mode
npm run start
```

The application will be available at `http://localhost:3000`

### With Docker (if Docker support is implemented)

```bash
# Build and run with Docker Compose
docker-compose up

# Run in detached mode
docker-compose up -d
```

## Deployment on Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
```
MONGODB_URI=your_mongodb_connection_string
BASE_URL=https://your-project.vercel.app
```

4. Deploy to production:
```bash
vercel --prod
```

## API Endpoints

### 1. Shorten URL
- **Endpoint**: `POST /api/shorten`
- **Description**: Creates a shortened URL
- **Request Body**:
  ```json
  {
    "url": "https://www.example.com/very-long-url",
    "customCode": "my-custom-link" // optional
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "originalUrl": "https://www.example.com/very-long-url",
    "shortUrl": "http://localhost:3000/r/abc123"
  }
  ```

### 2. Redirect to Original URL
- **Endpoint**: `GET /r/:shortCode`
- **Description**: Redirects to the original URL and increments click count
- **Response**: 302 Redirect to original URL

### 3. Get URL Statistics
- **Endpoint**: `GET /api/stats/:shortCode`
- **Description**: Retrieves statistics for a shortened URL
- **Response** (200 OK):
  ```json
  {
    "originalUrl": "https://www.example.com/very-long-url",
    "shortUrl": "http://localhost:3000/r/abc123",
    "clicks": 42
  }
  ```

## API Documentation

Interactive API documentation is available through Swagger UI:
- **URL**: `http://localhost:3000/docs`
- **Features**: Try out endpoints, view request/response schemas, and explore API capabilities

## Project Structure

```
src/
├── urls/                    # URLs module
│   ├── dto/                # Data Transfer Objects
│   ├── schemas/            # Mongoose schemas
│   ├── urls.controller.ts  # Request handlers
│   ├── urls.service.ts     # Business logic
│   └── urls.module.ts      # Module definition
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
└── ...
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Error Handling

The API implements proper error handling for common scenarios:
- **400 Bad Request**: Invalid URL format or request body
- **404 Not Found**: Short code doesn't exist
- **409 Conflict**: Custom code already in use

## Security Considerations

- Input validation for all user inputs
- URL format validation
- Custom code pattern restrictions (alphanumeric, hyphens, underscores)
- Protection against common injection attacks through Mongoose

## Performance Optimizations

- Indexed `shortCode` field for fast lookups
- Efficient click count updates using atomic operations
- Minimal database queries per request

## Future Enhancements

Potential features for future development:
- User authentication and URL ownership
- URL expiration dates
- QR code generation
- Bulk URL shortening
- Advanced analytics (referrers, geographic data)
- Rate limiting for API protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.