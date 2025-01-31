import React from 'react';
import '../Assets/Css/SectionTitle.scss';
import bloomLeft from '../Assets/Image/bloomLeft.png' // Adjust the path as necessary
import bloomRight from '../Assets/Image/bloomRight.png'; // Adjust the path as necessary

const SectionTitle = ({ title }) => {
  return (
    <div className='section-title-component text-center '>
      <div className='d-flex justify-content-center align-items-center'>
        <h2 className="section-title-text ">{title}</h2>
      </div>
    </div>
  );
};

export default SectionTitle;