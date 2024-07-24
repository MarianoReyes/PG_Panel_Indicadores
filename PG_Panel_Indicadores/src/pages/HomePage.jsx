import React from 'react';
import Slider from '../components/home/Slider';
import Explanation from '../components/home/Explanation';
import SectionBoxes from '../components/home/SectionBoxes';
import './Main.css';

const HomePage = () => {
  const slides = [
    {
      image: '/slider2.jpg',
      title: 'Modelo para la detección de enfermedades en la caña',
      description: 'Con datos recogidos en campo, mostramos las enfermedades que afectan'
    },
    {
      image: '/slider4.jpg',
      title: 'Modelo para predecir el TCH',
      description: 'Con datos históricos, predecimos como serán las plantaciones futuras'
    },
    {
      image: '/slider1.jpg',
      title: 'API para el consumo de datos',
      description: 'Todos los datos centralizados en una sola solución'
    }
  ];

  return (
    <div>
      <Slider slides={slides} />
      <Explanation />
      <SectionBoxes />
    </div>
  );
};

export default HomePage;
