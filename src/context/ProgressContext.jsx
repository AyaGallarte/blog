import React, { createContext, useState, useContext, useCallback } from 'react';
import { Modal, ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startProgress = useCallback(() => {
    setShowModal(true);
    setProgress(0);

    const id = setInterval(() => {
      setProgress((prevProgress) => {
        // Increment progress and ensure it does not exceed 100
        const newProgress = Math.min(prevProgress + Math.random() * 10, 100);

        if (newProgress >= 100) {
          clearInterval(id);
          setShowModal(false); // Close modal when progress is 100%
        }

        return newProgress;
      });
    }, 100); // Slower interval

    setIntervalId(id);
  }, []);

  const closeModal = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setShowModal(false);
  };

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