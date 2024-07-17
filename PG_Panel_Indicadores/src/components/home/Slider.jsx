import React from 'react';
import { Carousel } from 'react-bootstrap';
import './Slider.css';

const Slider = () => {
  return (
    <Carousel className="custom-carousel">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/slider2.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Modelo para la detección de enfermedades en la caña</h3>
          <p>Con datos recogidos en campo, mostramos las enfermedades que afectan</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/slider4.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Modelo para predecir el TCH</h3>
          <p>Con datos históricos, predecimos como serán las plantaciones futuras</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/slider1.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>API para el consumo de datos</h3>
          <p>Todos los datos centralizados en una sola solución</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
