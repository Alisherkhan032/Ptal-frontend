'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '@/app/components/Input/Input';
import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Button from '@/app/components/Button/Button';
import {
  getOrderByOrderIdRequest,
  getOrderByOrderIdSuccess,
  getOrderByOrderIdFailure,
} from '../../Actions/orderActions';
import { orderServices } from '@/app/services/oderService';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { qrCodeRecordsServices } from '@/app/services/qrCodeRecordsService';

// Custom Yup method to check for unique values and prefix
Yup.addMethod(Yup.string, 'uniqueWithPrefix', function (message, prefix) {
  return this.test('uniqueWithPrefix', message, function (value, context) {
    const { path, parent } = context;
    const siblings = Object.keys(parent)
      .filter((key) => key !== path)
      .map((key) => parent[key]);

    // Check if the value is unique
    const isUnique = !siblings.includes(value);

    // Check if the value starts with the specified prefix
    const hasCorrectPrefix = value.startsWith(prefix);

    return (
      (isUnique && hasCorrectPrefix) || this.createError({ path, message })
    );
  });
});

// Custom Yup method to check QR code status
Yup.addMethod(Yup.string, 'checkQRCodeStatus', function (message, allQrCodeRecords) {
  return this.test('checkQRCodeStatus', message, function (value) {
    const qrCodeStatus = allQrCodeRecords.find((qrCode) => qrCode.qr_code === value);

    if (!qrCodeStatus) {
      return this.createError({
        path: this.path,
        message: `${message} does not exist in the system`,
      });
    }

    return qrCodeStatus.current_status === 'Outwarded' || this.createError({
      path: this.path,
      message: `${message} Current status: ${qrCodeStatus ? qrCodeStatus.current_status : 'Unknown'}`,
    });
  });
});

const Page = () => {
  const { orderDetail } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, SetErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    AWBnumber_Orderid: '',
  });
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);


  const initialValues = {};

  const validationSchema = Yup.object().shape(
    orderDetail?.listOfProducts?.reduce((acc, skuData) => {
      for (let i = 0; i < skuData.quantity; i++) {
        const fieldName = `${skuData.skuCode}-${i}`;
        acc[fieldName] = Yup.string()
          .required('This field is required')
          .uniqueWithPrefix(
            `Value must be unique and start with ${skuData.skuCode}`,
            skuData.skuCode)
          .checkQRCodeStatus('QR Code ', allQrCodeRecords); 
        initialValues[fieldName] = '';
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    const getAllQRCodeRecords = async () => {
      const response = await qrCodeRecordsServices.getAllQrCodeRecords();
      if (response.success === true) {
        setAllQrCodeRecords(response.data);
      }
    };

    getAllQRCodeRecords();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === '' ? null : value,
    });
  };

  const handleFulfillSubmit = async (values) => {
    // Handle form submission
    console.log('Form values:', values, formData.AWBnumber_Orderid);

    try {
      const response = await orderServices.fulfillOrderByOrderId(
        values,
        formData.AWBnumber_Orderid
      );
      if (response.success === true) {
        toast.success(`Order Successfully Processed!`, {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
        
      }
      console.log('response===', response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(getOrderByOrderIdRequest());
      const response = await orderServices.getOrderByOrderId(
        formData.AWBnumber_Orderid
      );
      if (response.success === true) {
        dispatch(getOrderByOrderIdSuccess(response.data));
      } else if (response.success === false) {
        setErrorPopup(true);
        SetErrorMessage(response.message);
      }
    } catch (err) {
      console.log(err);
      dispatch(getOrderByOrderIdFailure(err));
    }
  };

  const handleSubmitAWB = async () => {
    try {
      dispatch(getOrderByOrderIdRequest());
      const response = await orderServices.getOrderByAWBNumber(
        formData.AWBnumber_Orderid
      );
      console.log('response getOrderByAWBNumber====', response);
      if (response.success === true) {
        dispatch(getOrderByOrderIdSuccess(response.data));
      } else if (response.success === false) {
        setErrorPopup(true);
        SetErrorMessage(response.message);
      }
    } catch (err) {
      console.log(err);
      dispatch(getOrderByOrderIdFailure(err));
    }
  };

  function closeModal() {
    // const modal = document.getElementById('popup-modal');
    // if (modal) {
    //   modal.style.display = 'none';
    // }
    setErrorPopup(false);
    SetErrorMessage('');
  }

  return (
    <div className="flex w-full h-screen  flex-row gap-4">
       <ToastContainer />
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw] ">
        <div>
          <PageTitle pageTitle={'Process Order'} />
        </div>

        <div className="mt-[0.3vw]  scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw]  overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <div className=" flex flex-col w-full  ">
            <div className="flex  gap-16 ">
              <div>
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
                  name={'AWBnumber_Orderid'}
                  placeholder={`Enter AWB number/Order id`}
                  value={formData.AWBnumber_Orderid}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className=" flex gap-7 ">
                <div onClick={handleSubmitAWB}>
                  <Button
                    title={'Search From AWB Number'}
                    bgColor={'bg-[rgb(79,201,218)]'}
                    radius={'rounded-lg'}
                    height={'h-[3vw] min-h-[3vh]'}
                    padding={'p-[1vw]'}
                    color={'text-[#ffff]'}
                    textSize={'text-[1vw]'}
                    fontWeight={'font-medium'}
                    width={'w-[14vw]'}
                  />
                </div>
                <div onClick={handleSubmit}>
                  <Button
                    title={'Search From Order Id'}
                    bgColor={'bg-[rgb(79,201,218)]'}
                    radius={'rounded-lg'}
                    height={'h-[3vw] min-h-[3vh]'}
                    padding={'p-[1vw]'}
                    color={'text-[#ffff]'}
                    textSize={'text-[1vw]'}
                    fontWeight={'font-medium'}
                    width={'w-[14vw]'}
                  />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFulfillSubmit}
                enableReinitialize
              >
                {({ errors, touched }) => (
                  <Form>
                    {orderDetail?.listOfProducts?.map((skuData, idx) => (
                      <div key={idx} className="flex gap-2 mb-7 flex-col">
                        <span> SKU Code : {skuData.skuCode}</span>
                        {[...Array(skuData.quantity)].map((_, i) => (
                          <div key={i} className="gap-5">
                            <Field
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
                              name={`${skuData.skuCode}-${i}`}
                              placeholder={`Enter barcode for ${
                                skuData.skuCode
                              } ${i + 1}`}
                            />
                            <ErrorMessage
                              name={`${skuData.skuCode}-${i}`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    ))}

                    {orderDetail !== null && (
                      <button
                        type="submit"
                        className="mt-4 p-2 w-[20vw] rounded-md  max-w-[20vw] bg-blue-500 text-white"
                        disabled={formDisabled}
                      >
                        Fulfill
                      </button>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          {errorPopup === true && (
            <div
              id="popup-modal"
              tabIndex="-1"
              className=" flex  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
              style={{
                backdropFilter: 'blur(2px)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative w-[30vw] flex items-center justify-center bg-[#F8F6F2] text-[#838481] rounded-lg shadow ">
                  <div className="p-4 md:p-5 text-center">
                    <div className=" h-24">
                      <ul className="bg-[#F8F6F2] w-[25vw] rounded-lg p-2 px-4">
                        <li className="font-semibold mt-7 text-center">
                          {errorMessage}
                        </li>
                      </ul>
                    </div>

                    <div className="flex mt-3 gap-4 justify-end">
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="py-2.2 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={() => closeModal()}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {formDisabled && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
          style={{ zIndex: 1000 }}
        />
      )}
    </div>
  );
};

export default Page;
