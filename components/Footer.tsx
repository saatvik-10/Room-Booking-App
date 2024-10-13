import React from 'react';

const Footer = () => {
  const currYear = new Date().getFullYear();

  return (
    <footer className='bg-blue-100 py-6'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <p className='text-center text-sm text-gray-800'>
          &copy; {currYear} Roomify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
