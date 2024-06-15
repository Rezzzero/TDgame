import React from "react";

const Modal = ({ handleOpenHouseInfo, children, upgradeMain }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-yellow-100 p-8 rounded shadow-lg">
        {children}
        <button
          onClick={upgradeMain}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Upgrade
        </button>
        <button
          onClick={handleOpenHouseInfo}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
