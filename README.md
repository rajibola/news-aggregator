## Running the Project with Docker

To run the project within a Docker container, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your machine.

2. Create a `.env` file in the root of your project and add your API keys:

   ```env
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_GUARDIAN_KEY=your_guardian_key
   VITE_NYTIMES_KEY=your_nytimes_key
   ```

3. Build and run the Docker container:

   ```bash
   docker-compose up --build
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.
