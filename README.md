# ZyberTrain Docker Setup Guide

This guide will help you get the ZyberTrain application up and running on your computer. Don't worry if you're new to this - we'll walk you through each step!

## Prerequisites

1. **Docker Desktop**
   - Download and install Docker Desktop for your operating system:
     - [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
     - [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - After installation, start Docker Desktop and wait for it to finish loading (you'll see a green "Running" status)

2. **OpenAI API Key**
   - Sign up for an OpenAI account at [OpenAI's website](https://platform.openai.com/signup)
   - Once logged in, go to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy your API key (it starts with "sk-") - you'll need this later!

## Setup Instructions

### Step 1: Configure Your API Key
1. Find the `.env` file in the main folder
2. Open it with any text editor (like Notepad or Visual Studio Code)
3. Find the line that starts with `OPENAI_API_KEY=`
4. Replace the existing key with your OpenAI API key
5. Save and close the file

### Step 2: Start the Application

#### For Windows Users:
1. Double-click the `run-docker.bat` file
   - For detailed output, open Command Prompt and run: `run-docker.bat -v`

#### For Mac Users:
1. Open Terminal
2. Navigate to the folder containing these files
3. Run:
   ```bash
   bash ./run-docker.sh
   ```
   - For detailed output, add `-v`: `bash ./run-docker.sh -v`

### Step 3: Using the Application
- The application will start automatically
- Open your web browser and go to: [http://localhost:3492](http://localhost:3492)
- Once you see the "ZyberTrain" logo, you're ready to start using the application
- We recommend using Chrome for a better user experience
- We also recommend using the "Sign in with GitHub" or "Sign in with LinkedIn" buttons to seamlessly log in
- To stop the application:
  - Windows: Press `Ctrl+C` in the command window
  - Mac: Press `Control+C` in the Terminal

## Troubleshooting

### Common Issues:

1. **"Docker Desktop is not running"**
   - Make sure Docker Desktop is open and fully loaded (green "Running" status)
   - Try restarting Docker Desktop

2. **"Invalid API key"**
   - Double-check your OpenAI API key in the `.env` file
   - Make sure there are no extra spaces before or after the key
   - Verify your OpenAI account has billing set up

3. **"Permission denied" (Mac only)**
   - Try using the `bash` command: `bash ./run-docker.sh`
   - If still having issues, try: `sudo bash ./run-docker.sh`

### Need More Help?
- For detailed logs, run the script with the verbose flag (-v)
- Check Docker Desktop's dashboard for container status
- Contact support with any error messages you see

## Additional Information

- The application runs in "quiet mode" by default (minimal output)
- Use `-v` or `--verbose` flag for detailed output
- When you stop the application, it automatically cleans up all Docker resources

## Security Note
- Never share your `.env` file or OpenAI API key with anyone
- Don't commit the `.env` file to version control
- If you accidentally expose your API key, immediately rotate it on OpenAI's website
