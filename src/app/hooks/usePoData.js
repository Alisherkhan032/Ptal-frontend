import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { poServices } from '@/app/services/poService';
import { getAllPoRequest, getAllPoSuccess } from '@/app/Actions/poActions';

export const usePoData = () => {
  const dispatch = useDispatch();
  const [statusBarData, setStatusBarData] = useState([
    { value: 0, heading: "Pending PO's" },
    { value: 0, heading: "Items with Over Stock" },
    { value: 0, heading: "Items with Under Stock" },
  ]);

  const getAllPos = async () => {
    try {
      dispatch(getAllPoRequest());
      const response = await poServices.getAllPo();

      if (response.success === true) {
        dispatch(getAllPoSuccess(response.data));

        const poData = response.data;
        let pendingCount = 0;
        let underStockCount = 0;
        let overStockCount = 0;

        poData.forEach((po) => {
          const { current_stock, lower_threshold, upper_threshold } =
            po.raw_material_id;

          if (po.status === "pending") pendingCount++;
          if (current_stock < lower_threshold) underStockCount++;
          if (current_stock > upper_threshold) overStockCount++;
        });

        setStatusBarData([
          { value: pendingCount, heading: "Pending PO's" },
          { value: overStockCount, heading: "Items with Over Stock" },
          { value: underStockCount, heading: "Items with Under Stock" },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllPos();
  }, []);

  return { statusBarData };
};
