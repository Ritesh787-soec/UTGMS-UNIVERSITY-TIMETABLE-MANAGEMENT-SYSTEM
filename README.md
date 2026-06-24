UTGMS - University Timetable Management System
This project is a University Timetable Management System built with Spring Boot and PostgreSQL.

Prerequisites
Java Development Kit (JDK) 17 or higher

Docker Desktop installed and running on your machine

Getting Started
To run this project locally, follow these steps:

Clone the repository:

Bash
git clone <your-repository-url>
cd project

2. **Start the database:**
   This project uses Docker Compose to manage the PostgreSQL database. Run the following command:
   ```bash
   docker-compose up -d
Run the application:
Use the Maven wrapper to start the Spring Boot application:

./mvnw spring-boot:run


## Database Management
* You can access the database using the credentials defined in `docker-compose.yml`.
* Use [pgAdmin](https://www.pgadmin.org/) or any SQL client to connect to `localhost:5432`.

---

### How to update it:
1. In **VS Code**, open the `README.md` file in the root folder of your project.
2. Paste the content above.
3. Replace `<your-repository-url>` with your actual Git link.
4. Save the file.
5. Commit the changes:
   ```bash
   git add README.md
   git commit -m "Docs: Update README with Docker setup instructions"
   git push origin main