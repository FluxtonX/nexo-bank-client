"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Upload, CheckCircle2, Clock, Loader2, X, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const supabase = createClient();
  const { notify } = useToast();

  // KYC content from CMS
  const [heading, setHeading] = useState("Identity Verification");
  const [subheading, setSubheading] = useState("Complete KYC to unlock your account");
  const [selfieGuides, setSelfieGuides] = useState<string[]>([
    "Face clearly visible",
    "Good lighting",
    "No sunglasses or hats",
    "Neutral expression",
  ]);
  const [thankYou, setThankYou] = useState("Thank you for submitting your documents.\nOur team is reviewing your information.\nThis typically takes 1-2 business days.");
  const [whatNext, setWhatNext] = useState<string[]>([
    "We'll verify your identity documents",
    "You'll receive an email when approved",
    "You can then access your full account",
  ]);

  useEffect(() => {
  async function checkExistingKyc() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('kyc_submissions')
      .select('status')
      .eq('user_id', user.id)
      .single();
    if (data?.status === 'pending') {
      notify({ title: "KYC Already Submitted", description: "You have already submitted your KYC. Please wait for approval." });
      router.push('/dashboard');
    } else if (data?.status === 'approved') {
      router.push('/dashboard');
    }
    setKycChecked(true);
  }
  checkExistingKyc();
}, []);

  // Fetch KYC content from site_content
  useEffect(() => {
    async function loadKycContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("key, value")
          .eq("category", "kyc");
        
        if (!error && data) {
          data.forEach((row) => {
            switch (row.key) {
              case "kyc.page_heading":
                setHeading(row.value);
                break;
              case "kyc.page_subheading":
                setSubheading(row.value);
                break;
              case "kyc.selfie_guides":
                if (Array.isArray(row.value)) {
                  setSelfieGuides(row.value);
                }
                break;
              case "kyc.thank_you":
                setThankYou(row.value);
                break;
              case "kyc.what_next":
                if (Array.isArray(row.value)) {
                  setWhatNext(row.value);
                }
                break;
              default:
                break;
            }
          });
        }
      } catch (err) {
        console.error("Error loading kyc content:", err);
      }
    }
    loadKycContent();
  }, [supabase]);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    occupation: "",
    streetAddress: "",
    city: "",
    province: "",
    postalCode: "",
    country: ""
  });

  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
const [kycChecked, setKycChecked] = useState(false);

  const [cameraState, setCameraState] = useState<{ isOpen: boolean; field: 'idFront' | 'idBack' | 'selfie' | null }>({ isOpen: false, field: null });
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCameraRefFront = useRef<HTMLInputElement>(null);
  const mobileCameraRefBack = useRef<HTMLInputElement>(null);
  const mobileCameraRefSelfie = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const openCamera = (field: 'idFront' | 'idBack' | 'selfie') => {
    if (isMobile) {
      if (field === 'idFront') mobileCameraRefFront.current?.click();
      if (field === 'idBack') mobileCameraRefBack.current?.click();
      if (field === 'selfie') mobileCameraRefSelfie.current?.click();
    } else {
      setCameraState({ isOpen: true, field });
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraState({ isOpen: false, field: null });
  };

  useEffect(() => {
    if (cameraState.isOpen && !isMobile && videoRef.current) {
      const constraints = {
        video: {
          facingMode: cameraState.field === 'selfie' ? 'user' : 'environment'
        }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please ensure permissions are granted.");
          closeCamera();
        });
    }
  }, [cameraState.isOpen, isMobile, cameraState.field]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraState.field) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (cameraState.field === 'selfie') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `${cameraState.field}-capture.jpg`, { type: 'image/jpeg' });
      
      setFiles(prev => ({ ...prev, [cameraState.field!]: file }));
      const preview = URL.createObjectURL(file);
      setFilePreviews(prev => ({ ...prev, [cameraState.field!]: preview }));
      setErrors(prev => ({ ...prev, [cameraState.field!]: "" }));
      
      closeCamera();
    }, 'image/jpeg', 0.9);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, [field]: "File too large. Maximum size is 10MB" });
      return;
    }
    setFiles({ ...files, [field]: file });
    const preview = URL.createObjectURL(file);
    setFilePreviews({ ...filePreviews, [field]: preview });
    setErrors({ ...errors, [field]: "" });
  }
};
  const submitKyc = async () => {
    if (!files.idFront || !files.idBack || !files.selfie) {
      alert("Please upload all required documents");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const uploadFile = async (file: File, filename: string) => {
        const filePath = `${user.id}/${filename}`;
        const { error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(filePath, file, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('kyc-documents').getPublicUrl(filePath);
        return data.publicUrl;
      };

      const idFrontUrl = await uploadFile(files.idFront, 'id-front.jpg');
      const idBackUrl = await uploadFile(files.idBack, 'id-back.jpg');
      const selfieUrl = await uploadFile(files.selfie, 'selfie.jpg');

      const { error: insertError } = await supabase
        .from('kyc_submissions')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          date_of_birth: formData.dob,
          gender: formData.gender,
          occupation: formData.occupation,
          street_address: formData.streetAddress,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postalCode,
          country: formData.country,
          id_front_url: idFrontUrl,
          id_back_url: idBackUrl,
          selfie_url: selfieUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      try {
        await fetch("/api/log-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "KYC Documents Submitted",
            category: "Kyc",
            severity: "Info",
            userName: formData.fullName,
            userId: user.id,
            details: "User submitted front ID, back ID, and selfie for KYC verification."
          })
        });
      } catch (logErr) {
        console.error("Failed to call log-event for KYC submission:", logErr);
      }

      setCurrentStep(5);
    } catch (error: any) {
      console.error("KYC submission error:", error);
      alert(error.message || "An error occurred while submitting KYC. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 5;

const nextStep = () => {
  const newErrors: Record<string, string> = {};
  
  if (currentStep === 1) {
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required";
  }
  
  if (currentStep === 2) {
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province.trim()) newErrors.province = "Province is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
  }

  if (currentStep === 3) {
    if (!files.idFront) newErrors.idFront = "Please upload front of ID";
    if (!files.idBack) newErrors.idBack = "Please upload back of ID";
  }

  if (currentStep === 4) {
    if (!files.selfie) newErrors.selfie = "Please upload your selfie";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
};
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center w-full max-w-[400px] mb-6 px-2">
        {[1, 2, 3, 4].map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div 
                className={cn(
                  "flex items-center justify-center w-[30px] h-[30px] rounded-full text-[13px] font-bold z-10 transition-colors shadow-sm",
                  isCompleted || isActive ? "bg-[#F5A623] text-[#0A0F2C]" : "bg-[#335CBC] text-blue-200"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step}
              </div>

              {/* Connecting Line */}
              {index < 3 && (
                <div 
                  className={cn(
                    "flex-1 h-[2px] mx-2 transition-colors rounded-full",
                    step < currentStep ? "bg-[#F5A623]" : "bg-[#335CBC]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {currentStep <= 4 && (
        <>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-white mb-1 text-center">
            {heading}
          </h1>
          <p className="text-[14px] text-blue-100 mb-5 text-center font-medium">
            {subheading}
          </p>
          <StepIndicator />
        </>
      )}

      <div className="bg-white rounded-2xl w-full p-4 sm:p-6 shadow-xl shadow-blue-900/20">
        
        {/* Step 1: Personal Information */}
      {currentStep === 1 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Personal Information</h2>
      <p className="text-[13px] text-[#718096] mt-1">Provide your legal information</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Legal Full Name</label>
        <input 
          type="text" 
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="John Michael Smith" 
          className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Date of Birth</label>
          <input 
            type="date" 
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.dob ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.dob && <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>}
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "M", value: "Male" },
              { label: "F", value: "Female" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, gender: option.value });
                  setErrors((prev) => ({ ...prev, gender: "" }));
                }}
                className={cn(
                  "h-[42px] rounded-xl border text-[14px] font-bold transition-all",
                  formData.gender === option.value
                    ? "border-[#113285] bg-[#113285]/10 text-[#113285]"
                    : "border-gray-200 bg-white text-[#0A0F2C] hover:border-[#113285]/40",
                  errors.gender && formData.gender !== option.value && "border-red-200",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-[11px] text-red-500 mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Occupation</label>
        <input 
          type="text" 
          name="occupation"
          value={formData.occupation}
          onChange={handleInputChange}
          placeholder="Software Engineer" 
          className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.occupation ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.occupation && <p className="text-[11px] text-red-500 mt-1">{errors.occupation}</p>}
      </div>
    </div>

    <button 
      onClick={nextStep}
      className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl mt-6 transition-colors"
    >
      Continue
    </button>
  </div>
)}
        {/* Step 2: Address Details */}
      {currentStep === 2 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Address Details</h2>
      <p className="text-[13px] text-[#718096] mt-1">Your current residential address</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Street Address</label>
        <input 
          type="text" 
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleInputChange}
          placeholder="123 Main Street" 
          className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.streetAddress ? 'border-red-400' : 'border-gray-200'}`}
        />
        {errors.streetAddress && <p className="text-[11px] text-red-500 mt-1">{errors.streetAddress}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">City</label>
          <input 
            type="text" 
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Toronto" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.city ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Province</label>
          <input 
            type="text" 
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            placeholder="Ontario" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.province ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.province && <p className="text-[11px] text-red-500 mt-1">{errors.province}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Postal Code</label>
          <input 
            type="text" 
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="M5A 1A1" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.postalCode ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.postalCode && <p className="text-[11px] text-red-500 mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#0A0F2C] mb-1">Country</label>
          <input 
            type="text" 
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Canada" 
            className={`w-full px-3 py-2.5 rounded-xl border text-[14px] text-[#0A0F2C] focus:outline-none focus:ring-2 focus:ring-[#113285]/20 focus:border-[#113285] transition-all ${errors.country ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.country && <p className="text-[11px] text-red-500 mt-1">{errors.country}</p>}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button onClick={prevStep} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors">Back</button>
      <button onClick={nextStep} className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors">Continue</button>
    </div>
  </div>
)}

        {/* Step 3: Government ID Upload */}
    {currentStep === 3 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Government ID Upload</h2>
      <p className="text-[13px] text-[#718096] mt-1">Upload a clear photo of your ID</p>
    </div>
    
    <div className="space-y-3">
      {/* Upload Front */}
      <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" ref={idFrontRef} onChange={(e) => handleFileChange(e, 'idFront')} />
      <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" ref={mobileCameraRefFront} onChange={(e) => handleFileChange(e, 'idFront')} />
      
      <div className="w-full">
        <div className="text-[14px] font-bold text-[#0A0F2C] mb-2">Front of ID</div>
        {filePreviews.idFront ? (
          <div className="relative rounded-2xl border border-gray-200 overflow-hidden group">
            <img src={filePreviews.idFront} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => {
                setFilePreviews(prev => ({ ...prev, idFront: "" }));
                setFiles(prev => ({ ...prev, idFront: null }));
              }} className="bg-white text-[#0A0F2C] px-4 py-2 rounded-lg font-bold text-sm shadow-lg">Retake</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => idFrontRef.current?.click()} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
              <Upload className="w-6 h-6 mb-2 text-[#4A5568] group-hover:text-[#113285]" strokeWidth={1.5} />
              <div className="text-[13px] font-bold text-[#0A0F2C]">Upload File</div>
            </button>
            <button onClick={() => openCamera('idFront')} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
              <Camera className="w-6 h-6 mb-2 text-[#4A5568] group-hover:text-[#113285]" strokeWidth={1.5} />
              <div className="text-[13px] font-bold text-[#0A0F2C]">Take Photo</div>
            </button>
          </div>
        )}
        {errors.idFront && <p className="text-[11px] text-red-500 mt-1">{errors.idFront}</p>}
      </div>

      {/* Upload Back */}
      <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" ref={idBackRef} onChange={(e) => handleFileChange(e, 'idBack')} />
      <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" ref={mobileCameraRefBack} onChange={(e) => handleFileChange(e, 'idBack')} />
      
      <div className="w-full">
        <div className="text-[14px] font-bold text-[#0A0F2C] mb-2">Back of ID</div>
        {filePreviews.idBack ? (
          <div className="relative rounded-2xl border border-gray-200 overflow-hidden group">
            <img src={filePreviews.idBack} alt="" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => {
                setFilePreviews(prev => ({ ...prev, idBack: "" }));
                setFiles(prev => ({ ...prev, idBack: null }));
              }} className="bg-white text-[#0A0F2C] px-4 py-2 rounded-lg font-bold text-sm shadow-lg">Retake</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => idBackRef.current?.click()} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
              <Upload className="w-6 h-6 mb-2 text-[#4A5568] group-hover:text-[#113285]" strokeWidth={1.5} />
              <div className="text-[13px] font-bold text-[#0A0F2C]">Upload File</div>
            </button>
            <button onClick={() => openCamera('idBack')} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
              <Camera className="w-6 h-6 mb-2 text-[#4A5568] group-hover:text-[#113285]" strokeWidth={1.5} />
              <div className="text-[13px] font-bold text-[#0A0F2C]">Take Photo</div>
            </button>
          </div>
        )}
        {errors.idBack && <p className="text-[11px] text-red-500 mt-1">{errors.idBack}</p>}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button onClick={prevStep} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors">Back</button>
      <button onClick={nextStep} className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors">Continue</button>
    </div>
  </div>
)}

        {/* Step 4: Selfie Upload */}
     {currentStep === 4 && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center mb-6">
      <h2 className="text-[17px] font-bold text-[#0A0F2C]">Selfie Upload</h2>
      <p className="text-[13px] text-[#718096] mt-1">Upload a clear photo of your face</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
        <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-2">Selfie Guidelines:</h3>
        <ul className="space-y-1.5">
          {selfieGuides.map((g, idx) => (
            <li key={idx} className="flex items-center text-[12px] text-[#4A5568]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mr-2 flex-shrink-0" />
              {g}
            </li>
          ))}
        </ul>
      </div>

      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" ref={selfieRef} onChange={(e) => handleFileChange(e, 'selfie')} />
      <input type="file" accept="image/jpeg,image/png,image/webp" capture="user" className="hidden" ref={mobileCameraRefSelfie} onChange={(e) => handleFileChange(e, 'selfie')} />
      
      <div className="w-full">
        {filePreviews.selfie ? (
          <div className="relative w-48 h-48 mx-auto rounded-full border border-gray-200 overflow-hidden group">
            <img src={filePreviews.selfie} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => {
                setFilePreviews(prev => ({ ...prev, selfie: "" }));
                setFiles(prev => ({ ...prev, selfie: null }));
              }} className="bg-white text-[#0A0F2C] px-4 py-2 rounded-lg font-bold text-sm shadow-lg">Retake</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => selfieRef.current?.click()} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
              <Upload className="w-6 h-6 mb-2 text-[#4A5568] group-hover:text-[#113285]" strokeWidth={1.5} />
              <div className="text-[13px] font-bold text-[#0A0F2C]">Upload File</div>
            </button>
            <button onClick={() => openCamera('selfie')} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#113285]/50 hover:bg-[#113285]/5 transition-all group">
              <Camera className="w-6 h-6 mb-2 text-[#4A5568] group-hover:text-[#113285]" strokeWidth={1.5} />
              <div className="text-[13px] font-bold text-[#0A0F2C]">Take Photo</div>
            </button>
          </div>
        )}
        {errors.selfie && <p className="text-[11px] text-red-500 mt-1 text-center">{errors.selfie}</p>}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-6">
      <button onClick={prevStep} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0A0F2C] font-bold text-[14px] py-3 rounded-xl transition-colors">Back</button>
      <button
        onClick={submitKyc}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center bg-[#113285] hover:bg-[#0D2665] disabled:bg-[#113285]/70 text-white font-bold text-[14px] py-3 rounded-xl transition-colors"
      >
        {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : "Submit for Review"}
      </button>
    </div>
  </div>
)}

        {/* Step 5: Verification in Progress */}
        {currentStep === 5 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF8EB] flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#F5A623]" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-[20px] font-bold text-[#0A0F2C] mb-2">Verification in Progress</h2>
            
            <p className="text-[13px] text-[#718096] mb-6 max-w-[360px] leading-relaxed mx-auto">
              {thankYou.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}<br />
                </React.Fragment>
              ))}
            </p>
            
            <div className="bg-[#F8F9FA] rounded-xl p-5 w-full mb-6">
              <h3 className="text-[13px] font-bold text-[#0A0F2C] mb-3">What happens next?</h3>
              <ul className="space-y-2 text-[12px] text-[#718096] text-left max-w-[260px] mx-auto list-disc pl-4 marker:text-gray-400">
                {whatNext.map((item, idx) => (
                  <li key={idx} className="pl-1">{item}</li>
                ))}
              </ul>
            </div>

            <Link 
              href="/dashboard"
              className="w-full bg-[#113285] hover:bg-[#0D2665] text-white font-bold text-[14px] py-3 rounded-xl transition-colors block"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

      </div>
      
      {cameraState.isOpen && !isMobile && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-[600px] bg-black rounded-3xl overflow-hidden relative shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-[400px] object-cover ${cameraState.field === 'selfie' ? 'scale-x-[-1]' : ''}`} 
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute top-4 right-4">
              <button onClick={closeCamera} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-6 inset-x-0 flex justify-center">
              <button onClick={capturePhoto} className="w-16 h-16 rounded-full border-4 border-white/50 bg-white hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-black/10"></div>
              </button>
            </div>
            <div className="absolute bottom-8 left-8">
              <button onClick={closeCamera} className="text-white font-bold text-sm bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg backdrop-blur">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
