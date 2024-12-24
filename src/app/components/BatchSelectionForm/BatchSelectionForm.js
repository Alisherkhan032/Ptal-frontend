import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  PrimaryButton,
  SecondaryButton,
} from "../ButtonComponent/ButtonComponent";

// Component using JavaScript
const BatchSelectionForm = ({ groupedFields, onSubmit, onCancel }) => {
  // Dynamic validation schema generation
  const generateValidationSchema = () => {
    const schemaFields = {};

    // Create validation rules for each batch field
    Object.entries(groupedFields).forEach(([skuCode, totalQuantity]) => {
      for (let i = 1; i <= totalQuantity; i++) {
        const fieldName = `batch_${skuCode}_${i}`;
        schemaFields[fieldName] = Yup.string().required(
          `Item #${i} code is required`
        );
      }
    });

    return Yup.object().shape(schemaFields);
  };

  // Initial values generation
  const generateInitialValues = () => {
    const initialValues = {};

    // Create initial empty values for each batch field
    Object.entries(groupedFields).forEach(([skuCode, totalQuantity]) => {
      for (let i = 1; i <= totalQuantity; i++) {
        const fieldName = `batch_${skuCode}_${i}`;
        initialValues[fieldName] = "";
      }
    });

    return initialValues;
  };

  const validationSchema = generateValidationSchema();
  const initialValues = generateInitialValues();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, errors, touched }) => (
        <Form className="space-y-4 pb-16">
          {Object.entries(groupedFields).map(([skuCode, totalQuantity]) => (
            <div key={skuCode} className="mb-6">
              <h3 className="text-base font-semibold text-[#111928] mb-6">
                Inward for {skuCode}
              </h3>

              {Array.from({ length: totalQuantity }, (_, idx) => {
                const fieldName = `batch_${skuCode}_${idx + 1}`;
                return (
                  <div key={fieldName} className="mb-2">
                    <label className="block text-[#111928] text-sm font-medium mb-1">
                      Enter code for item# {idx + 1}
                    </label>
                    <Field
                      type="text"
                      name={fieldName}
                      className="w-full border rounded-xl h-10 text-sm p-4"
                      placeholder={`Enter code for item #${idx + 1}`}
                    />
                    {errors[fieldName] && touched[fieldName] && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors[fieldName]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="absolute bottom-0 left-0 w-full border border-t-stroke bg-white p-2">
            <div className="flex gap-x-2">
              <div className="flex-1">
                <SecondaryButton
                  title="Cancel"
                  onClick={onCancel}
                  size='full'
                />
              </div>
              <div className="flex-1">
                <PrimaryButton
                  title="Fulfil"
                  type="submit"
                  size='full'
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BatchSelectionForm;
