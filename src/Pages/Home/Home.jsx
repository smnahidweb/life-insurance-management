import React from 'react';
import Hero from '../../Components/Hero/Hero';
import PopularPolicies from './PopularPolicies/PopularPolicies';

const Home = () => {
    return (
        <div>
          <Hero></Hero>
          <PopularPolicies></PopularPolicies>
        </div>
    );
};

export default Home;