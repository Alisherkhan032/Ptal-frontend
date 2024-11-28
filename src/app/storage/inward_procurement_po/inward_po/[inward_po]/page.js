'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { poServices } from '@/app/services/poService';
import {
  getPoByIdRequest,
  getPoByIdSuccess,
  getPoByIdFailure,
} from '../../../../Actions/poActions';
import { items } from '@/app/utils/sidebarItems';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Input from '@/app/components/Input/Input';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import PageTitle from '@/app/components/PageTitle/PageTitle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { batchServices } from '@/app/services/batchService';

// Custom Yup test to check if value starts with batch number
Yup.addMethod(Yup.string, 'startsWithBatchNumber', function (batchNumber, message) {
  return this.test('starts-with-batch-number', message, function (value) {
    const { path, createError } = this;
    return value ? value.startsWith(batchNumber) : true || createError({ path, message });
  });
});

const Page = ({ params }) => {
  const { poById } = useSelector((state) => state.po); 
  const dispatch = useDispatch();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState({});
  const [formDisabled, setFormDisabled] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');

  // Fetch PO details by ID
  const getPoById = async () => {
    try {
      dispatch(getPoByIdRequest());
      const response = await poServices.getPoById(params.inward_po);  // Fetch PO details  
      if (response.success === true) {
        dispatch(getPoByIdSuccess(response.data));
        const initialValues = {};
        const qcData = response.data.qcData;
        if (qcData && qcData.passedQcInfo) {
          for (let i = 0; i < qcData.passedQcInfo; i++) {
            initialValues[`qc-${qcData.skuCode}-${i}`] = '';  // Generate fields based on qc_passed_quantity
          }
        }
        setInitialValues(initialValues);
      }
    } catch (err) {
      dispatch(getPoByIdFailure(err));
    }
  };

  // Fetch batch number by PO ID
  const getBatchNumberByPoId = async () => {
    try {
      const response = await batchServices.getBatchNumberByPoId(params.inward_po);  // Fetch batch number by PO ID
      if (response.success === true) {
        setBatchNumber(response.data);  // Update state with the batch number
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBatchNumberByPoId();
    getPoById();
  }, [params.inward_po]);  // Use PO parameter

  // Validation schema
  const validationSchema = Yup.object().shape(
    Object.keys(initialValues).reduce((acc, fieldName) => {
      acc[fieldName] = Yup.string()
        .required('This field is required')
        .startsWithBatchNumber(batchNumber, `Barcode should start with batch number ${batchNumber}`);
      return acc;
    }, {})
  );

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await poServices.updatePoStatus (params.inward_po);  // Update PO
      if (response.success === true) {
        toast.success(`PO Successfully Fulfilled!`, {  // Success message
          autoClose: 1500,
          onClose: () => router.replace('/storage/inward_procurement_po'),  // Redirect route
        });
        setFormDisabled(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle key down to focus next input
  const handleKeyDown = (e, inputs) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIndex = inputs.findIndex(input => input.name === e.target.name);
      const nextIndex = currentIndex + 1;

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
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
          <PageTitle pageTitle={'Inward PO:'} paramsData={poById.po_number} />  {/* Title */}
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
                {poById?.qcData && (
                  <div className="flex flex-col gap-2 mb-7">
                    <span> Enter {poById.raw_material_id.material_name} barcodes for - {poById.qcData.passedQcInfo} quantity</span>
                    {[...Array(poById.qcData.passedQcInfo)].map((_, i) => (
                      <div key={i} className="gap-5 flex items-center">
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
                          name={`qc-${poById.qcData.skuCode}-${i}`}  // Field name
                          placeholder={`Enter barcode for ${poById.raw_material_id.sku_code} ${i + 1}`}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            const inputNodes = document.querySelectorAll('input[type="text"]');
                            const inputs = Array.from(inputNodes);

                            handleKeyDown(e, inputs);
                          }}
                        />
                        <ErrorMessage
                          name={`qc-${poById.qcData.skuCode}-${i}`}  // Field name
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-4 p-2 w-[20vw] rounded-md max-w-[20vw] bg-blue-500 text-white"
                  disabled={formDisabled}
                >
                  Fulfill PO
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
