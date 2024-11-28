'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { amazonOrderService } from '@/app/services/amazonOrderService';
import { qrCodeRecordsServices } from '@/app/services/qrCodeRecordsService';

Yup.addMethod(Yup.string, 'checkQRCodeStatus', function (message, allQrCodeRecords) {
  return this.test('checkQRCodeStatus', message, function (value) {
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

Yup.addMethod(Yup.string, 'uniqueWithPrefix', function (message, { prefix, allValues }) {
  return this.test('uniqueWithPrefix', message, function (value) {
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

const ProcessAmazonOrders = () => {
  const [orderId, setOrderId] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);  // QR code records

  // Fetch QR codes on component mount
  useEffect(() => {
    const getAllQRCodeRecords = async () => {
      const response = await qrCodeRecordsServices.getAllQrCodeRecords();
      if (response.success) {
        setAllQrCodeRecords(response.data);
      }
    };
    getAllQRCodeRecords();
  }, []);

  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  const handleGetDetails = async () => {
    setLoading(true);
    try {
      const response = await amazonOrderService.getAmazonOrderById(orderId);
      const { success, order, message } = response;
      if (success) {
        if (order.status === 'Shipped' || order.status === 'Cancelled' || order.status === 'Fulfilled') {
          setModalMessage(message || `The order is ${order.status.toLowerCase()}.`);
          setIsModalOpen(true);
        } else if (order.status === 'Pending') {
          generateFormFields(order);
        }
      } else {
        setModalMessage('Order not found.');
        setIsModalOpen(true);
      }
    } catch (error) {
      setModalMessage('Failed to fetch order details. Please try again.');
      setIsModalOpen(true);
    }
    setLoading(false);
  };

  const generateFormFields = (order) => {
    const initial = {};
    order.productDetails.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        initial[`${item.skuCode}-${i}`] = '';
      }
    });
    setInitialValues(initial);
    setFormVisible(true);
  };

  const validationSchema = Yup.object().shape(
    Object.keys(initialValues).reduce((acc, fieldName) => {
      const lastDashIndex = fieldName.lastIndexOf('-');
      const prefix = fieldName.substring(0, lastDashIndex);

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
      return acc;
    }, {})
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentFieldIndex = Object.keys(initialValues).indexOf(e.target.name);
      const nextFieldName = Object.keys(initialValues)[currentFieldIndex + 1];
      
      if (nextFieldName) {
        document.querySelector(`input[name="${nextFieldName}"]`).focus();
      }
    }
  };
  

const handleSubmit = async (values, actions) => {
    setLoading(true);
    try {
      const submissionData = {  fulfilledQrCodes: values, orderId };
      const response = await amazonOrderService.updateAmazonOrder(submissionData);
  
      console.log('Form Submitted:', response); 
      
      toast.success('Order Successfully Processed!', {
        autoClose: 2000,
        onClose: () => window.location.reload(), 
      });
      
      setFormDisabled(true);
    } catch (error) {
      console.error('Error during order processing:', error); 
      toast.error('Failed to process order', {
        autoClose: 3000,
        onClose: () => window.location.reload(), 
      });
    } finally {
      setLoading(false); 
    }
  };
  
  return (
    <div className="flex flex-col w-full">
      <ToastContainer />

      {/* Order ID Input */}
      <div className="mt-8">
        <label>Enter Order ID:</label>
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
          name={'orderId'}
          placeholder={`Enter Order ID`}
          value={orderId}
          onChange={handleOrderIdChange}
        />
        <div className="flex gap-7 mt-4">
          <div onClick={handleGetDetails}>
            <Button
              title={loading ? <ClipLoader size={20} color="#fff" /> : 'Get Order Details'}
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

      {/* Form for Items in Order */}
      {formVisible && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 flex flex-col gap-4">
                {Object.keys(initialValues).map((fieldName) => (
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
                    placeholder={`Enter value for ${fieldName}`}
                    onKeyDown={handleKeyDown}  // Attach handleKeyDown here
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

      {/* Modal for Error Message */}
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

export default ProcessAmazonOrders;
