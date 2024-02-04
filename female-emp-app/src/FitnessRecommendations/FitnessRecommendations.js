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
  const [selectedFoodNames, setSelectedFoodNames] = useState([]);

  const [day, setDay] = useState(); 
  const [month, setMonth] = useState(2); 

  const handleInputChange = (event) => {
    setPhase(event.target.value);
  };

  const handleInputChangeDay = (event) => {
    setDay(event.target.value)
    setHall('J2')
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
    console.log(matchingPhrases)
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
      selectedHall = 'JCL';
    } else {
      selectedHall = 'Kinsolving';
    }

    setHall(selectedHall);
    setMatchingPhrases(printFoods(phase, selectedHall));
  };




  const DiningHallCard = ({ name, image, description }) => {
    return (
      <Col md={4} className="mb-4">
        <Card>
          <div className="card-img-top-custom">
            <Card.Img variant="top" src={image} alt={`${name} Image`} />
          </div>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <a href="https://hf-foodpro.austin.utexas.edu/foodpro/location.aspx" className="btn btn-primary">Explore Menu</a>
          </Card.Body>
        </Card>
      </Col>
    );
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
      <Row>
      <Button variant="primary" onClick={handleInputChangeDay}>
            Get Healthy Food options
          </Button>
      </Row>
      </Row>
      
      <p>Based on your menstrual cycle, you are currently on day {day} in the {phase} phase of your period.</p>
      <p>We identified several foods that are beneficial to you in this stage of your menstrual cycle.</p>
      <p>These foods can be found at the following dining hall: {hall}.</p>
      <p>Look for the following options:</p>
      <ul>

      <div className="container mt-4 text-center">
      <div className="card custom-card">
        <div className="card-body">
          <h5 className="card-title font-weight-bold">{hall}</h5>
        </div>
      </div>
    </div>
     
        
      <div className="container mt-4">
      </div>
        {matchingPhrases.map((food, index) => (
          <li key={index}>{food}</li>
        ))}
      </ul>
      <div className="container mt-4">
        <h5>Food Options:</h5>
        <ul>
          {selectedFoodNames.map((food, index) => (
            <li key={index}>{food}</li>
          ))}
        </ul>
      </div>
        
      <Row>
      <DiningHallCard
        name="J2 Dining"
        image="/j2.jpg"
        description="Baked Potato Bar, Salad Bar, Vegan Line, Texas Grill, Pizza, Breakfasts, Desserts 
        Monday - Thursday:	7:00 a.m. - 9:00 p.m
        Friday:	7:00 a.m.   -   8:00 p.m
        Saturday - Sunday:	9:00 a.m. - 2:00 p.m., 4:30 p.m. - 8:00 p.m."
   
      />

      <DiningHallCard
        name="JCL"
        image="/jcl.jpg"
        description="Wok, Comfort Line, Vegan Line, Deli, Grill, Salad Bar, Soups/Breads, Fresh Fruit
        Monday - Thursday:	10:30 a.m. - 9:00 p.m.	
        Friday:	10:30 a.m. - 3:00 p.m.	
        Saturday - Sunday:		Closed"
      />

      <DiningHallCard
        name="Kinsolving"
        image="/kins.jpg"
        description="Chef's features, plant-powered, Grill Line, Soup, Bakery, Yogurt Bar, Salad Bar, Pizza
Monday - Thursday:	7:00 a.m. - 9:00 p.m.	
Friday:	7:00 a.m. - 8:00 p.m.	
Saturday - Sunday:	9:00 a.m. - 2:00 p.m., 4:30 p.m. - 8:00 p.m"
      />
      </Row>
  

    </div>
  );
};

export default MenstrualCycleComponent;
