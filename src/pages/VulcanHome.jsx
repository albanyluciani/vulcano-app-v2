import React from 'react';
import NavbarPpal from '../components/NavbarPpal';
import VulcanoMain from '../components/VulcanoMain';
import VulcanoCarousel from '../components/VulcanoCarousel';

const VulcanoHome = () => {
  return (
    <div className="vh-container">
      <NavbarPpal />
      <VulcanoMain />
      <VulcanoCarousel />
    </div>
  );
};

export default VulcanoHome;