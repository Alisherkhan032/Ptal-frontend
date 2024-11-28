'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import { 
    getOrderByOrderIdFailure,
    getOrderByOrderIdRequest,
    getOrderByOrderIdSuccess,
} from '@/app/Actions/orderActions'; 
import { orderServices } from '@/app/services/oderService';
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

const ProcessCustomOrders = () => {
  const [orderID, setOrderID] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [formDisabled, setFormDisabled] = useState(false);
  const [allQrCodeRecords, setAllQrCodeRecords] = useState([]);
  const [validationSchema, setValidationSchema] = useState(Yup.object());
  const [selectedProducts, setSelectedProducts] = useState({});
const [quantitySelections, setQuantitySelections] = useState({});

const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);




  const dispatch = useDispatch();

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
          ;
        return acc;
      }, {})
    );

    setValidationSchema(schema);
  }, [initialValues, allQrCodeRecords]);

  // Handling input change for orderID
  const handleInputChange = (e) => {
    setOrderID(e.target.value);
  };

  const handleKeyDown = (e, currentIndex, inputs) => {
    if (e.key === 'Enter') {
      e.preventDefault();
        if (currentIndex < inputs.length - 2) {
          inputs[currentIndex + 2].focus();
        }
    }
  };

  const handleGetDetails = async () => {
    if (!orderID) return;
  
    setLoading(true);
    dispatch(getOrderByOrderIdRequest());
  
    try {
      const response = await orderServices.getOrderByOrderId(orderID);
      if (response.success) {
        const data = response.data;
  
        if (data.status === 'shipped') {
          setIsModalOpen(true);  // Use the original modal for status messages
          setModalMessage('The order has already been shipped.');
          setLoading(false);
          return;
        }
  
        setOrderDetails(data);
        setIsProductSelectionOpen(true);  // Open the new modal for product selection
        dispatch(getOrderByOrderIdSuccess(data));
      } else {
        setIsModalOpen(true);  // Handle errors with the original modal
        setModalMessage(response.message || 'Failed to fetch order details.');
        dispatch(getOrderByOrderIdFailure(response.message));
      }
    } catch (error) {
      dispatch(getOrderByOrderIdFailure(error.message));
    } finally {
      setLoading(false);
    }
  };
  

  // Generate form fields based on the fetched order details
  const generateFormFields = (order) => {
    const initial = {};
  
    // Iterate through the listOfProducts
    order.listOfProducts.forEach((product, index) => {
      // For each product, create fields based on the quantity
      for (let i = 0; i < product.quantity; i++) {
        // Generate a field name with the format: `${skuCode}-${i}`
        initial[`${product.skuCode}-${i + 1}`] = '';
      }
    });
  
    // Set the initial values for the form and make the form visible
    setInitialValues(initial);
    setFormVisible(true);
  };

  const handleProductSelection = (isSelected, skuCode) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [skuCode]: isSelected,
    }));
  
    if (!isSelected) {
      setQuantitySelections((prev) => {
        const newSelections = { ...prev };
        delete newSelections[skuCode];
        return newSelections;
      });
    }
  };
  
  const handleQuantitySelection = (skuCode, quantity) => {
    setQuantitySelections((prev) => ({
      ...prev,
      [skuCode]: parseInt(quantity, 10),
    }));
  };

  
  const generateFormFieldsBasedOnSelection = () => {
    console.log ("Heree !!!!")
    const initial = {};
      // Check if the selection logic works as expected
      console.log("Selected Products:", selectedProducts);
      console.log("Quantity Selections:", quantitySelections);
  
    Object.entries(selectedProducts).forEach(([skuCode, isSelected]) => {
      if (isSelected) {
        const quantity = quantitySelections[skuCode] || 0;
        for (let i = 0; i < quantity; i++) {
          initial[`${skuCode}-${i + 1}`] = '';
        }
      }
    });
  
    setInitialValues(initial);
    setFormVisible(true);
    setIsProductSelectionOpen(false);
  };
  

const handleSubmit = async (values, actions) => {
    setLoading(true);
    try {
      const qrCodes = {};
      Object.keys(values).forEach(key => {
        qrCodes[key] = values[key];
      });
  
      // Send the QR codes and order ID
      const response = await orderServices.fulfillOrderByOrderId(qrCodes, orderDetails.orderId); // Pass orderId here
  
      if (response && response.success) { // Ensure response is defined before accessing
        toast.success('Order Successfully Processed!', {
          autoClose: 1500,
          onClose: () => window.location.reload(),
        });
        setFormDisabled(true);
      } else {
        toast.error('Failed to process order: ' + (response ? response.error : 'Unknown error'), {
          autoClose: 3000,
        });
        setFormDisabled(true);
      }
    } catch (error) {
      console.error('Error processing order:', error.message);
      toast.error('Failed to process order: ' + error.message, {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('Modal Open State:', isProductSelectionOpen);

  
  return (
    <div className="flex flex-col w-full">
      <ToastContainer />
      <div className="flex gap-16">
        <div>
          <label>Enter Order ID :</label>
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
            name={'orderID'}
            placeholder={`Enter Order ID`}
            value={orderID}
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

    
{/* Conditional rendering for Formik form */}
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

      {/* Original modal for error/status messages */}
<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  message={modalMessage} 
/>

{/* New modal for product/quantity selection */}
{/* New modal for product/quantity selection */}
<Modal 
  isOpen={isProductSelectionOpen} 
  onClose={() => setIsProductSelectionOpen(false)}
>
  <div className="max-w-lg"> {/* Widen the modal */}
    <h2 className="text-xl font-bold mb-4">Select Products to Process</h2>
    
    {orderDetails?.listOfProducts
      .filter((product) => {
        // Calculate fulfilled quantity, defaulting to 1 if undefined
        const fulfilledQty = product.fulfilledQuantity !== undefined ? product.fulfilledQuantity : 0;
        // Show the product only if it's not fully fulfilled
        return fulfilledQty < product.quantity;
      })
      .map((product) => {
        const fulfilledQty = product.fulfilledQuantity !== undefined ? product.fulfilledQuantity : 0;
        const maxQuantity = product.quantity - fulfilledQty; // Calculate max selectable quantity
        
        return (
          <div key={product.skuCode} className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  handleProductSelection(e.target.checked, product.skuCode)
                }
              />
              <span>{product.skuCode}</span>
            </label>

            {selectedProducts[product.skuCode] && (
              <div className="mt-2 flex items-center">
                <label className="mr-2">Choose Quantity:</label>
                <input
                  type="text"
                  maxLength={String(maxQuantity).length} // Limit input length to max quantity digits
                  value={quantitySelections[product.skuCode] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update state if value is numeric and within limit
                    if (/^\d*$/.test(value) && (parseInt(value) <= maxQuantity || value === '')) {
                      handleQuantitySelection(product.skuCode, value);
                    }
                  }}
                  className="border rounded px-2 py-1 w-24" // Added width for the input
                  placeholder={`Max: ${maxQuantity}`} // Show max quantity in placeholder
                />
              </div>
            )}
          </div>
        );
      })}

    <div className="flex justify-center mt-6" onClick={generateFormFieldsBasedOnSelection}>
      <Button
        title="Confirm Selection"
        bgColor="bg-green-500"
        color="text-white"
        radius="rounded-lg"
        width="w-full"
        height={'h-[3.5vw] min-h-[3.5vh]'}
        style={{ border: '2px solid red !important' }}  // Force the red border to display
        // Add a red border for visibility
      />
    </div>
  </div>
</Modal>




{formDisabled && (
  <div
    className="fixed top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-50"
    style={{ zIndex: 1000 }}
  />
)}

    </div>
  );
};

export default ProcessCustomOrders;
