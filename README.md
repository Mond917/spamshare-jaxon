# SpamShare

Automated Facebook post sharing tool with a retro cyberpunk UI.

## Features

- Share Facebook posts using Cookie or Appstate authentication
- Terminal-style console output
- Cyberpunk/retro box aesthetic
- Progress indicators and status tracking

## Deploy on Render

This app is ready to be deployed on Render's free tier service.

1. Fork this repository
2. Connect to Render
3. Create a new Web Service using this repo
4. Use the following settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT --reuse-port main:app`

## Environment Variables

Add these environment variables in your Render dashboard:
- `SESSION_SECRET`: A random string for Flask's session security

## License

For educational purposes only.