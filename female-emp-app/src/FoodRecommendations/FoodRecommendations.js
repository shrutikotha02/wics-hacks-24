// client/src/FoodRecommendations.js
import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';

const FoodRecommendations = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [cycleStage, setCycleStage] = useState('');



  const handleInputChange = (event) => {
    setNewIngredient(event.target.value);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient('');
  };

  const handleInputChangeStage = (e) => {
    setCycleStage(e.target.value);
    console.log(cycleStage);
  };

  const handleSetCycleStage = () => {
    // Optionally, you can perform any additional logic before setting the cycle stage
    console.log(`Setting cycle stage: ${cycleStage}`);
  };

  const handleGetRecipes = async () => {
    const apiKey = '';
    const ingredientList = ingredients.join(',');

    try {

      var apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&apiKey=${apiKey}`;
      console.log(apiUrl)
      if (cycleStage == '1') {
        var ingredientsList = 'salmon,sardine,anchovies,trout,tuna,chia,edamame,spinach,almonds,cashew,quinoa,broccoli';
        apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsList}&apiKey=${apiKey}`;
      } else if (cycleStage == '2') {
        const antiInflammatoryIngredients = 'turmeric,ginger,blueberries,leafy greens,fish,apple'; 
        apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${antiInflammatoryIngredients}&apiKey=${apiKey}`;
      } else if (cycleStage == '3') {
        const healthySweetIngredients = 'berries,bananas,dark chocolate,almonds,honey,apples,pears,grapes,kiwi,mango'; 
        apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${healthySweetIngredients}&apiKey=${apiKey}`;
      } else if (cycleStage == '4') {
        const nutrients = 'salmon,mackerel,sardine,herring,anchovies,trout,tuna,chia,edamame,spinach,kale,almonds,cashew,quinoa,oats,broccoli'; 
        apiUrl = `https://api.spoonacular.com/recipes/findByIngredients/findByIngredients?apiKey=${apiKey}&ingredients=${nutrients}`;
      }
      

      const response = await fetch(
       apiUrl
      );
  

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.error('Error fetching recipes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCardClick = async (recipe) => {
    // Fetch detailed information for the selected recipe, including instructions and steps
    const apiKey = 'f60565dbe3624a22b2d8aaaf8d2004e9';
  
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
      );
  
      if (response.ok) {
        const data = await response.json();
        setSelectedRecipe(data);
        setShowModal(true);
      } else {
        console.error('Error fetching recipe details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };



  return (
    <Container className="mt-3">
      <h2>Food Recommendations</h2>
      <>Enter ingredients in your pantry for convenient recipes or enter your cycle phase (from main page) in for nutritious meals!</> 

      <> 
      <li>phase 1 = Menstrual phase</li>
      <li>phase 2 = Follicular phase</li>
      <li> phase 3 = Ovulation phase </li>
      <li> phase 4 = Luteal phase </li>
      <p></p>
      </>

      <Row className="mb-2">
        <Col>
          <Form.Control
            type="text"
            placeholder="Enter ingredient"
            value={newIngredient}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <Button variant="primary" onClick={handleAddIngredient}>
            Add
          </Button>
        </Col>
        <Col>
          <Form.Control
            type="number"
            placeholder="Enter cycle phase"
            value={cycleStage}
            onChange={handleInputChangeStage}
          />
        </Col>
        <Col>
          <Button variant="primary" onClick={handleSetCycleStage}>
            Set Cycle Stage
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={handleGetRecipes}>
            Get Recipes
          </Button>
        </Col>
      </Row>

      <hr />

      <h3>Ingredients:</h3>
      <Row>
        {ingredients.map((ingredient, index) => (
          <Col key={index} sm={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{ingredient}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <hr />

      <h3>Recipes:</h3>

      <Row>
        {recipes.map((recipe) => (
          <Col key={recipe.id} sm={4} className="mb-3">
            <Card onClick={() => handleCardClick(recipe)}>
            <Card.Img variant="top" src={recipe.image} />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <img src={selectedRecipe?.image} alt={selectedRecipe?.title} className="img-fluid mb-3" />
        <p>{selectedRecipe?.instructions}</p>
          {selectedRecipe?.analyzedInstructions && selectedRecipe?.analyzedInstructions.length > 0 && (
        <div>
        <h5>Steps:</h5>
        <ol>
        {selectedRecipe?.analyzedInstructions[0].steps.map((step, index) => (
          <li key={index}>{step.step}</li>
        ))}
      </ol>
    </div>
  )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default FoodRecommendations;
