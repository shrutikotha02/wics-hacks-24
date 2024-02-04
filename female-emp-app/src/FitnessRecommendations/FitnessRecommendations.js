import React, { useState, useEffect } from 'react';
import { Row, Container, Form, Button, Card, Col, Modal } from 'react-bootstrap';

import axios from 'axios';

const MenstrualCycleComponent = () => {
  const [j2, setJ2] = useState([]);
  const [jcl, setJcl] = useState([]);
  const [kins, setKins] = useState([]);
  const [phase, setPhase] = useState('');
  const [hall, setHall] = useState('');
  const [matchingPhrases, setMatchingPhrases] = useState([]);
  const [day, setDay] = useState(); // Change the default day as needed
  const [month, setMonth] = useState(2); // Make sure to set the month as needed


  const handleInputChange = (event) => {
    setPhase(event.target.value);
  };

  const handleInputChangeDay = (event) => {
    setDay(event.target.value)
    setHall('J2')
  };

  const handleInputChangeFood = () => {
    setMatchingPhrases([...matchingPhrases], [ "BBQ Grilled Today",
    "Gluten-Free Penne Pasta",
    "Yogurt Vanilla",
    "Housemade Turkey",
    "Housmade Spanish Rice",
    "Shredded Romaine",
    "Fresh Tomato Slices",
    "Chilled Brown Rice",
    "Chicken Breast Strips"]);
  };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Same food weekly - J2
        const j2Response = await axios.get('https://hf-foodpro.austin.utexas.edu/foodpro/shortmenu.aspx?sName=University+Housing+and+Dining&locationNum=12&locationName=J2+Dining&naFlag=1');
        if (j2Response.status === 200) {
          const j2Soup = new DOMParser().parseFromString(j2Response.data, 'text/html');
          const j2FoodItems = j2Soup.querySelectorAll('.shortmenurecipes');
          setJ2(Array.from(j2FoodItems).map(item => item.textContent));
        }

        // Changes daily - JCL
        const jclResponse = await axios.get(`https://hf-foodpro.austin.utexas.edu/foodpro/shortmenu.aspx?sName=University+Housing+and+Dining&locationNum=12(a)&locationName=JCL+Dining&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=${month}%2f${day}%2f2024`);
        if (jclResponse.status === 200) {
          const jclSoup = new DOMParser().parseFromString(jclResponse.data, 'text/html');
          const jclFoodItems = jclSoup.querySelectorAll('.shortmenurecipes');
          setJcl(Array.from(jclFoodItems).map(item => item.textContent));
        }

        // Same food weekly - Kins
        const kinsResponse = await axios.get('https://hf-foodpro.austin.utexas.edu/foodpro/shortmenu.aspx?sName=University+Housing+and+Dining&locationNum=03&locationName=Kins+Dining&naFlag=1');
        if (kinsResponse.status === 200) {
          const kinsSoup = new DOMParser().parseFromString(kinsResponse.data, 'text/html');
          const kinsFoodItems = kinsSoup.querySelectorAll('.shortmenurecipes');
          setKins(Array.from(kinsFoodItems).map(item => item.textContent));
        }

        // Assign stage based on day of cycle
        if (day >= 0 && day <= 7) {
          setPhase('menstrual');
        } else if (day <= 13) {
          setPhase('follicular');
        } else if (day <= 15) {
          setPhase('ovulation');
        } else {
          setPhase('luteal');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [day, month]);

  const calculateScore = (list, diningHall) => {
    let matchingPhrases = [];
    let score = 0;

    for (const item of diningHall) {
      for (const food of list) {
        if (food.toLowerCase().includes(item.toLowerCase())) {
          score += 1;
          matchingPhrases.push(item);
          break;
        }
      }
    }

    return score;
  };

  const printFoods = (phase, hall) => {
    let matchingPhrases = [];

    for (const item of hall) {
      let foodList = [];
      

      switch (phase) {
        case 'menstrual':
          foodList = menstrualList;
          break;
        case 'follicular':
          foodList = follicularList;
          break;
        case 'ovulation':
          foodList = ovulationList;
          break;
        case 'luteal':
          foodList = lutealList;
          break;
        default:
          break;
      }

      for (const food of foodList) {
        if (food.toLowerCase().includes(item.toLowerCase())) {
          matchingPhrases.push(food);
          break;
        }
      }
    }
    return matchingPhrases;
  };

  const menstrualList = ["fruit", "berry", "pepper", "broccoli", "chicken", "lentils", "bean", "cheese", "egg", "salmon", "nuts", "beef", "blueberry"];
  const follicularList = ["rice", "wheat", "bread", "pizza", "cualiflower", "cabbage", "kale", "quinoa", "avocado", "pumpkin", "kimchi"];
  const ovulationList = ["cualiflower", "cabbage", "kale", "quinoa", "avocado", "pumpkin", "kimchi"];
  const lutealList = ["potato", "chocolate", "fruit", "nuts", "broccoli", "leafy greens"];

  const calculateScoresAndPrint = () => {
    let j2Score, jclScore, kinsScore;
    let variables, idx;

    if (phase === 'menstrual') {
      j2Score = calculateScore(menstrualList, j2);
      jclScore = calculateScore(menstrualList, jcl);
      kinsScore = calculateScore(menstrualList, kins);
      variables = [j2Score, jclScore, kinsScore];
      idx = variables.indexOf(Math.max(...variables));
    }

    if (phase === 'follicular') {
      j2Score = calculateScore(follicularList, j2);
      jclScore = calculateScore(follicularList, jcl);
      kinsScore = calculateScore(follicularList, kins);
      variables = [j2Score, jclScore, kinsScore];
      idx = variables.indexOf(Math.max(...variables));
    }

    if (phase === 'ovulation') {
      j2Score = calculateScore(ovulationList, j2);
      jclScore = calculateScore(ovulationList, jcl);
      kinsScore = calculateScore(ovulationList, kins);
      variables = [j2Score, jclScore, kinsScore];
      idx = variables.indexOf(Math.max(...variables));
    }

    if (phase === 'luteal') {
      j2Score = calculateScore(lutealList, j2);
      jclScore = calculateScore(lutealList, jcl);
      kinsScore = calculateScore(lutealList, kins);
      variables = [j2Score, jclScore, kinsScore];
      idx = variables.indexOf(Math.max(...variables));
    }

    let selectedHall = '';
    if (idx === 0) {
      selectedHall = 'j2';
    } else if (idx === 1) {
      selectedHall = 'jcl';
    } else {
      selectedHall = 'kins';
    }

    setHall(selectedHall);
    setMatchingPhrases(printFoods(phase, selectedHall));
  };

  useEffect(() => {
    calculateScoresAndPrint();
  }, [j2, jcl, kins, phase]);

  return (
    <div>
      <Row className="mb-2">
      <Col>
          <Form.Control
            type="text"
            placeholder="Enter cycle stage"
            value={phase}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <Button variant="primary" onClick={handleInputChange}>
            Set Cycle Stage
          </Button>
        </Col>

        <Col>
          <Form.Control
            type="number"
            placeholder="Enter cycle day"
            value={day}
            onChange={handleInputChangeDay}
          />
        </Col>

        <Col>
          <Button variant="primary" onClick={handleInputChangeDay}>
            Set Cycle Day
          </Button>
        </Col>
      </Row>
      <Row>
      <Button variant="primary" onClick={handleInputChangeFood}>
            Get Healthy Food options
          </Button>
      </Row>
      <p>Based on your menstrual cycle, you are currently on day {day} in the {phase} phase of your period.</p>
      <p>We identified several foods that are beneficial to you in this stage of your menstrual cycle.</p>
      <p>These foods can be found at the following dining hall: {hall}.</p>
      <p>Look for the following options at {hall}!</p>
      <ul>
        {matchingPhrases.map((food, index) => (
          <li key={index}>{food}</li>
        ))}
      </ul>

    </div>
  );
};

export default MenstrualCycleComponent;
