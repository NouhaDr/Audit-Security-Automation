1. Run the Database
- Install Docker
- Navigate to the project folder: cd /audit_app
- Run the database using Docker Compose: docker-compose up -d
2. Run the Backend Server
- Setup Environment File
- Create a .env file in the /audit_app/back directory.
- Copy the contents from /project_folder/back/.env-exemple and paste them into the newly created .env file.
- Configure the Environment File

- Replace the necessary configurations in the .env file (e.g., CONNECTION_STRING, PORT, etc.).
- Prepare Static Files : Create a /static/images folder under audit_app/src/.
- Ensure you are in the /project_folder/back directory.
- Run npm install to install dependencies.
3. Run the Frontend
- Install Angular
- Ensure Angular CLI is installed on your machine.
- Navigate to the frontend folder: cd /project_folder/front
- Install frontend dependencies with npm install --legacy-peers-deps.
- Start the Frontend Server with: ng s
