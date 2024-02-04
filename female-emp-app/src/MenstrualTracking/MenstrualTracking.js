import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './MenstrualTracking.css';



const MenstrualTracking = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [averageCycleLength, setAverageCycleLength] = useState('');
  const [averagePeriodLength, setAveragePeriodLength] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handlePrediction = () => {
    try {
      const averagePeriodLengthValue = parseFloat(averagePeriodLength);

      if (isNaN(averagePeriodLengthValue) || averagePeriodLengthValue <= 0) {
        throw new Error('enter valid average period length.');
      }

      const currentDate = new Date();
      const currentDay = currentDate.getDate();

      const prediction = predictMenstrualCycle(lastPeriodDate, currentDay, averageCycleLength, averagePeriodLengthValue);
      setPrediction(prediction);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed fetch prediction');
      setPrediction(null);
    }
  };

  const predictMenstrualCycle = (lastPeriodDate, currentDay, averageCycleLength, averagePeriodLength) => {
    const lastPeriod = new Date(lastPeriodDate);

    const daysSinceLastPeriodStart = Math.floor((new Date() - lastPeriod) / (24 * 60 * 60 * 1000)) - 1;

    const dayOfCycle = (daysSinceLastPeriodStart % averageCycleLength) + 1; 

    let phase;
    if (dayOfCycle <= 7) {
      phase = 'Menstrual phase';
    } else if (dayOfCycle <= 13) {
      phase = 'Follicular phase';
    } else if (dayOfCycle <= 15) {
      phase = 'Ovulation phase';
    } else {
      phase = 'Luteal phase';
    }

    if (dayOfCycle <= averagePeriodLength) {
      return {
        onPeriod: true,
        dayOfCycle,
        phase,
      };
    }

    const daysRemainingInCycle = averageCycleLength - dayOfCycle;

    const nextPeriodStartDate = new Date(lastPeriod.getTime() + ((daysRemainingInCycle + averagePeriodLength) * 24 * 60 * 60 * 1000));

    const predictedCycleLength = averageCycleLength;

    return {
      onPeriod: false,
      dayOfCycle,
      phase,
      predictedCycleLength,
      nextPeriodStartDate: nextPeriodStartDate.toISOString().split('T')[0], 
    };
  };

  const getFitnessRecommendations = (phase) => {
    switch (phase) {
      case 'Menstrual phase':
        return "During the menstrual phase, focus on low-intensity activities such as walking, stretching, or Pilates. You may not feel like exercising much, and that's okay.";

      case 'Follicular phase':
        return "As your energy levels increase in the follicular phase, start incorporating cardio-based workouts like running, swimming, or group fitness classes.";

      case 'Ovulation phase':
        return "Take advantage of your peak energy levels during the ovulation phase with high-intensity workouts such as boot camp, kickboxing, or spinning.";

      case 'Luteal phase':
        return "Opt for medium-intensity cardio and strength training during the luteal phase. Slow down your pace as you approach your period.";

      default:
        return "Listen to your body and adjust your workouts based on how you feel.";
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h2>Track/Predict Menstrual Cycle</h2>
          <Form>
            <Form.Group controlId="lastPeriodDate">
              <Form.Label>Last Period Date</Form.Label>
              <Form.Control
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="averageCycleLength">
              <Form.Label>Average Cycle Length (in days)</Form.Label>
              <Form.Control
                  type="number"
                  value={averageCycleLength}
                  onChange={(e) => setAverageCycleLength(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="averagePeriodLength">
                <Form.Label>Average Period Length (in days)</Form.Label>
                <Form.Control
                  type="number"
                  value={averagePeriodLength}
                  onChange={(e) => setAveragePeriodLength(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" onClick={handlePrediction}>
                Predict Menstrual Cycle
              </Button>
            </Form>

            {prediction && (
              <div className="mt-3">
                {prediction.onPeriod ? (
                  <Alert variant="info">
                    <p>You are on day {prediction.dayOfCycle} of your period.</p>
                    <p>Phase: {prediction.phase}</p>
                    <p>Fitness Recommendation: {getFitnessRecommendations(prediction.phase)}</p>
                  </Alert>
                ) : (
                  <Alert variant="success">
                    <p>You are on day {prediction.dayOfCycle} of your cycle.</p>
                    <p>Phase: {prediction.phase}</p>
                    <p>Next Period Start Date: {prediction.nextPeriodStartDate}</p>
                    <p>Fitness Recommendation: {getFitnessRecommendations(prediction.phase)}</p>
                  </Alert>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  };

  export default MenstrualTracking;
