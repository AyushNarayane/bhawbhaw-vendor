import React, { useState, useEffect } from 'react';
import { storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { AiOutlineLoading3Quarters, AiOutlineClose } from 'react-icons/ai';
import { toast } from "react-hot-toast";

const DocumentUploadForm = ({ prevStep, data, onSubmit, setData, userId, isEcommerce, isService }) => {
    const [documents, setDocuments] = useState({
        gstCertificate: null,
        panCard: null,
        aadhaarCard: null,
        photo: null,
    });

    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState({});

    const handleFileChange = (e, documentType) => {
        const file = e.target.files[0];
        if (file) {
            setDocuments({ ...documents, [documentType]: file });
            setPreviews({ ...previews, [documentType]: URL.createObjectURL(file) });
        }
    };

    const removeFile = (documentType) => {
        setDocuments({ ...documents, [documentType]: null });
        setPreviews({ ...previews, [documentType]: null });
    };

    const uploadFile = async (file, documentType) => {
        const storageRef = ref(storage, `documents/${userId}/${documentType}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setDocuments(data);
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredDocuments = ['panCard', 'aadhaarCard', 'photo'];

        for (const doc of requiredDocuments) {
            if (!documents[doc]) {
                toast.error(`Please upload ${doc.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        setUploading(true);
        const urls = {};

        for (const [key, file] of Object.entries(documents)) {
            if (file) {
                const url = await uploadFile(file, key);
                urls[key] = url;
            }
        }

        setData({ ...urls });
        setUploading(false);
        onSubmit();
    };

    return (
        <div className="bg-white sm:px-8 py-8 px-3 rounded-lg shadow-md font-montserrat">
            <div className="flex flex-wrap gap-10 justify-center">
                {['panCard', 'aadhaarCard', 'photo'].map((documentType) => (
                    <div key={documentType} className="flex flex-col items-center mb-4 relative">
                        <label className="text-gray-700 font-medium mb-1 capitalize">
                            {documentType.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <label htmlFor={`${documentType}-upload`} className="cursor-pointer">
                            <div
                                className={`flex ${previews[documentType] ? 'flex-row' : 'flex-col'} items-center justify-center w-48 h-48 border-2 border-dashed border-gray-400 rounded-lg relative`}
                                style={{
                                    backgroundColor: "#f496ac2d",
                                    transition: 'transform 0.2s',
                                }}
                            >
                                {previews[documentType] ? (
                                    documents[documentType].type === "application/pdf" || documents[documentType].name?.endsWith(".pdf") ? (
                                        <object data={previews[documentType]} type="application/pdf" className="h-full w-full object-cover rounded" aria-label="PDF preview">
                                            <p>PDF Preview Not Available</p>
                                        </object>
                                    ) : (
                                        <img src={previews[documentType]} alt={`${documentType} preview`} className="h-full w-full object-cover rounded" />
                                    )
                                ) : (
                                    <FaCloudUploadAlt size={30} color="#85716B" />
                                )}
                                {!previews[documentType] && <span className="mt-2 text-sm text-gray-600">Upload</span>}
                            </div>

                            <input
                                id={`${documentType}-upload`}
                                type="file"
                                accept="image/*,application/pdf"
                                hidden
                                onChange={(e) => handleFileChange(e, documentType)}
                            />
                        </label>

                        {previews[documentType] && (
                            <AiOutlineClose
                                size={20}
                                className="absolute top-0 right-0 border border-red-500 rounded-full p-1 cursor-pointer text-red-500"
                                onClick={() => removeFile(documentType)}
                            />
                        )}
                    </div>
                ))}

                {(!isService || isEcommerce) && (
                    <div className="flex flex-col items-center mb-4 relative">
                        <label className="text-gray-700 font-medium mb-1 capitalize">GST Certificate</label>
                        <label htmlFor="gstCertificate-upload" className="cursor-pointer">
                            <div
                                className={`flex ${previews.gstCertificate ? 'flex-row' : 'flex-col'} items-center justify-center w-48 h-48 border-2 border-dashed border-gray-400 rounded-lg relative`}
                                style={{
                                    backgroundColor: "#f496ac2d",
                                    transition: 'transform 0.2s',
                                }}
                            >
                                {previews.gstCertificate ? (
                                    documents.gstCertificate.type === "application/pdf" || documents.gstCertificate.name?.endsWith(".pdf") ? (
                                        <object data={previews.gstCertificate} type="application/pdf" className="h-full w-full object-cover rounded" aria-label="PDF preview">
                                            <p>PDF Preview Not Available</p>
                                        </object>
                                    ) : (
                                        <img src={previews.gstCertificate} alt="GST Certificate preview" className="h-full w-full object-cover rounded" />
                                    )
                                ) : (
                                    <FaCloudUploadAlt size={30} color="#85716B" />
                                )}
                                {!previews.gstCertificate && <span className="mt-2 text-sm text-gray-600">Upload</span>}
                            </div>

                            <input
                                id="gstCertificate-upload"
                                type="file"
                                accept="image/*,application/pdf"
                                hidden
                                onChange={(e) => handleFileChange(e, "gstCertificate")}
                            />
                        </label>

                        {previews.gstCertificate && (
                            <AiOutlineClose
                                size={20}
                                className="absolute top-0 right-0 border border-red-500 rounded-full p-1 cursor-pointer text-red-500"
                                onClick={() => removeFile("gstCertificate")}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className={`flex items-center justify-center px-4 py-2 bg-[#85716B] text-white rounded transition-colors duration-200 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? (
                        <AiOutlineLoading3Quarters className="animate-spin mr-2" size={20} />
                    ) : null}
                    {uploading ? 'Uploading...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default DocumentUploadForm;
