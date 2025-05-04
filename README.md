# AWS Secure Product Management System

A secure cloud-based product management system built with AWS, demonstrating implementation of VPC architecture with public and private subnets. This project showcases the principle of least privilege in a multi-tier web application.

This project implements a secure two-tier architecture on AWS:

- **Public Tier**: EC2 instance in a public subnet running a web application
- **Private Tier**: RDS database in a private subnet for secure data storage
- **Security**: Principle of least privilege with proper network isolation

## Features

- RESTful API endpoints for product management
- Secure database access from private subnet
- Public-facing web service with restricted access
- Complete VPC network configuration with security groups

## Technical Components

- **EC2 Instance**: Hosts the web application with public access
- **RDS Database**: Stores product information securely
- **VPC**: Custom virtual network with public and private subnets
- **Security Groups**: Configured for minimal required access
- **API Endpoints**:
  - `/store-products`: Add products to the database
  - `/list-products`: Retrieve products from the database

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured with access credentials
- Basic understanding of AWS services (EC2, RDS, VPC)
- Knowledge of your chosen programming language/framework

## Setup Instructions

### 1. VPC Configuration

1. Create a VPC with CIDR block (e.g., 10.0.0.0/16)
2. Create two subnets:
   - Public subnet (e.g., 10.0.1.0/24)
   - Private subnet (e.g., 10.0.2.0/24)
3. Create and attach an Internet Gateway to the VPC
4. Configure route tables:
   - Public route table with route to Internet Gateway
   - Private route table with local routes only
5. Associate subnets with appropriate route tables

### 2. Security Group Configuration

1. EC2 Security Group:
   - Allow inbound traffic on ports 22 (SSH), 80 (HTTP), and 443 (HTTPS)
   - Allow all outbound traffic
2. RDS Security Group:
   - Allow inbound traffic on the database port (e.g., 3306 for MySQL) from the EC2 security group only
   - No direct internet access

### 3. Database Setup

1. Create an RDS instance in the private subnet
2. Select appropriate database type (Aurora recommended)
3. Configure security group access
4. Create the products table with the required schema:

```sql
CREATE TABLE products (
  name varchar(100),
  price varchar(100),
  availability boolean
)
```

### 4. EC2 Instance Setup

1. Launch an EC2 instance in the public subnet
2. Assign a public IP or Elastic IP
3. Configure the security group
4. Install required software (web server, programming language runtime, etc.)
5. Deploy your web application code

### 5. Web Application Deployment

1. Clone this repository to your local machine
2. Configure the database connection details in your application
3. Deploy the application to your EC2 instance
4. Test the endpoints with sample product data

## API Documentation

### POST /store-products

Stores products in the database.

**Request Format:**
```json
{
  "products": [
    {
      "name": "Product Name",
      "price": "Product Price",
      "availability": true
    },
    ...
  ]
}
```

**Response:**
```json
{
  "message": "Success."
}
```

### GET /list-products

Retrieves all products from the database.

**Response:**
```json
{
  "products": [
    {
      "name": "Product Name",
      "price": "Product Price",
      "availability": true
    },
    ...
  ]
}
```

## Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Store products
curl -X POST http://your-ec2-ip/store-products \
  -H "Content-Type: application/json" \
  -d '{"products":[{"name":"Test Product","price":"$19.99","availability":true}]}'

# List products
curl -X GET http://your-ec2-ip/list-products
```

## Security Considerations

- EC2 instance is only accessible via HTTP, HTTPS, and SSH
- RDS database is in a private subnet with no public access
- Database can only be accessed from the EC2 instance
- All components are within the same VPC for secure communication

## Development Notes

- Follow AWS best practices for security and performance
- Use AWS SDK for programmatic interactions with AWS services
- Consider implementing additional security measures like HTTPS, WAF, etc.
- For production use, implement proper logging, monitoring, and backup strategies

## License

[MIT License](LICENSE)

## Acknowledgments

- This project was developed as part of CSCI 4145/5409 (Cloud Computing) course
- Based on AWS best practices for secure architecture design
