import { combineReducers } from "redux";

import { authReducer } from "./authReducer";
import { poReducer } from "./poReducer";
import { vendorReducer } from "./vendoReducer";
import { categoryReducer } from "./categoryReducer";
import { materialReducer } from "./materialReducer";
import { productReducer } from "./productReducer";
import { dropValueReducer } from "./dropDownValueReducer";
import { batchReducer } from "./batchReducer";
import { assemblyPoReducer } from "./assemblyPoReducer";
import { inventoryPoReducer } from "./inventoryPoReducer";
import { orderReducer } from "./orderReducer";
import { pickListReducer } from "./pickListReducer";
import { bulkRawMaterialPORReducer } from "./bulkRawMaterialPORReducer";
import { orderDetailReducer } from "./orderDetailReducer";
import { rtoOrderReducer } from "./rtoOrderReducer";
import { outwardedProductsReducer } from "./outwardedProductsReducer";
import { engravingOrderReducer } from "./engravingOrderReducer";


export const rootReducer = combineReducers({
  auth: authReducer,
  po: poReducer,
  vendor: vendorReducer,
  category: categoryReducer,
  material: materialReducer,
  product: productReducer,
  dropdown: dropValueReducer,
  batch: batchReducer,
  assemblyPO: assemblyPoReducer,
  inventoryPo: inventoryPoReducer,
  order: orderReducer,
  pickList: pickListReducer,
  bulkRawMaterialPO : bulkRawMaterialPORReducer,
  orderDetail: orderDetailReducer,
  rtoOrder: rtoOrderReducer,
  outwardedProducts: outwardedProductsReducer,
  engravingOrder: engravingOrderReducer,

});
