import React from 'react';
import Slider from '../components/home/Slider';
import Explanation from '../components/home/Explanation';
import SectionBoxes from '../components/home/SectionBoxes';
import './Main.css';

const HomePage = () => {
  return (
    <div>
      <Slider />
      <Explanation/>
      <SectionBoxes />
    </div>
  );
};

export default HomePage;
