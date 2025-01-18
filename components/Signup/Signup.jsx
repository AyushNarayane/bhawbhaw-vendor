"use client";
import BusinessDetails from '@/components/BusinessDetails';
import PersonalDetails from '@/components/PersonalDetails';
import DocumentUpload from '@/components/DocumentUpload';
import BankDetailsForm from '@/components/BankDetailsForm';
import React, { useState, useEffect } from 'react';
import { AiOutlineCheck, AiOutlineRight, AiOutlineDown } from 'react-icons/ai';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/navigation";
import CategoryScreen from '@/components/CategoryScreen';
import { db, auth } from '@/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const MultiStepForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState('');
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    personalDetails: {
      name: '',
      email: '',
      phoneNumber: '',
      isEcommerce: false,
      isService: false,
    },
    businessDetails: {},
    bankDetails: {},
    documentUpload: {}
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    setUserId('VID' + Math.floor(Date.now() / 1000));
  }, []);

  const nextStep = () => {
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
    setIsLoading(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsLoading(false);
    }, 500);
  };

  const prevStep = () => {
    setIsLoading(true); // Set loading to true when going back
    setTimeout(() => {
      setStep(step - 1);
      setIsLoading(false); // Reset loading after delay
    }, 500); // Simulate loading delay
  };

  const handleFinalSubmit = async () => {
    const isFormDataComplete =
      formData.personalDetails && Object.keys(formData.personalDetails).length > 0 &&
      formData.businessDetails && Object.keys(formData.businessDetails).length > 0 &&
      formData.bankDetails && Object.keys(formData.bankDetails).length > 0 &&
      formData.documentUpload && Object.keys(formData.documentUpload).length > 0;

    if (!isFormDataComplete) {
      toast.error('Please fill all required information');
      return;
    }

    try {
      // Create user auth only
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.personalDetails.email,
        formData.personalDetails.password
      );

      const user = userCredential.user;

      // Sign out immediately after creation
      await auth.signOut();

      // Create vendor document in Firestore
      const vendorDocRef = doc(db, 'vendors', userId);
      await setDoc(vendorDocRef, {
        personalDetails: formData.personalDetails,
        businessDetails: formData.businessDetails,
        bankDetails: formData.bankDetails,
        documents: formData.documentUpload,
        status: 'unverified',
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      // Show success dialog
      setShowSuccessDialog(true);
      toast.success('Account created successfully! Please sign in.');

    } catch (error) {
      console.error('Error submitting data:', error);
      const errorMessage = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Email/password sign up is not enabled',
        'auth/weak-password': 'Password should be at least 6 characters',
        'default': 'An error occurred during registration'
      }[error.code] || error.message;

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const checkIfCompleteAndSubmit = () => {
      const isComplete =
        formData.personalDetails && Object.keys(formData.personalDetails).length > 0 &&
        formData.businessDetails && Object.keys(formData.businessDetails).length > 0 &&
        formData.bankDetails && Object.keys(formData.bankDetails).length > 0 &&
        formData.documentUpload && Object.keys(formData.documentUpload).length > 0;

      if (isComplete) {
        handleFinalSubmit();
      }
    };

    checkIfCompleteAndSubmit();
  }, [formData.documentUpload]);

  const getStepStyle = (currentStep) => {
    if (visitedSteps.includes(currentStep)) {
      return {
        icon: <AiOutlineCheck className="text-white" />,
        iconBg: 'bg-[#413753]',
        textColor: 'text-black',
        bgColor: 'bg-[#85716B]',
      };
    } else if (step === currentStep) {
      return {
        icon: <AiOutlineDown className="text-black" />,
        borderColor: 'border-black',
        textColor: 'text-black',
        bgColor: '',
      };
    } else {
      return {
        icon: <AiOutlineRight className="text-gray-400" />,
        borderColor: 'border-gray-400',
        textColor: 'text-gray-400',
        bgColor: '',
      };
    }
  };

  return (
    <>
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <AiOutlineCheck className="text-green-500" size={50} />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Account Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Your account has been created. Please sign in to continue.</p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push('/signin');
              }}
              className="w-full bg-[#85716B] text-white py-3 rounded-lg hover:bg-[#726159] transition-colors"
            >
              Proceed to Sign In
            </button>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-md mb-2 sm:px-20 px-5 p-4 w-full flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logoHeader.png" alt="Logo" className="w-28 h-18 mr-2" />
        </div>

        <button className="bg-baw-baw-g3 text-white py-2 px-4 rounded-md hover:bg-baw-baw-g4" onClick={() => router.push('/signin')}>
          Sign In
        </button>
      </nav>

      <div className="flex lg:mx-32 sm:mx-10 xs:mx-5 mx-1 flex-col items-center justify-center font-montserrat">
        <div className="w-full bg-white sm:p-8 xs:p-5 p-2 rounded-lg">
          <h2 className="text-2xl font-medium mb-10 text-center">Bhaw Bhaw Seller Registration</h2>

          <div className="flex items-center mb-8">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`text-center lg:w-auto xs:w-10 w-8 lg:mx-0 sm:mx-7 xs:mx-3 mx-2 ${getStepStyle(stepNumber).textColor}`}>
                  <div className={`sm:w-12 sm:h-12 w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${getStepStyle(stepNumber).borderColor} ${visitedSteps.includes(stepNumber) ? getStepStyle(stepNumber).iconBg : ''} ${getStepStyle(stepNumber).bgColor}`}>
                    {getStepStyle(stepNumber).icon}
                  </div>
                  <p className="mt-2 sm:text-sm xs:text-xs text-[10px] h-10 lg:w-32 w-auto text-center">
                    {stepNumber === 1 ? 'Personal Details' :
                      stepNumber === 2 ? 'Choose Category' :
                        stepNumber === 3 ? 'Business Details' :
                          stepNumber === 4 ? 'Bank Details' : 'Document'}
                  </p>
                </div>
                {stepNumber < 5 && (
                  <div className={`w-full mb-10 ${step > stepNumber ? 'bg-black h-1' : 'bg-gray-400 h-0.5'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <PersonalDetails
                  data={formData.personalDetails}
                  setData={(data) => setFormData({ ...formData, personalDetails: data })}
                  nextStep={nextStep}
                  userId={userId}
                  setUid={setUid}
                />
              )}
              {step === 2 && (
                <CategoryScreen
                  data={formData.personalDetails}
                  setData={(data) => setFormData({ ...formData, personalDetails: data })}
                  nextStep={nextStep}
                />
              )}
              {step === 3 && (
                <BusinessDetails
                  data={formData.businessDetails}
                  setData={(data) => setFormData({ ...formData, businessDetails: data })}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isEcommerce={formData.personalDetails?.isEcommerce}
                  isService={formData.personalDetails?.isService}
                />
              )}
              {step === 4 && (
                <BankDetailsForm
                  data={formData.bankDetails}
                  setData={(data) => setFormData({ ...formData, bankDetails: data })}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isEcommerce={formData.personalDetails?.isEcommerce}
                  isService={formData.personalDetails?.isService}
                />
              )}
              {step === 5 && (
                <DocumentUpload
                  data={formData.documentUpload}
                  setData={(data) => setFormData({ ...formData, documentUpload: data })}
                  handleFinalSubmit={handleFinalSubmit}
                  prevStep={prevStep}
                  userId={userId} // Add userId here
                  isEcommerce={formData.personalDetails?.isEcommerce}
                  isService={formData.personalDetails?.isService}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MultiStepForm;