// import React, { useState, useEffect } from 'react';

// const ProgressBar = ({ progress }) => {
//   return (
//     <div>
//         <span>{`${progress}%`}</span>
//     </div>
//   );
// };

// export default ProgressBar;


import React from 'react';

const ProgressBar = ({ progress }) => {
  // const containerStyles = {
  //   height: '30px',
  //   width: '100%',
  //   backgroundColor: '#e0e0de',
  //   borderRadius: '5px',
  //   margin: '50px 0',
  // };

  // const fillerStyles = {
  //   height: '100%',
  //   width: `${progress}%`,
  //   backgroundColor: 'green',
  //   borderRadius: 'inherit',
  //   textAlign: 'right',
  //   transition: 'width 1s ease-in-out',
  // };

  // const labelStyles = {
  //   padding: '5px',
  //   color: 'white',
  //   fontWeight: 'bold',
  // };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${progress}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
