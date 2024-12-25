import React from 'react';

const CategoryScreen = ({ data, setData, nextStep }) => {
  const handleSelection = (type) => {
    setData({
      ...data,
      isEcommerce: type === 'Ecommerce' ? !data.isEcommerce : data.isEcommerce,
      isService: type === 'Service' ? !data.isService : data.isService,
    });
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <p className="text-lg mb-5 text-gray-800 text-center">Are you interested in Ecommerce, Service, or both?</p>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {/* Ecommerce Card */}
        <div
          onClick={() => handleSelection('Ecommerce')}
          className={`cursor-pointer w-60 h-72 p-4 flex flex-col items-center justify-center rounded-lg shadow-md transition-transform transform hover:scale-105 ${
            data.isEcommerce ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          <img
            src="/ecommerce.png"
            alt="Ecommerce"
            className="w-40 h-40 mb-4"
          />
          <h3 className="text-xl font-medium">Ecommerce</h3>
          <p className="mt-1 text-sm text-center text-gray-600">
            Sell your products online.
          </p>
        </div>

        {/* Service Card */}
        <div
          onClick={() => handleSelection('Service')}
          className={`cursor-pointer w-60 h-72 p-4 flex flex-col items-center justify-center rounded-lg shadow-md transition-transform transform hover:scale-105 ${
            data.isService ? 'bg-green-500 text-white' : 'bg-white'
          }`}
        >
          <img
            src="/service.png"
            alt="Service"
            className="w-40 h-40 mb-4"
          />
          <h3 className="text-xl font-medium">Service</h3>
          <p className="mt-1 text-sm text-center text-gray-600">
            Offer your services to clients.
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className={`ms-auto px-6 py-2 sm:mt-0 mt-5 text-white text-lg rounded-md 
            ${!data.isEcommerce && !data.isService ? 'bg-baw-baw-g4' : 'bg-baw-baw-g3 hover:bg-baw-baw-g5'}`}
        disabled={!data.isEcommerce && !data.isService}
        >
        Next
      </button>
    </div>
  );
};

export default CategoryScreen;
