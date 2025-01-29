'use client';
import React from 'react';
import { motion } from 'framer-motion';

const withScrollAnimation = (WrappedComponent, { delay = 0 } = {}) => {
  return (props) => {
    const containerVariants = {
      hidden: { 
        opacity: 0,
        y: 30,
        transition: {
          duration: 0.5,
          ease: [0.215, 0.610, 0.355, 1.000]
        }
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.215, 0.610, 0.355, 1.000],
          delay: delay * 0.5
        }
      }
    };

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: "-50px 0px", amount: 0.35, once: false }}
        variants={containerVariants}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };
};

export default withScrollAnimation;