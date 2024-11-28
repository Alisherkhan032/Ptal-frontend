'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import { 
  getOrderDetailsByReferenceCodeFailure, 
  getOrderDetailsByReferenceCodeRequest, 
  getOrderDetailsByReferenceCodeSuccess 
} from '@/app/Actions/orderDetailsActions'; 
import { orderDetailsService } from '@/app/services/orderDetailsService';
import { qrCodeRecordsServices } from '@/app/services/qrCodeRecordsService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

// Validation methods
Yup.addMethod(Yup.string, 'checkQRCodeStatus', function(message, allQrCodeRecords) {
  return this.test('checkQRCodeStatus', message, function(value) {
    const qrCodeStatus = allQrCodeRecords.find(qrCode => qrCode.qr_code === value);

    if (!qrCodeStatus) {
      return this.createError({
        path: this.path,
        message: `${message} does not exist in the system`,
      });
    }

    return (
      qrCodeStatus.current_status === 'Outwarded' ||
      this.createError({
        path: this.path,
        message: `${message} status is ${qrCodeStatus ? qrCodeStatus.current_status : 'Unknown'}`,
      })
    );
  });
});

Yup.addMethod(Yup.string, 'uniqueWithPrefix', function(message, { prefix, allValues }) {
  return this.test('uniqueWithPrefix', message, function(value) {
    const { path, parent } = this;
    const siblings = Object.keys(parent)
      .filter(key => key !== path)
      .map(key => parent[key]);

    const isUnique = !siblings.includes(value);
    const hasCorrectPrefix = value.startsWith(prefix);

    return (
      (isUnique && hasCorrectPrefix) ||
      this.createError({ path, message })
    );
  });
});

Yup.addMethod(Yup.string, 'isFromAllowedQrCode', function (allowedQrCodes, message) {
  return this.test('isFromAllowedQrCode', message, function (value) {
    const { path } = this;
    if (allowedQrCodes.includes(value)) {
      return true;
    }
    return this.createError({
      path,
      message: message || `QR Code is not from the allowed list.`,
    });
  });
});

// Custom uniqueValues method
Yup.addMethod(Yup.string, 'uniqueValues', function (message, allValues) {
  return this.test('uniqueValues', message, function (value) {
    const { path } = this;
    
    // Filter out the current field's value to avoid self-comparison
    const otherValues = allValues.filter((val, index) => `${path}` !== index);

    // Check if the current value already exists in the other fields
    const isUnique = !otherValues.includes(value);

    return (
      isUnique ||
      this.createError({
        path,
        message: message || 'Value must be unique',
      })
    );
  });
});


const ProcessOrders = () => {
  const [referenceCode, setReferenceCode] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedAwb, setSelectedAwb] = useState('');
  const [showAwbInput, setShowAwbInput] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [isEngravingOrder, setIsEngravingOrder] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    const getAllQRCodeRecords = async () => {
      const response = await qrCodeRecordsServices.getAllQrCodeRecords();
      if (response.success === true) {
        setAllQrCodeRecords(response.data);
      }
    };

    getAllQRCodeRecords();
  }, []);

  const handleInputChange = (e) => {
    setReferenceCode(e.target.value);
  };

  const handleAwbInputChange = (e) => {
    setSelectedAwb(e.target.value);
  };

  const allowedQrCodes = orderDetails.engravingQRCode || [];

  const handleGetDetails = async () => {
    if (!referenceCode) return;

    setLoading(true);
    dispatch(getOrderDetailsByReferenceCodeRequest());
    try {
      const response = await orderDetailsService.getOrderDetailsByReferenceCode(referenceCode);
      if (response.success) {
        const data = response.data;
        console.log("🚀 ~ handleGetDetails ~ data:", data)
        console.log ("Data Length: ", data.length)

        if (data.length === 0) {
          setIsModalOpen(true);
          setModalMessage('The order has already been shipped, or the reference number entered is incorrect, or the Engraving Order is not processed yet.');
        } else if (data.engravingQRCode) { 
          setIsEngravingOrder(true); 
          setOrderDetails(data);
          generateFormFields(data);
         }
        else if (data.length === 1) {
          setOrderDetails(data);
          setSelectedAwb(data[0].awb_number);
          generateFormFields(data[0]);
        } else if (data.length > 1) {
          setOrderDetails(data);
          setShowAwbInput(true);
        }

        dispatch(getOrderDetailsByReferenceCodeSuccess(data));
      } else {
        console.error('Failed to fetch order details. Please check the reference code.');
        dispatch(getOrderDetailsByReferenceCodeFailure('Failed to fetch order details.'));
      }
    } catch (error) {
      console.error('Error fetching order details:', error.message);
      dispatch(getOrderDetailsByReferenceCodeFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAwb = () => {
    setLoading(true);
    const selectedOrder = orderDetails.find(order => order.awb_number === selectedAwb);
    if (selectedOrder) {
      generateFormFields(selectedOrder);
    } else {
      setModalMessage('Enter correct AWB number.');
      setIsModalOpen(true);
    }
    setLoading(false);
  };

  const generateFormFields = (order) => {
    const initial = {};
    order.items.forEach((item, index) => {
      for (let i = 0; i < item.quantity; i++) {
        initial[`${item.sku}-${i}`] = '';
      }
    });
    setInitialValues(initial);
    setFormVisible(true);
  };

  // const validationSchema = Yup.object().shape(
  //   Object.keys(initialValues).reduce((acc, fieldName) => {
  //     const lastDashIndex = fieldName.lastIndexOf('-');
  //     const prefix = fieldName.substring(0, lastDashIndex);
     
  //     acc[fieldName] = Yup.string()
  //       .required('This field is required')
  //       .uniqueWithPrefix(
  //         `Value must be unique and start with ${prefix}`,
  //         {
  //           prefix,
  //           allValues: Object.values(initialValues),
  //         }
  //       )
  //       .checkQRCodeStatus('QR Code', allQrCodeRecords);
  //     return acc;
  //   }, {})
  // );

  const validationSchema = Yup.lazy((values) => {
    return Yup.object().shape(
      Object.keys(values).reduce((acc, fieldName) => {
        const lastDashIndex = fieldName.lastIndexOf('-');
        const prefix = fieldName.substring(0, lastDashIndex);
  
        if (isEngravingOrder) {
          // Only apply isFromAllowedQrCode validation if it's an engraving order
          acc[fieldName] = Yup.string()
            .required('This field is required')
            .uniqueValues('Each QR code must be unique', Object.values(initialValues))
            .isFromAllowedQrCode(allowedQrCodes, 'QR Code is not from the allowed list');
        } else {
          // Apply all validations if it's not an engraving order
          acc[fieldName] = Yup.string()
            .required('This field is required')
            .uniqueWithPrefix(
              `Value must be unique and start with ${prefix}`,
              {
                prefix,
                allValues: Object.values(initialValues),
              }
            )
            .checkQRCodeStatus('QR Code', allQrCodeRecords);
        }
  
        return acc;
      }, {})
    );
  });
  
  const handleKeyDown = (e, currentIndex, inputs) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showAwbInput){
        if (currentIndex < inputs.length - 3) {
          inputs[currentIndex + 3].focus();
        }
      } else {
        if (currentIndex < inputs.length - 2) {
          inputs[currentIndex + 2].focus();
        }
      }
    }
  };
  console.log("Order Details: ", orderDetails);

  const handleSubmit = async (values, actions) => {
    setLoading(true);
    try {
      console.log('Form Values:', values);
      
      const qrCodes = {};
      Object.keys(values).forEach(key => {
        qrCodes[key] = values[key];
      });
      
      let dataToSend = {};
      if (isEngravingOrder) {
        console.log('Engraving order');
        dataToSend = {
          awbNumber: orderDetails.awb_number,
          qrCodes: qrCodes,
          orderId: orderDetails.order_id,
          referenceCode: orderDetails.reference_code,
        };
      } else {
        console.log('Non-engraving order');
        dataToSend = {
          awbNumber: selectedAwb,
          qrCodes: qrCodes,
          orderId: orderDetails[0].order_id,
          referenceCode: orderDetails[0].reference_code,
        };
      }
  
      console.log('Data to send:', dataToSend);
  
      const response = await orderDetailsService.saveOrderDetails(dataToSend);
  
      console.log('Response from API:', response);
  
      if (response.success) {
        setFormDisabled(true);
        toast.success('Order Successfully Processed!', { autoClose: 1500, onClose: () => window.location.reload() });
        
      } else {
        setFormDisabled(true);
        toast.error('Failed to process order: ' + response.error, { autoClose: 3000 , onClose: () => window.location.reload() });
      
      }
    } catch (error) {
      console.error('Error processing order:', error.message);
      toast.error('Failed to process order: ' + error.message, { autoClose: 3000 , onClose: () => window.location.reload() });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col w-full">
      <ToastContainer />
      <div className="flex gap-16">
        <div>
          <label>Scan In Order Reference Code:</label>
          <br /><br />
          <Input
            bgColor={'bg-[#F8F6F2]'}
            radius={'rounded-lg'}
            height={'h-[3.5vw] min-h-[3.5vh]'}
            width={'w-[30vw] min-w-[30vw]'}
            padding={'p-[1vw]'}
            type={'text'}
            color={'text-[#838481]'}
            textSize={'text-[1vw]'}
            fontWeight={'font-medium'}
            name={'referenceCode'}
            placeholder={`Enter Reference Code`}
            value={referenceCode}
            onChange={handleInputChange}
          />
          <div className="flex gap-7 mt-4">
            <div onClick={handleGetDetails}>
              <Button
              title={loading ? <ClipLoader size={20} color="#fff" /> : 'Get Details'}
              width="w-[15vw] min-w-[15vw]"
              height="h-[3.5vw] min-h-[3.5vh]"
              bgColor="bg-[rgb(79,201,218)]"
              radius="rounded-lg"
              textSize="text-[1.3vw]"
              fontWeight="font-semibold"
              color="text-white"
              hover="hover:bg-[rgb(79,201,218)]/90"
              type="button"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>

    {showAwbInput && (
      <div className="mt-8">
        <label>Scan AWB Number:</label>
        <br /><br />
        <Input
          bgColor={'bg-[#F8F6F2]'}
          radius={'rounded-lg'}
          height={'h-[3.5vw] min-h-[3.5vh]'}
          width={'w-[30vw] min-w-[30vw]'}
          padding={'p-[1vw]'}
          type={'text'}
          color={'text-[#838481]'}
          textSize={'text-[1vw]'}
          fontWeight={'font-medium'}
          name={'awbNumber'}
          placeholder={`Enter awb number`}
          value={selectedAwb}
          onChange={handleAwbInputChange}
        />
        <div className="flex gap-7 mt-4">
          <div onClick={handleSubmitAwb}>
            <Button
              title={loading ? <ClipLoader size={20} color="#fff" /> : 'Submit AWB'}
              width="w-[15vw] min-w-[15vw]"
              height="h-[3.5vw] min-h-[3.5vh]"
              bgColor="bg-[rgb(79,201,218)]"
              radius="rounded-lg"
              textSize="text-[1.3vw]"
              fontWeight="font-semibold"
              color="text-white"
              hover="hover:bg-[rgb(79,201,218)]/90"
              type="button"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    )}

    {formVisible && (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="mt-8 flex flex-col gap-4">
            {Object.keys(initialValues).map((fieldName, index) => (
              <div key={fieldName} className="flex flex-col">
                <Field
                  name={fieldName}
                  as={Input}
                  bgColor={'bg-[#F8F6F2]'}
                  radius={'rounded-lg'}
                  height={'h-[3.5vw] min-h-[3.5vh]'}
                  width={'w-[30vw] min-w-[30vw]'}
                  padding={'p-[1vw]'}
                  type={'text'}
                  color={'text-[#838481]'}
                  textSize={'text-[1vw]'}
                  fontWeight={'font-medium'}
                  placeholder={`Enter QR Code for ${fieldName}`}
                  onKeyDown={(e) => handleKeyDown(e, index, document.querySelectorAll('input'))}
                />
                <ErrorMessage
                  name={fieldName}
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            ))}

            <div className="flex justify-center mt-6">
              <Button
                title={loading ? <ClipLoader size={20} color="#fff" /> : 'Fulfill Order'}
                width="w-[20vw] min-w-[20vw]"
                height="h-[3.5vw] min-h-[3.5vh]"
                bgColor="bg-[rgb(79,201,218)]"
                radius="rounded-lg"
                textSize="text-[1.3vw]"
                fontWeight="font-semibold"
                color="text-white"
                hover="hover:bg-[rgb(79,201,218)]/90"
                type="submit"
                disabled={loading || formDisabled}
              />
            </div>
          </Form>
        )}
      </Formik>
    )}


      <Modal 
  isOpen={isModalOpen} 
  message={modalMessage} 
  onClose={() => setIsModalOpen(false)} 
/>

      {formDisabled && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
          style={{ zIndex: 1000 }}
        />
      )}
    </div>
  );
};

export default ProcessOrders;

