To address Deliverable 1 for your group project, follow this structured approach to design, develop, and document your AWS infrastructure and RDS database. Below is a concise, organized plan with key steps and considerations:

---

### **Deliverable 1: Basic Cloud Infrastructure and Database Setup**

#### **1. Infrastructure Design**
- **VPC Architecture**:
  - **CIDR Block**: `10.0.0.0/16`.
  - **Subnets**:
    - **Public Subnets**: 2 subnets (e.g., `10.0.1.0/24` in `us-east-1a`, `10.0.2.0/24` in `us-east-1b`) for EC2 instances.
    - **Private Subnets**: 2 subnets (e.g., `10.0.3.0/24` in `us-east-1a`, `10.0.4.0/24` in `us-east-1b`) for RDS.
  - **Route Tables**:
    - **Public Route Table**: Directs `0.0.0.0/0` traffic to an Internet Gateway (IGW).
    - **Private Route Table**: Directs `0.0.0.0/0` traffic to a NAT Gateway (placed in a public subnet).
  - **High Availability**: Subnets and RDS span two Availability Zones (AZs).

#### **2. AWS Resource Setup**
1. **Create VPC**:
   - Name: `GroupX_VPC` (replace X with your group number).
   - CIDR: `10.0.0.0/16`.

2. **Create Subnets**:
   - Public Subnets: `GroupX_PublicSubnet_1a`, `GroupX_PublicSubnet_1b`.
   - Private Subnets: `GroupX_PrivateSubnet_1a`, `GroupX_PrivateSubnet_1b`.

3. **Internet Gateway (IGW)**:
   - Name: `GroupX_IGW`.
   - Attach to the VPC.

4. **NAT Gateway**:
   - Place in `GroupX_PublicSubnet_1a`.
   - Allocate an Elastic IP: `GroupX_NAT_EIP`.
   - Name: `GroupX_NAT`.

5. **Route Tables**:
   - **Public Route Table**: `GroupX_PublicRT` with route `0.0.0.0/0 → IGW`.
   - **Private Route Table**: `GroupX_PrivateRT` with route `0.0.0.0/0 → NAT Gateway`.
   - Associate subnets accordingly.

6. **Security Groups**:
   - **EC2 Security Group** (`GroupX_EC2_SG`):
     - Inbound: SSH (port 22) from your IP, HTTP (80), HTTPS (443).
     - Outbound: Allow all.
   - **RDS Security Group** (`GroupX_RDS_SG`):
     - Inbound: MySQL (3306) from `GroupX_EC2_SG`.

7. **Launch EC2 Instance**:
   - Name: `GroupX_WebServer`.
   - Subnet: `GroupX_PublicSubnet_1a`.
   - Security Group: `GroupX_EC2_SG`.
   - Install MySQL client post-launch:
     ```bash
     sudo apt update && sudo apt install mysql-client -y
     ```

8. **Create RDS Database**:
   - **Engine**: MySQL with Multi-AZ deployment for redundancy.
   - **Subnet Group**: `GroupX_RDS_SubnetGroup` (include private subnets).
   - **Instance Name**: `GroupX_RDS_MySQL`.
   - **Security Group**: `GroupX_RDS_SG`.
   - **Credentials**: Save master username/password securely.

#### **3. Testing Connectivity**
- **From EC2 to RDS**:
  ```bash
  mysql -h <RDS_ENDPOINT> -u <MASTER_USER> -p
  ```
  - Success confirms the database is accessible.

#### **4. Documentation & Report Structure**
- **Sections**:
  1. **Introduction**: Overview of D1 objectives.
  2. **Design**: Diagram of VPC, subnets, route tables, and security groups.
  3. **Development Steps**:
     - Screenshots of AWS console for VPC, subnets, IGW, NAT Gateway, route tables, EC2, RDS, and security groups.
     - Code snippets (e.g., MySQL connection test).
  4. **Testing**: Evidence of EC2-to-RDS connectivity.
  5. **Conclusion**: Readiness for D2 and lessons learned.

- **Naming Convention**: Ensure all resources include `GroupX` (e.g., `Group3_WebServer`).

#### **5. Key Considerations**
- **Cost Optimization**: Use `t3.micro` instances for EC2/RDS (free tier eligible).
- **Security**: Restrict SSH access to your IP; avoid exposing RDS publicly.
- **High Availability**: Multi-AZ RDS and subnets across AZs.

---

This plan ensures compliance with AWS best practices, project requirements, and sets a foundation for Deliverable 2. Focus on clear documentation with screenshots and logical explanations to demonstrate your infrastructure’s design and functionality.