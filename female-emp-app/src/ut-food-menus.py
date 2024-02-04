import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify

app = Flask(__name__)

def scrape_dining_hall_data(url, food_list):
    response = requests.get(url)
    dining_hall = []

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        food_items = soup.find_all('div', class_='shortmenurecipes')

        for item in food_items:
            dining_hall.append(item.text)

    score = calculate_score(food_list, dining_hall)
    return print_foods(food_list, dining_hall), score

def calculate_score(food_list, dining_hall):
    matching_phrases = []
    score = 0

    for item in dining_hall:
        for food in food_list:
            if food.lower() in item.lower():
                score += 1
                matching_phrases.append(item)
                break

    return score, matching_phrases

def print_foods(food_list, dining_hall):
    matching_phrases = []

    for item in dining_hall:
        for food in food_list:
            if food.lower() in item.lower():
                matching_phrases.append(item)
                break

    return matching_phrases

@app.route('/get_data', methods=['GET'])
def get_data():
    j2_url = 'https://hf-foodpro.austin.utexas.edu/foodpro/shortmenu.aspx?sName=University+Housing+and+Dining&locationNum=12&locationName=J2+Dining&naFlag=1'
    jcl_url = 'https://hf-foodpro.austin.utexas.edu/foodpro/shortmenu.aspx?sName=University+Housing+and+Dining&locationNum=12(a)&locationName=JCL+Dining&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=2%2f2%2f2024'
    kins_url = 'https://hf-foodpro.austin.utexas.edu/foodpro/shortmenu.aspx?sName=University+Housing+and+Dining&locationNum=03&locationName=Kins+Dining&naFlag=1'

    menstrual_list = ["fruit", "berry", "pepper", "broccoli", "chicken", "lentils", "bean", "cheese", "egg", "salmon", "nuts", "beef", "blueberry"]
    follicular_list = ["rice", "wheat", "bread", "pizza", "cualiflower", "cabbage", "kale", "quinoa", "avocado", "pumpkin", "kimchi"]
    ovulation_list = ["cualiflower", "cabbage", "kale", "quinoa", "avocado", "pumpkin", "kimchi"]
    luteal_list = ["potato", "chocolate", "fruit", "nuts", "broccoli", "leafy greens"]

    day = 15
    phase = ''

    if (day >= 0 and day <= 7):
        phase = 'menstrual'
    elif (day <=13):
        phase = 'follicular'
    elif (day <= 15):
        phase = 'ovulation'
    else:
        phase = 'luteal'

    j2_matching_phrases, j2_score = scrape_dining_hall_data(j2_url, menstrual_list)
    jcl_matching_phrases, jcl_score = scrape_dining_hall_data(jcl_url, menstrual_list)
    kins_matching_phrases, kins_score = scrape_dining_hall_data(kins_url, menstrual_list)

    scores = {
        "j2": j2_score,
        "jcl": jcl_score,
        "kins": kins_score
    }

    max_score_hall = max(scores, key=scores.get)

    return jsonify({
        "matching_phrases": locals()[f"{max_score_hall}_matching_phrases"],
        "hall": max_score_hall
    })

if __name__ == '__main__':
    app.run(debug=True)
