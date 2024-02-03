// client/src/FoodRecommendations.js
import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';

const FoodRecommendations = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);




  const handleInputChange = (event) => {
    setNewIngredient(event.target.value);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient('');
  };

  const handleGetRecipes = async () => {
    const apiKey = 'f60565dbe3624a22b2d8aaaf8d2004e9';
    const ingredientList = ingredients.join(',');

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&apiKey=${apiKey}`
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
