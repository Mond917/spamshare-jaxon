import os
import logging
from flask import Flask, render_template, request, redirect, url_for

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Routes
@app.route('/')
def index():
    return render_template('index.html')

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
