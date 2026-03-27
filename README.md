# UXSense AI Setup Requirements

The frontend application has been built and is functional! 

However, to run the **backend** server, you will need a stable Python version installed on your machine (like Python 3.11 or 3.12). 

Currently, your system is using a pre-release version of Python (3.14) which fails to install `pydantic` because it requires the Rust compiler (`cargo`) to build it from source.

## Steps to Run the Application:

### 1. Backend Setup
1. Open a new terminal.
2. Ensure you have Python 3.11 or 3.12 active in your PATH (not 3.14).
3. Navigate to the backend directory:
   `cd "c:\Users\umang\Desktop\AI websites\backend"`
4. Run: `python -m venv venv`
5. Run: `.\venv\Scripts\activate`
6. Run: `pip install -r requirements.txt`
7. Run: `playwright install chromium`
8. Copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY`.
9. Start the server: `uvicorn main:app --reload`

### 2. Frontend Setup
1. Open a new terminal.
2. Navigate to the frontend directory:
   `cd "c:\Users\umang\Desktop\AI websites\frontend"`
3. Start the frontend: `npm run dev`

You can then visit `http://localhost:3000` to use the application!
