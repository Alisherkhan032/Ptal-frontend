import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  //   warehouse_id: Yup.string().required("Warehouse ID is required"),
  vendor_id: Yup.string().nullable().required("Please choose a vendor"),
  //   category: Yup.string().nullable().required("Please choose a category"),

  raw_material_id: Yup.string().required(" Please choose a Product"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive"),
  weight: Yup.number()
    .required("Weight is required")
    .positive("Weight must be positive"),
    bill_number: Yup.string()
    .required("Bill Number is required")
});

export default validationSchema;
