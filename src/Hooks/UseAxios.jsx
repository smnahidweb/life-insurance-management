import axios from 'axios';
import React from 'react';
const AxiosInstant = axios.create({


    baseURL:`http://localhost:5000`

})

const UseAxios = () => {
    return AxiosInstant;
};

export default UseAxios;