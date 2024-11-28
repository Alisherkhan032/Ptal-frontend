'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assemblyPOServices } from '@/app/services/assemblyPO';
import {
  getAssemblyPoByIdFailure,
  getAssemblyPoByIdRequest,
  getAssemblyPoByIdSuccess,
} from '../../../../Actions/assemblyPoActions';
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

// Custom method to validate batch number existence and quantity
Yup.addMethod(Yup.string, 'validBatchNumber', function (batchData, message) {
  return this.test('valid-batch', message || 'Invalid batch number', function (value, context) {
    const { path, createError, parent } = this;
    const enteredBatches = Object.values(parent);
    const batchCount = enteredBatches.reduce((acc, batchNumber) => {
      if (batchNumber === value) {
        acc++;
      }
      return acc;
    }, 0);

    // Check if the batch number exists in batchData
    if (!Object.keys(batchData).includes(value)) {
      return createError({ path, message: "This batch number doesn't exist for this raw material." });
    }

    // Check if the entered batch number exceeds the available quantity
    if (batchCount > batchData[value]) {
      return createError({
        path,
        message: `The available quantity for batch number ${value} is ${batchData[value]}, and you have exceeded it.`,
      });
    }

    return true;
  });
});

const Page = ({ params }) => {
  const { assemblyPOByID } = useSelector((state) => state.assemblyPO);
  const dispatch = useDispatch();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState({});
  const [formDisabled, setFormDisabled] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [batchData, setBatchData] = useState({});

  // Fetch PO details by ID
  const getAssemblyPoById = async () => {
    try {
      dispatch(getAssemblyPoByIdRequest());
      const response = await assemblyPOServices.getAssemblyPoById(params.outward_po);
      if (response.success === true) {
        
        dispatch(getAssemblyPoByIdSuccess(response.data));

        const initialValues = {};
        const assemblyQuantity = response.data.quantity;

        if (assemblyQuantity) {
          for (let i = 0; i < assemblyQuantity; i++) {
            initialValues[`assembly-${response.data.skuCode}-${i}`] = '';
          }
        }

        setInitialValues(initialValues);
        setDataLoaded(true);
      }
    } catch (err) {
      dispatch(getAssemblyPoByIdFailure(err));
    }
  };

  // Fetch batch models by raw material ID
  const getBatchModelsByRawMaterialId = async () => {
    try {
      const response = await batchServices.getBatchTransformedData(assemblyPOByID.raw_material_id._id);
      if (response.success) {
        setBatchData(response.data);
      }
    } catch (error) {
      console.log('error from getBatchModelsByRawMaterialId service=====', error);
    }
  };

  useEffect(() => {
    getAssemblyPoById();
  }, [params.outward_po]);

  useEffect(() => {
    if (dataLoaded) {
      getBatchModelsByRawMaterialId();
    }
  }, [dataLoaded]);

  // Validation schema using the custom Yup method
  const validationSchema = Yup.object().shape(
    Object.keys(initialValues).reduce((acc, fieldName) => {
      acc[fieldName] = Yup.string()
        .required('This field is required')
        .validBatchNumber(batchData, 'This batch number doesn\'t exist for this raw material');
      return acc;
    }, {})
  );

  // To transform the values in key value pairs of batch number and quantity
  const transformBatchData = (values) => {
    const batchCount = {};
  
    Object.values(values).forEach((batchNumber) => {
      if (batchNumber) { // Ensure batchNumber is not empty
        if (!batchCount[batchNumber]) {
          batchCount[batchNumber] = 0;
        }
        batchCount[batchNumber] += 1;
      }
    });
  
    return batchCount;
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    const transformedBatchData = transformBatchData(values);
    try {

      const response =   await assemblyPOServices.updateAssemblyPo(params.outward_po, {
        status: "fulfilled",
        listData: transformedBatchData,
      });
      if (response.success === true) {
        toast.success(`PO Successfully Fulfilled!`, {
          autoClose: 1500,
          onClose: () => router.replace('/storage/outward_assembly_po'),
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
      const currentIndex = inputs.findIndex((input) => input.name === e.target.name);
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
          <PageTitle pageTitle={'Outward Assembly PO:'} paramsData={assemblyPOByID._id} /> {/* Title */}
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
                {assemblyPOByID && (
                  <div className="flex flex-col gap-2 mb-7">
                    <span>
                      Enter {assemblyPOByID.raw_material_id?.material_name} barcodes for -{' '}
                      {assemblyPOByID.quantity} quantity
                    </span>
                    {[...Array(assemblyPOByID.quantity)].map((_, i) => (
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
                          name={`assembly-${assemblyPOByID.skuCode}-${i}`} // Field name
                          placeholder={`Enter barcode for ${assemblyPOByID.raw_material_id?.sku_code} ${i + 1}`}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            const inputNodes = document.querySelectorAll('input[type="text"]');
                            const inputs = Array.from(inputNodes);

                            handleKeyDown(e, inputs);
                          }}
                        />
                        <ErrorMessage
                          name={`assembly-${assemblyPOByID.skuCode}-${i}`} // Field name
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
                  Outward PO
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
