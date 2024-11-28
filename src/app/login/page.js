"use client";
import React, { useState } from "react";
import Image from "next/image";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Dropdown from "../components/Dropdown/Dropdown";
import {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  setToken,
} from "../Actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { authServices } from "../services/authService";
import { loginSchema } from "../utils/validations/authValiationSchema.js";
import { setCookie } from "cookies-next";

const Page = () => {
  const options = ["Karshini Artysun Pvt Ltd "];

  // State variables for form data
  const [formData, setFormData] = useState({
    warehouse: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginEmailPassError, setLoginEmailPassError] = useState("");
  console.log("loginEmailPassError===", loginEmailPassError);
  const route = useRouter();
  const dispatch = useDispatch();
  console.log("formData===", formData);
  // Handler to update form data state

  const validateField = async (fieldName, value, schema) => {
    try {
      await schema.validateAt(fieldName, { [fieldName]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: err.message,
      }));
    }
  };

  const handleChange = (event) => {
    setLoginEmailPassError("");

    console.log("i ran ===");
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value, loginSchema);
  };

  // Handler to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData===", formData); // You can perform further actions here

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      dispatch(userLoginRequest());
      const response = await authServices.siginUser(formData);
      console.log("siginResponse===", response);
      if (response.success === true) {
        dispatch(userLoginSuccess(response));
        setCookie("x-access-token", response.token);
        dispatch(setToken(response.token));
        localStorage.setItem("x-access-token", response.token);
        route.push("/storage/inventory_level");
      }
      if (response.success === false) {
        setLoginEmailPassError(response.message);
      }
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError") {
        const ValidationError = {};
        err.inner.forEach((error) => {
          ValidationError[error.path] = error.message;
        });
        setErrors(ValidationError);
      }
    }
  };

  return (
    <div className="flex flex-row w-full h-screen justify-between">
      {/* left container */}
      <div className="flex flex-col items-center w-[48vw] h-full bg-[rgb(218,211,195)]">
        <div className="mt-[10vw] w-[27vw] flex flex-col items-center justify-center">
          <div className="">
            <Image alt="" width={180} height={40} src={"/logo.svg"} />
          </div>
          <div className="mt-[1.7vw]">
            <span className="text-[2.5vw]  text-[rgb(41,39,36)] font-bold">
              Fillflow - IMS
            </span>
          </div>
          <div className="mt-[2.7vw]">
            <p className=" text-[1.5vw] text-[rgb(41,39,36)] font-semibold text-center">
              An Inventory Management Platform We take care of your goods
            </p>
          </div>
        </div>
      </div>
      {/* right container */}
      <div className="flex flex-col items-center w-[53vw] h-full">
        <div className=" flex flex-col mt-[6vw] items-center w-[32vw] h-full ">
          <div className="flex flex-col items-center gap-[0.5vw] w-full ">
            <span className="text-[1.8vw] font-medium ">
              Sign In to Fillflow IMS
            </span>
            <span className="text-[1.2vw] text-[rgb(181,176,161)]  font-semibold">
              New Here?{" "}
              <span className="text-[rgb(79,201,218)]">Reach out to us</span>
            </span>
          </div>
          {/* form */}
          <form
            className="mt-[2vw] gap-[2vw]  w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full ">
              <label className="text-[1.1vw] font-medium">Warehouse</label>
              <Dropdown
                bgColor={"#F8F6F2"}
                options={options}
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-[1.1vw] font-medium">Email</label>
              <Input
                bgColor={"bg-[#F8F6F2]"}
                radius={"rounded-lg"}
                height={"h-[3.5vw] min-h-[3.5vh]"}
                padding={"p-[1vw]"}
                type={"text"}
                color={"text-[#838481]"}
                textSize={"text-[1vw]"}
                fontWeight={"font-medium"}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label className="text-[1.1vw] font-medium">Password</label>
              <Input
                bgColor={"bg-[#F8F6F2]"}
                radius={"rounded-lg"}
                height={"h-[3.5vw] min-h-[3.5vh]"}
                padding={"p-[1vw]"}
                type={"password"}
                color={"text-[#838481]"}
                textSize={"text-[1vw]"}
                fontWeight={"font-medium"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className=" text-xs mt-1 ml-1 flex items-start text-start text-red-500">
                  {errors.password}
                </p>
              )}
              <p className="  text-xs mt-2 ml-1 flex items-start justify-center text-start text-red-500">
                {loginEmailPassError}
              </p>
            </div>
            <div className="w-full mt-[2vw]">
              <Button
                title={"Continue"}
                bgColor={"bg-[rgb(79,201,218)]"}
                radius={"rounded-lg"}
                height={"h-[3.5vw] min-h-[3.5vh]"}
                width={"w-full"}
                padding={"p-[1vw]"}
                type={"submit"}
                color={"text-[#ffff]"}
                textSize={"text-[1vw]"}
                fontWeight={"font-medium"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
