  import { useEffect, useState } from "react";
  import { useDispatch } from "react-redux";
  import { poServices } from '@/app/services/poService';
  import { getAllPoRequest, getAllPoSuccess } from '@/app/Actions/poActions';

  export const usePoData = () => {
    const [poData, setPoData] = useState([]);

    const dispatch = useDispatch();
    const getAllPos = async () => {
      try {
        dispatch(getAllPoRequest());
        const response = await poServices.getAllPo();

        if (response.success === true) {
          dispatch(getAllPoSuccess(response.data));
          setPoData(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      getAllPos();
    }, []);

    return poData;
  };
