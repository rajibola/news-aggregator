# News Aggregator

## Project Overview

The News Aggregator is a web application designed to fetch and display news articles from various sources, including NewsAPI, The Guardian, and The New York Times. Built with React, TypeScript, and Tailwind CSS, this application provides users with a seamless experience to explore the latest news across different categories.

### Key Features

- **Multi-source News Fetching**: Aggregate news articles from multiple sources, allowing users to access a wide range of information.
- **Responsive Design**: The application is built with Tailwind CSS, ensuring a responsive and visually appealing interface across devices.
- **User Preferences**: Users can set their preferences for news sources and categories, enhancing their reading experience.
- **Data Fetching with React Query**: Utilize React Query for efficient data fetching, caching, and synchronization, improving the overall performance and user experience.
- **Docker Support**: The project can be easily run in a Docker container, simplifying the setup process for development and deployment.

### Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Data Management**: React Query for data fetching and state management
- **Backend**: Axios for API calls
- **Development Tools**: Vite for fast development and build processes, Bun for package management

## Running the Project with Docker

To run the project within a Docker container, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your machine.

2. Start Docker on your machine.

3. Create a `.env` file in the root of your project and add your API keys:

   ```env
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_GUARDIAN_KEY=your_guardian_key
   VITE_NYTIMES_KEY=your_nytimes_key
   ```

4. Build and run the Docker container:

   ```bash
   docker compose up --build
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.

## Running the Project without Docker

To run the project without Docker, follow these steps:

1. Ensure you have Node.js and Bun installed on your machine.

2. Install the project dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file in the root of your project and add your API keys (same as above):

   ```env
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_GUARDIAN_KEY=your_guardian_key
   VITE_NYTIMES_KEY=your_nytimes_key
   ```

4. Start the application:

   ```bash
   bun dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.
