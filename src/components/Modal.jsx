import React from 'react';

const Modal = ({ title, onClose, children }) => (
  <div className="cp-overlay" onClick={onClose}>
    <div className="cp-modal" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="cp-modal-title">{title}</h2>
        <button className="cp-modal-close" onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
