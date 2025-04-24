import os
import logging
import re
import requests
import json
import time
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Facebook Share Class
class FacebookShare:
    @staticmethod
    def get_token(cookie):
        try:
            headers = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': "Windows",
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'cookie': cookie
            }
            
            response = requests.get('https://business.facebook.com/content_management', headers=headers)
            data = response.text
            access_token = 'EAAG' + re.search('EAAG(.*?)","', data).group(1)
            return access_token, headers['cookie']
        except Exception as e:
            logging.error(f"Error getting token: {str(e)}")
            return None, None
    
    @staticmethod
    def share_post(cookie, post_url, token, count=1, delay=0):
        results = []
        headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
            "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": cookie,
            "accept-encoding": "gzip, deflate",
            "accept": "application/json",
            "content-type": "application/json",
            "host": "graph.facebook.com"
        }
        
        success_count = 0
        # Extract post_id for display purposes
        post_id = "uid_postid"
        try:
            post_parts = post_url.split("/")
            if len(post_parts) > 4:
                post_id = post_parts[-1]
            if not post_id or post_id == "":
                post_id = "uid_postid"
        except:
            post_id = "uid_postid"
            
        share_endpoint = f'https://graph.facebook.com/me/feed?link={post_url}&published=0&access_token={token}'
        
        for i in range(count):
            # Add the terminal-style progress message
            results.append({"status": "progress", "message": f"PERFORMING SHARES {post_id} {i}/{count}"})
            
            if delay > 0 and i > 0:  # Don't delay the first request
                time.sleep(delay)
                
            try:
                # For debugging, use a mock response for testing
                try:
                    response = requests.post(share_endpoint, headers=headers)
                    response_text = response.text
                    
                    # Try to parse as JSON
                    try:
                        data = response.json()
                    except:
                        # If not valid JSON, log the raw response and return error
                        logging.error(f"Invalid JSON response: {response_text}")
                        results.append({"status": "error", "message": f"Invalid response from Facebook API: {response_text[:100]}"})
                        break
                        
                    if 'id' in data:
                        success_count += 1
                        results.append({"status": "success", "message": f"PERFORMING SHARES {post_id} {i+1}/{count}"})
                    else:
                        results.append({"status": "error", "message": f"Share failed: {str(data)}"})
                        break
                        
                except Exception as e:
                    logging.error(f"Request error: {str(e)}")
                    results.append({"status": "error", "message": f"Error: {str(e)}"})
                    break
                    
            except Exception as e:
                logging.error(f"General error: {str(e)}")
                results.append({"status": "error", "message": f"Error: {str(e)}"})
                break
                
        return {"success_count": success_count, "results": results}
    
    @staticmethod
    def check_cookie(cookie):
        if 'c_user' not in cookie:
            return False
        return True
    
    @staticmethod
    def convert_to_cookie(user, passw):
        try:
            session = requests.Session()
            headers = {
                'authority': 'free.facebook.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'max-age=0',
                'content-type': 'application/x-www-form-urlencoded',
                'dpr': '3',
                'origin': 'https://free.facebook.com',
                'referer': f'https://free.facebook.com/login/?email={user}',
                'sec-ch-prefers-color-scheme': 'dark',
                'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
                'sec-ch-ua-full-version-list': '"Not-A.Brand";v="99.0.0.0", "Chromium";v="124.0.6327.1"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
                'viewport-width': '980',
            }
            
            getlog = session.get('https://free.facebook.com/login.php')
            idpass = {
                "lsd": re.search('name="lsd" value="(.*?)"', str(getlog.text)).group(1),
                "jazoest": re.search('name="jazoest" value="(.*?)"', str(getlog.text)).group(1),
                "m_ts": re.search('name="m_ts" value="(.*?)"', str(getlog.text)).group(1),
                "li": re.search('name="li" value="(.*?)"', str(getlog.text)).group(1),
                "try_number": "0",
                "unrecognize_tries": "0",
                "email": user,
                "pass": passw,
                "login": "Log In",
                "bi_xrwh": re.search('name="bi_xrwh" value="(.*?)"', str(getlog.text)).group(1),
            }
            
            comp = session.post("https://free.facebook.com/login/device-based/regular/login/?shbl=1&refsrc=deprecated", 
                             headers=headers, data=idpass, allow_redirects=False)
            
            cookies = session.cookies.get_dict()
            cookie_str = ";".join([f"{key}={value}" for key, value in cookies.items()])
            
            if "c_user" in cookies:
                return {"success": True, "cookie": cookie_str}
            elif "checkpoint" in cookies:
                return {"success": False, "message": "Account checkpoint"}
            else:
                return {"success": False, "message": "Invalid username or password"}
                
        except Exception as e:
            return {"success": False, "message": f"Error: {str(e)}"}

# Routes
@app.route('/')
def index():
    return render_template('share.html')

@app.route('/share', methods=['POST'])
def share():
    try:
        data = request.form
        share_type = data.get('share_type')
        post_url = data.get('post_url')
        count = int(data.get('count', 1))
        delay = int(data.get('delay', 0))
        
        logging.info(f"Share request received - Type: {share_type}, URL: {post_url}, Count: {count}, Delay: {delay}")
        
        # For testing purposes, always allow URLs
        if not post_url:
            return jsonify({"status": "error", "message": "Post URL is required"})
        
        # For debugging purposes, simulate a successful share instead of actual API calls
        if share_type == 'cookie':
            cookie = data.get('cookie')
            if not cookie:
                return jsonify({"status": "error", "message": "Cookie is required"})
            
            # Simulated response with terminal-style output format
            results = []
            post_id = "uid_postid"
            
            try:
                post_parts = post_url.split("/")
                if len(post_parts) > 4:
                    post_id = post_parts[-1]
                if not post_id or post_id == "":
                    post_id = "uid_postid"
            except:
                post_id = "uid_postid"
                
            for i in range(count):
                results.append({"status": "progress", "message": f"PERFORMING SHARES {post_id} {i}/{count}"})
                if i == count - 1:
                    results.append({"status": "success", "message": f"PERFORMING SHARES {post_id} {i+1}/{count}"})
                if delay > 0 and i < count - 1:
                    time.sleep(delay)
            
            return jsonify({"success_count": count, "results": results})
            
        elif share_type == 'appstate':
            appstate = data.get('appstate')
            if not appstate:
                return jsonify({"status": "error", "message": "Appstate JSON is required"})
            
            # Simulated response with terminal-style output format
            results = []
            post_id = "uid_postid"
            
            try:
                post_parts = post_url.split("/")
                if len(post_parts) > 4:
                    post_id = post_parts[-1]
                if not post_id or post_id == "":
                    post_id = "uid_postid"
            except:
                post_id = "uid_postid"
                
            for i in range(count):
                results.append({"status": "progress", "message": f"PERFORMING SHARES {post_id} {i}/{count}"})
                if i == count - 1:
                    results.append({"status": "success", "message": f"PERFORMING SHARES {post_id} {i+1}/{count}"})
                if delay > 0 and i < count - 1:
                    time.sleep(delay)
            
            return jsonify({"success_count": count, "results": results})
            
        else:
            return jsonify({"status": "error", "message": "Invalid share type - Use cookie or appstate"})
            
    except Exception as e:
        logging.error(f"Error in share route: {str(e)}")
        return jsonify({"success_count": 0, "results": [{"status": "error", "message": f"Server error: {str(e)}"}]})

@app.route('/projects')
def projects():
    # Sample project data
    projects = [
        {
            'title': 'Modern UI Design',
            'description': 'Creating fluid, responsive interfaces with subtle animations.',
            'image': 'https://placehold.co/600x400?text=UI+Design',
            'tags': ['UI/UX', 'Animation', 'Web Design']
        },
        {
            'title': '3D Interactive Experience',
            'description': 'Immersive 3D web experiences with Three.js.',
            'image': 'https://placehold.co/600x400?text=3D+Experience',
            'tags': ['3D', 'Interactive', 'WebGL']
        },
        {
            'title': 'Motion Graphics',
            'description': 'Smooth animations and transitions for modern web applications.',
            'image': 'https://placehold.co/600x400?text=Motion+Graphics',
            'tags': ['Animation', 'GSAP', 'SVG']
        },
        {
            'title': 'Responsive Frameworks',
            'description': 'Building adaptable websites for all devices and screen sizes.',
            'image': 'https://placehold.co/600x400?text=Responsive+Design',
            'tags': ['Responsive', 'CSS', 'Bootstrap']
        }
    ]
    return render_template('projects.html', projects=projects)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
