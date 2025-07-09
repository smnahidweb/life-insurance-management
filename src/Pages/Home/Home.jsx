import React from 'react';
import Hero from '../../Components/Hero/Hero';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import BenefitsSection from './BenefitsSection';

const Home = () => {
    return (
        <div>
          <Hero></Hero>
          <PopularPolicies></PopularPolicies>
         <BenefitsSection></BenefitsSection>
        </div>
    );
};

export default Home;