import React from 'react';
import Hero from '../../Components/Hero/Hero';
import PopularPolicies from './PopularPolicies/PopularPolicies';
import BenefitsSection from './BenefitsSection';
import CustomerReviews from './CustomerReviews';

const Home = () => {
    return (
        <div>
          <Hero></Hero>
          <PopularPolicies></PopularPolicies>
         <BenefitsSection></BenefitsSection>
         <CustomerReviews></CustomerReviews>
        </div>
    );
};

export default Home;