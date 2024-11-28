'use client';
import React, { useEffect, useState } from 'react';
import {
  getInventoryPobByIdRequest,
  getInventoryPobByIdSuccess,
  getInventoryPobByIdFailure,
  updateInventoryPORequest,
  updateInventoryPOSuccess,
  updateInventoryPOFailure,
} from '../../../Actions/inventoryPoActions';
import { inventoryPOServices } from '@/app/services/inventoryPO';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import Input from '@/app/components/Input/Input';
import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Button from '@/app/components/Button/Button';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { qrCodeRecordsServices } from '@/app/services/qrCodeRecordsService';
// import { recordServices } from '@/app/services/recordServices';

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
    // Check the status for the current QR code
    const qrCodeStatus = allQrCodeRecords.find((qrCode) => qrCode.qr_code === value);
    if (!qrCodeStatus) {
      // Return an error message if the QR code does not exist
      return this.createError({
        path: this.path,
        message: `${message} does not exist in the system`,
      });
    }

    // Modify the error message to include current status if validation fails
    return qrCodeStatus?.current_status === 'Pending' || this.createError({
      path: this.path,
      message: `${message} Current status: ${qrCodeStatus ? qrCodeStatus.current_status : 'Unknown'}`,
    });
  });
});

const Page = ({ params }) => {
  const { poDetailbyId } = useSelector((state) => state.inventoryPo);
  const [initialValues, setInitialValues] = useState({});
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false); // State to disable form interactions

  const [validationSchema, setValidationSchema] = useState(Yup.object());


  useEffect(() => {
    const handleData = (newRecord) => {

      setAllQrCodeRecords((prevRecords) => {
        const exists = prevRecords.find(record => record.qr_code === newRecord.qr_code);
        if (!exists) {
          return [newRecord, ...prevRecords];
        }
        return prevRecords;
      });
    };
    
  
    qrCodeRecordsServices.streamQrCodeRecords(handleData);
  
    return () => {
      // Cleanup logic if necessary
    };
  }, []);




  useEffect(() => {
    const schema = Yup.object().shape(
      poDetailbyId?.quantity &&
      Array.from({ length: poDetailbyId.quantity }).reduce((acc, _, i) => {
        const fieldName = `${poDetailbyId.product_id.sku_code}-${i}`;
        acc[fieldName] = Yup.string()
          .required('This field is required')
          .uniqueWithPrefix(`Value must be unique and start with ${poDetailbyId.product_id.sku_code}`, poDetailbyId.product_id.sku_code)
          .checkQRCodeStatus('QR Code ', allQrCodeRecords);
        return acc;
      }, {})
    );
  
    setValidationSchema(schema); // Set the new validation schema
  }, [initialValues, allQrCodeRecords]); // Dependencies for useEffect
  

  const router = useRouter();
  const dispatch = useDispatch();

  const getInventoryPoDataById = async () => {
    try {
      dispatch(getInventoryPobByIdRequest());
      const response = await inventoryPOServices.getInventoryPoById(params.fulfill_inventory_po);
      if (response.success === true) {
        dispatch(getInventoryPobByIdSuccess(response.data));
        const initialValues = {};
        for (let i = 0; i < response.data.quantity; i++) {
          initialValues[`${response.data.product_id.sku_code}-${i}`] = '';
        }
        setInitialValues(initialValues);
      }
    } catch (err) {
      dispatch(getInventoryPobByIdFailure(err));
      console.log(err);
    }
  };

  useEffect(() => {
    getInventoryPoDataById();
  }, [params.fulfill_inventory_po]);

  

  const handleSubmit = async (values) => {
    try {
      dispatch(updateInventoryPORequest());
      const response = await inventoryPOServices.updateInventoryPo(
        params.fulfill_inventory_po,
        {
          formData: values,
          status: 'fulfilled',
        }
      );
      if (response.success === true) {
        dispatch(updateInventoryPOSuccess(response.data));
        toast.success(`Inventory PO Inwarded Successfully!`, {
          autoClose: 1500,
          onClose: () => router.push('/inventory/inward_inventory_po'),
        });
        setFormDisabled(true); // Disable form interactions when toaster is shown
      } else {
        dispatch(updateInventoryPOFailure(response.error));
      }
    } catch (err) {
      dispatch(updateInventoryPOFailure(err));
      console.log('Update failed:', err);
    }
  };



  useEffect(() => {
    const getQrCodesBySkuCode = async () => {
      if (poDetailbyId?.product_id?.sku_code) {
        const response = await recordServices.getQrCodesBySkuCode({
          skuCode: poDetailbyId.product_id.sku_code,
        });
        if (response.success === true) {
          setQrCodesForSkuCode(response.data);
          console.log('response from page==', response.data);
        }
      }
    };

    getQrCodesBySkuCode();
  }, [poDetailbyId?.product_id?.sku_code]);

  const handleKeyDown = (e, currentIndex, inputs) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus(); // Move focus to the next input
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
          <PageTitle pageTitle={'Fulfill Inventory PO:'} paramsData={params.fulfill_inventory_po} />
        </div>

        <div className="mt-[0.3vw] p-4 scrollWidth w-[74vw] min-w-[74vw] max-w-[74vw] overflow-y-scroll min-h-[70vh] h-[70vh] max-h-[70vh]">
          <span>SKU CODE: {poDetailbyId?.product_id?.sku_code}</span>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                {poDetailbyId?.quantity &&
                  Array.from({ length: poDetailbyId.quantity }).map((_, i) => (
                    <div key={i} className="flex flex-wrap mb-4 mt-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Enter code for #{i + 1}
                        </span>
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
                          name={`${poDetailbyId.product_id.sku_code}-${i}`}
                          placeholder={`Enter code for ${poDetailbyId.product_id.sku_code} #${i + 1}`}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onKeyDown={(e) => {
                            handleKeyDown(e, i, document.querySelectorAll('input[type="text"]'));
                          }}
                        />
                        <ErrorMessage
                          name={`${poDetailbyId.product_id.sku_code}-${i}`}
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                <button
                  type="submit"
                  className="mt-4 p-2 w-[20vw] rounded-md max-w-[20vw] bg-blue-500 text-white"
                  disabled={formDisabled} // Disable if form is submitted or toaster shown
                >
                  Fulfill
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Overlay to prevent user interaction */}
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
