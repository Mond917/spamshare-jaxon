import os, random, string, uuid, re
import requests, httpx
from bs4 import BeautifulSoup

def get_cookie(user, passw):
    session = requests.Session()
    headers = {
        'user-agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
    }

    getlog = session.get(f'https://m.facebook.com/login/device-based/password/?uid={user}&flow=login_no_pin')
    idpass = {
        "lsd": re.search('name="lsd" value="(.*?)"', str(getlog.text)).group(1),
        "jazoest": re.search('name="jazoest" value="(.*?)"', str(getlog.text)).group(1),
        "uid": user,
        "next": "https://m.facebook.com/login/save-device/",
        "flow": "login_no_pin",
        "pass": passw,
    }

    login = session.post("https://m.facebook.com/login/device-based/regular/login/?shbl=1", headers=headers, data=idpass, allow_redirects=False)
    cookies = session.cookies.get_dict()
    if "c_user" in cookies:
        cookie_str = ";".join([f"{k}={v}" for k, v in cookies.items()])
        sb = f"sb={''.join(random.choices(string.ascii_letters + string.digits + '_', k=24))};"
        return f"{sb}{cookie_str}"
    else:
        return None

# Example usage if run directly
if __name__ == "__main__":
    user = input("Enter Facebook ID/Email: ")
    passw = input("Enter Password: ")
    cookie = get_cookie(user, passw)
    if cookie:
        print("SUCCESS! Cookie generated:")
        print(cookie)
    else:
        print("Login failed or checkpointed.")