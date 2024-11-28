import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  inputData: Yup.string().required(" Please choose a Good"),
});

export default validationSchema;
