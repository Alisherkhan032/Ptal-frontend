import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  order_id: Yup.string().required("Order ID is required."),
  source_platform: Yup.string().required("Source platform is required."),
  awb_number: Yup.string().required("AWB number is required."),
  logistic_partner: Yup.string().required("Logistic partner is required."),
  quantity: Yup.number()
    .nullable()
    .when("receivedWrongItems", {
      is: false,  // Only required when not receiving wrong items
      then: (schema) => schema.required("Quantity is required."),
    }),
  weight: Yup.number()
    .nullable()
    .when("receivedWrongItems", {
      is: false,
      then: (schema) => schema.required("Weight is required."),
    }),
  images: Yup.array()
    .min(1, "Please upload at least one image.")
    .when("receivedWrongItems", {
      is: true,  // Validate only if 'Received Wrong Items' is checked
      then: (schema) => schema.required("Image upload is required."),
    }),
});

export default validationSchema;