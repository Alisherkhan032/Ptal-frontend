'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pickListServices } from '@/app/services/pickListService';
import {
  getPickListByIdRequest,
  getPickListByIdSuccess,
  getPickListByIdFailure,
} from '../../../../Actions/pickListActions';
import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Input from '@/app/components/Input/Input';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
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

    const isUnique = !siblings.includes(value);
    const hasCorrectPrefix = value.startsWith(prefix);

    return (isUnique && hasCorrectPrefix) || this.createError({ path, message });
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

    return qrCodeStatus.current_status === 'Inwarded' || this.createError({
      path: this.path,
      message: `${message} Current status: ${qrCodeStatus ? qrCodeStatus.current_status : 'Unknown'}`,
    });
  });
});

const Page = ({ params }) => {
  const { pickListDetail } = useSelector((state) => state.pickList);
  const dispatch = useDispatch();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState({});
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);

  const getPickListById = async () => {
    try {
      dispatch(getPickListByIdRequest());
      const response = await pickListServices.getPickListById(params.fulfill_pickList);
      if (response.success === true) {
        dispatch(getPickListByIdSuccess(response.data));
        const initialValues = {};
        response.data.skus.forEach((skuData) => {
          for (let i = 0; i < skuData.totalQuantity; i++) {
            initialValues[`${skuData.skuCode}-${i}`] = '';
          }
        });
        setInitialValues(initialValues);
      }
    } catch (err) {
      dispatch(getPickListByIdFailure(err));
    }
  };

  useEffect(() => {
    getPickListById();
  }, [params.fulfill_pickList]);

  useEffect(() => {
    const getAllQRCodeRecords = async () => {
      const response = await qrCodeRecordsServices.getAllQrCodeRecords();
      if (response.success === true) {
        setAllQrCodeRecords(response.data);
      }
    };

    getAllQRCodeRecords();
  }, []);

  const validationSchema = Yup.object().shape(
    pickListDetail?.skus?.reduce((acc, skuData) => {
      for (let i = 0; i < skuData.totalQuantity; i++) {
        const fieldName = `${skuData.skuCode}-${i}`;
        acc[fieldName] = Yup.string()
          .required('This field is required')
          .uniqueWithPrefix(`Value must be unique and start with ${skuData.skuCode}`, skuData.skuCode)
          .checkQRCodeStatus('QR Code ', allQrCodeRecords);
        initialValues[fieldName] = '';
      }
      return acc;
    }, {})
  );

  const handleSubmit = async (values) => {
    try {
      const response = await pickListServices.updatePickListById(params.fulfill_pickList, values);
      if (response.success === true) {
        toast.success(`Picklist Successfully Outwarded!`, {
          autoClose: 1500,
          onClose: () => router.replace('/inventory/outward_picklist'),
        });
        setFormDisabled(true);
      }
    } catch (err) {
      console.log(err);
      dispatch(getPickListByIdFailure(err));
    }
  };

  const handleKeyDown = (e, skuCodes, currentFieldName, inputs) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const currentIndex = inputs.findIndex(input => input.name === currentFieldName);
      const nextIndex = currentIndex + 1;

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
      } else {
        const currentSkuIndex = skuCodes.indexOf(currentFieldName.split('-')[0]);
        const nextSkuIndex = currentSkuIndex + 1;

        if (nextSkuIndex < skuCodes.length) {
          const nextSkuFieldName = `${skuCodes[nextSkuIndex]}-0`;
          const nextSkuInput = inputs.find(input => input.name === nextSkuFieldName);
          if (nextSkuInput) {
            nextSkuInput.focus();
          }
        }
      }
    }
  };

  return (
    <div className="flex w-full h-screen flex-row gap-4">
      <ToastContainer />
      <div className="w-[23vw]">
        <Sidebar items={items} />
      </div>

      <div className="flex flex-col w-[77vw]">
        <div>
          <PageTitle pageTitle={'Fulfill Picklist:'} paramsData={params.fulfill_pickList} />
        </div>

        <div className="mt-[0.3vw] p-4 scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw] overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                {pickListDetail?.skus?.map((skuData, idx) => (
                  <div key={idx} className="flex gap-2 mb-7 flex-col">
                    <span> SKU Code : {skuData.skuCode}</span>
                    {[...Array(skuData.totalQuantity)].map((_, i) => (
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
                          placeholder={`Enter barcode for ${skuData.skuCode} ${i + 1}`}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            const inputNodes = document.querySelectorAll('input[type="text"]');
                            const inputs = Array.from(inputNodes);

                            handleKeyDown(
                              e,
                              pickListDetail.skus.map(skuData => skuData.skuCode),
                              `${skuData.skuCode}-${i}`,
                              inputs
                            );
                          }}
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
                <button
                  type="submit"
                  className="mt-4 p-2 w-[20vw] rounded-md max-w-[20vw] bg-blue-500 text-white"
                  disabled={formDisabled}
                >
                  Fulfill
                </button>
              </Form>
            )}
          </Formik>
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
