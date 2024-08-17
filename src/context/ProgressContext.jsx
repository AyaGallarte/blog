import React, { createContext, useState, useContext } from 'react';
import { Modal, ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const startProgress = () => {
    setShowModal(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 500);
  };

  const closeModal = () => setShowModal(false);

  return (
    <ProgressContext.Provider value={{ progress, showModal, startProgress, closeModal }}>
      {children}

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header className="progress-bar-header">
          <Modal.Title>Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body className="progress-bar-body">
          <BootstrapProgressBar now={progress} label={`${progress}%`} animated striped />
        </Modal.Body>
      </Modal>
    </ProgressContext.Provider>
  );
}

// import React, { createContext, useState, useContext } from 'react';

// const ProgressContext = createContext();

// export const useProgress = () => useContext(ProgressContext);

// export const ProgressProvider = ({ children }) => {
//     const [progress, setProgress] = useState(0);
//     const [show, setShow] = useState(false);
//     let progressInterval = null;

//     const startProgress = () => {
//         setProgress(0);
//         setShow(true);
        
//         progressInterval = setInterval(() => {
//             setProgress(prev => {
//                 if (prev >= 100) {
//                     clearInterval(progressInterval);
//                     return 100;
//                 }
//                 return prev + 10;
//             });
//         }, 500); // Adjust the interval timing as needed
//     };

//     const closeModal = () => {
//         clearInterval(progressInterval);
//         setShow(false);
//     };

//     return (
//         <ProgressContext.Provider value={{ progress, show, startProgress, closeModal }}>
//             {children}
//         </ProgressContext.Provider>
//     );
// };
