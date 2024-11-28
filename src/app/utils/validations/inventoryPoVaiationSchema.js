import * as Yup from 'yup';
// this is being used at the qrform
const validationSchema = Yup.object().shape({
  product_id: Yup.string().required(' Please choose a Good'),
  qrQuantity: Yup.number()
    .required('QR quantity is required')
    .positive('QR quantity must be positive'),
});

export default validationSchema;
