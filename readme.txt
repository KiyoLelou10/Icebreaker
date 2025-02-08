Steps to Set Up and Run the Project
	1. Install Docker Desktop
		a. Download and install the Docker Desktop application for your operating system (Windows/Mac/Linux) from Docker’s official website. Make sure Docker is running before proceeding.
	2. Set Up Docker Containers
		a. Navigate to the Docker folder in the project directory.
		b. Ensure that this folder contains a docker-compose.yml file.
		c. Open a terminal in this folder and execute the following command:
			docker-compose up --build


	3. Access the Keycloak Admin Console on http://localhost:8081
		a. Use the following login credentials to access the admin console:
			i. Username: admin
			ii.Password: admin123
	4.Import Keycloak Realm Configuration
		a. After logging in, navigate to the left sidebar and select Create Realm.
		b. In the Resource File option, upload the file realm-export-keycloak.json located in the Icebreaker/Docker directory.
	5. Run the Spring Boot Application
		a. Navigate to the ChatBackend/ChatBackend folder in the project directory.
		b. Ensure the folder contains a pom.xml file.
		c. Open a terminal in this folder and run the following command to start the backend server:
			i. mvn clean install -U (make sure java and maven are installed)
			ii. mvn spring-boot:run


	6. Run the Angular Frontend Application
		a. Navigate to the Frontend/Icebreaker folder in the project directory.There should be a package.json file here. 
		b. Install the required dependencies by executing the following command:
			i. npm install --legacy-peer-deps (make sure node.js and angular are installed)

		c. Then, start the Angular application using the command:
			a. npm start 

	7. Using the AI
		a. To use the AI please contact one of the devs, so that he can send you the weights for the model. 
		b. In the Python Code change the Path to the weights according to the path under which you downloaded our weights.
		c. Open the Terminal in the root folder of the project, make sure the folder contains an IcebreakerApi.py file
		d. run the following command: pip install flask transformers torch (make sure you have python installed)
		e. to exectute the Api run: python3 IcebreakerApi.py 

	8. Access the Application
		Open a web browser and navigate to http://localhost:4200.
		You will be prompted to log in.
	9. Login Options:
		1. Create a New Account:
			Select the Register option to create a new user account.
		2. Create a new Passphrase in accordance to the requirements
		3. After that complete your profile
		4. Congratulations you can use our website to chat with other users, be sure to break the ice
