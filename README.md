# Diet analyzer app

This is a diet analyzer application developed as part of the Agile Development course at the Stevens Institute of Technology.
This app was developed by team 3 (Thomas Kain, Kyle Savino, Ishaan Siwach, Jason Scheckner, & Gursimran Vasir).

# Setup instructions

1. Install Node.js from https://nodejs.org/en/download/
2. Install Ollama from https://ollama.com/download
3. Open a terminal (Command Prompt on Windows, Terminal on MacOS/Linux), and run these two commands:
  a. `llama pull llama3.2:1b`
  b. `llama pull llava`
  (This will download 5-6GB total and may take 5-10 minutes depending on your internet speed)
4. Start the Ollama service:
  a. Windows: Ollama should run automatically
  b. MacOS/Linux: Run `ollama serve` in a terminal
5. Install project dependencies: run `npm install` in the project directory
6. Run the app: run `npm run dev:all` in the project directory
7. Open http://localhost:3175 (or whatever link Vite may print) in your browser
