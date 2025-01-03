import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  category_id: Yup.string().required("Category is required"),
    product_id: Yup.string().required("Please choose a Product"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
});


export default validationSchema;
