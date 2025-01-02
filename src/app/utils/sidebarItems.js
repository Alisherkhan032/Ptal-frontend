export const items = [
  // executive team
  {
    id: 11,
    label: "Executive ",
    iconKey: "executive",
    path: "/executive/dashboard",
  },
  // procuremennt team
  {
    id: 1,
    label: "Procurement",
    iconKey: "procurement",
    path: "/procurement/raise_vendor_po",
  },

  // storage team
  {
    id: 2,
    label: "Storage",
    iconKey: "storage",
    path: "/storage/inward_procurement_po",
    subItems: [
      {
        id: 22,
        label: "Inward Procurement PO", 
        path: "/storage/inward_procurement_po",
        iconKey: "inwardPo"
      },
      {
        id: 23,
        label: "Fulfilled Procurement PO", 
        path: "/storage/fulfilled_procurement_po",
        iconKey: "fulfilledPo"
      },
      {
        id: 24,
        label: "Storage inventory level",
        path: "/storage/inventory_level",
        iconKey: "inventoryLevel"
      },
      {
        id: 25,
        label: "Storage QC-Fail Inventory",
        path: "/storage/storage_qc_fail_inventory",
        iconKey: "qcFail"
      },
      {
        id: 26,
        label: "Outward Assembly Po",
        path: "/storage/outward_assembly_po",
        iconKey: "outwardPo"
      },
      {
        id: 27,
        label: "Outward Bulk Raw Material Po",
        path: "/storage/outward_bulk_raw_material_po",
        iconKey: "outwardPo"
      },
      {
        id: 28,
        label: "Outward Raw Materials To Engraving",
        path: "/storage/outward_engraving_order",
        iconKey: "inventoryLevel"
      }
    ],    
  },

  // assembly team
  {
    id: 3,
    label: "Assembly",
    iconKey: "assembly",
    path: "/assembly/po_raised_by_inventory_team",
    subItems: [
      // {
      //   id: 31,
      //   label: "Create PO",
      //   subItems: [
      //     // Nested subItems
      //     // {
      //     //   id: 311,
      //     //   label: "Raise SFG PO",
      //     //   path: "/assembly/create_po/raise_sfg_po",
      //     // },
      //     // {
      //     //   id: 312,
      //     //   label: "Raise FG PO",
      //     //   path: "/assembly/create_po/raise_fg_po",
      //     // },
      //   ],
      // },
      {
        id: 31,
        label: "Inventory PO",
        path: "/assembly/po_raised_by_inventory_team",
        iconKey: "outwardPo"
      },
      {
        id: 32,
        label: "Assembly PO",
        path: "/assembly/view_assembly_po",
        iconKey: "inwardPo"
      },

      // {
      //   id: 33,
      //   label: "Generate QR Code",
      //   path: "/assembly/generate_qr",
      // },
      
    ],
  },

  // inventory Team
  {
    id: 4,
    label: "Inventory",
    iconKey: "inventory",
    path: "/inventory/inward_inventory_po",
    subItems: [
      // {
      //   id: 11,
      //   label: "Raise inventory PO",
      //   path: "/inventory/raise_inventory_po",
      // },
      {
        id: 12,
        label: "Inward inventory PO",
        path: "/inventory/inward_inventory_po",
        iconKey : "inwardPo"
      },
      {
        id: 13,
        label: "Product inventory level",
        path: "/inventory/product_inventory_level",
        iconKey : "inwardPo"
      },
      // {
      //   id: 14,
      //   label: "Outward Picklist",
      //   path: "/inventory/outward_picklist",
      // },
      // {
      //   id: 15,
      //   label: "Outward Products To Dispatch",
      //   path: "/inventory/outward_products_to_dispatch",
      //   iconKey : "inwardPo"
      // },
      {
        id: 16,
        label: "Outward Products To Engraving",
        path : "/inventory/outward_products_to_engraving",
        iconKey : "inwardPo"
      },
      {
        id: 17,
        label: "Outwarded Products List",
        path: "/inventory/outwarded_products_list",
        iconKey : "inwardPo"
      }
    ],
  },

    // Engraving Team
    {
      id: 10,
      label: "Engraving",
      iconKey: "engraving",
      path: "/engraving/view_engraving_order",
      subItems: [
        {
          id: 101,
          label: "View and Process Engraving Orders",
          path: "/engraving/view_engraving_order",
        },
        {
          id: 102,
          label: "Engraving Inventory Level",
          path: "/engraving/engraving_inventory_list",
        }

      ]
    },

  // dispatch team
  {
    id: 5,
    label: "Dispatch",
    iconKey: "dispatch",
    path: "/dispatch/processed_order_list",
    subItems: [
      // {
      //   id: 11,
      //   label: "Inward Order List",
      //   path: "/dispatch/inward_order_list",
      // },
      // // {
      // //   id: 12,
      // //   label: "Create Pick List",
      // //   path: "/dispatch/create_pick_list",
      // // },
      // {
      //   id: 13,
      //   label: "Process Orders",
      //   path: "/dispatch/process_order",
      // },
      // {
      //   id: 14,
      //   label: "Process Order",
      //   path: "/dispatch/process_order_details",
      // },
      {
        id: 15,
        label: "Fulfilled Order Details",
        path: "/dispatch/processed_order_list",
      },
      // {
      //   id: 16,
      //   label: "Inward Amazon Order CSV",
      //   path : "/dispatch/inward_amazon_order",
      // },
      // {
      //   id: 17,
      //   label: "Process Amazon Orders",
      //   path : "/dispatch/process_amazon_orders",
      // },
      // {
      //   id : 18,
      //   label: "Create Engraving Order PO",
      //   path : "/dispatch/create_engraving_order_po"
      // }
      // {
      //   id : 16,
      //   label : "View Custom Orders",
      //   path : "/dispatch/view_custom_orders"
      // },
      // {
      //   id : 17,
      //   label : "Process Custom Orders",
      //   path : "/dispatch/process_custom_orders"
      // }
      
    ],
  },


  // report team
  {
    id: 6,
    label: "Report",
    iconKey: "report",
    path: "/report/generate_report",
    subItems: [
      {
        id: 61,
        label: "Generate Report",
        path: "/report/generate_report",
      },
    ],
  },

  // admin team
  {
    id: 7,
    label: "Admin",
    iconKey: "admin",
    path: "/admin/view_bulk_raw_material_po",
    subItems: [
      // {
      //   id: 72,
      //   label: "Create Raw Material",
      //   path: "/admin/create_raw_material",
      // },
      // {
      //   id: 72,
      //   label: "Create Vendor",
      //   path: "/admin/create_vendor",
      // },
      // {
      //   id: 73,
      //   label: "Create Product",
      //   path: "/admin/create_product",
      // },
      // {
      //   id: 74,
      //   label: "Raise Bulk Raw Material PO",
      //   path: "/admin/raise_bulk_raw_material_po",
      // },
      {
        id: 75,
        label: "View Bulk Raw Material PO",
        path: "/admin/view_bulk_raw_material_po",
      },
    ],
  },
  // b2b team
  {
    id: 8,
    label: "Custom Order",
    iconKey: "custom",
    path : "/b2b/view_custom_orders",
    subItems: [
      // {
      //   id: 81,
      //   label: "Create Custom Order",
      //   path: "/b2b/create_custom_order",
      // },
      {
        id : 82,
        label : "View Custom Orders",
        path : "/b2b/view_custom_orders"
      },
      // {
      //   id : 83,
      //   label : "Process Custom Orders",
      //   path : "/b2b/process_custom_orders"
      // },
    ],
  },
  {
    id: 9,
    label: "RTO",
    iconKey: "rto",
    path: "/rto/inwarded_rto_order_details",
    subItems: [
      {
        id: 91,
        label: "Inward RTO Order",
        path: "/rto/inward_rto_order",
      },
      {
        id : 92,
        label: "Inwarded RTO Order Details",
        path: "/rto/inwarded_rto_order_details",
      }
    ]

  },
];
