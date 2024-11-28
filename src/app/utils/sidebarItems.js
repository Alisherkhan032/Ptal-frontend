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
    label: "Procurement Team",
    iconKey: "procurement",
    path: "/procurement/raise_vendor_po",
  },

  // storage team
  {
    id: 2,
    label: "Storage Team",
    iconKey: "storage",
    subItems: [
      {
        id: 21,
        label: "Inward procurement PO",
        path: "/storage/inward_procurement_po",
      },
      {
        id: 22,
        label: "Staging Inventory Level",
        path: "/storage/staging_inventory_level",
      },
      {
        id: 23,
        label: "Fulfilled Procurement PO", 
        path: "/storage/fulfilled_procurement_po",
      },
      {
        id: 24,
        label: "Storage inventory level",
        path: "/storage/inventory_level",
      },
      {
        id: 25,
        label: "Storage QC-Fail Inventory",
        path: "/storage/storage_qc_fail_inventory",
      },
      {
        id: 26,
        label: "Outward Assembly Po",
        path: "/storage/outward_assembly_po",
      },
      {
        id: 27,
        label: "Outward Bulk Raw Material Po",
        path: "/storage/outward_bulk_raw_material_po",
      },
      {
        id: 28,
        label: "Outward Raw Materials To Engraving",
        path: "/storage/outward_engraving_order"
      }
    ],
  },

  // assembly team
  {
    id: 3,
    label: "Assembly Team",
    iconKey: "assembly",
    subItems: [
      {
        id: 31,
        label: "Create PO",
        subItems: [
          // Nested subItems
          {
            id: 311,
            label: "Raise SFG PO",
            path: "/assembly/create_po/raise_sfg_po",
          },
          {
            id: 312,
            label: "Raise FG PO",
            path: "/assembly/create_po/raise_fg_po",
          },
        ],
      },

      {
        id: 32,
        label: "View Assembly PO",
        path: "/assembly/view_assembly_po",
      },

      {
        id: 33,
        label: "Generate QR Code",
        path: "/assembly/generate_qr",
      },
      {
        id: 34,
        label: "PO Raised By Inventory Team",
        path: "/assembly/po_raised_by_inventory_team",
      },
    ],
  },

  // inventory Team
  {
    id: 4,
    label: "Inventory Team",
    iconKey: "inventory",
    subItems: [
      {
        id: 11,
        label: "Raise inventory PO",
        path: "/inventory/raise_inventory_po",
      },
      {
        id: 12,
        label: "Inward inventory PO",
        path: "/inventory/inward_inventory_po",
      },
      {
        id: 13,
        label: "Product inventory level",
        path: "/inventory/prouct_inventory_level",
      },
      // {
      //   id: 14,
      //   label: "Outward Picklist",
      //   path: "/inventory/outward_picklist",
      // },
      {
        id: 15,
        label: "Outward Products To Dispatch",
        path: "/inventory/outward_products_to_dispatch",
      },
      {
        id: 16,
        label: "Outward Products To Engraving",
        path : "/inventory/outward_products_to_engraving"
      },
      {
        id: 17,
        label: "Outwarded Products List",
        path: "/inventory/outwarded_products_list",
      }
    ],
  },

    // Engraving Team
    {
      id: 10,
      label: "Engraving Team",
      iconKey: "engraving",
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
    label: "Dispatch Team",
    iconKey: "dispatch",
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
      {
        id: 14,
        label: "Process Order",
        path: "/dispatch/process_order_details",
      },
      {
        id: 15,
        label: "Fulfilled Order Details",
        path: "/dispatch/processed_order_list",
      },
      {
        id: 16,
        label: "Inward Amazon Order CSV",
        path : "/dispatch/inward_amazon_order",
      },
      {
        id: 17,
        label: "Process Amazon Orders",
        path : "/dispatch/process_amazon_orders",
      },
      {
        id : 18,
        label: "Create Engraving Order PO",
        path : "/dispatch/create_engraving_order_po"
      }
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
    label: "Report Team",
    iconKey: "report",
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
    label: "Admin Team",
    iconKey: "admin",
    subItems: [
      {
        id: 72,
        label: "Create Raw Material",
        path: "/admin/create_raw_material",
      },
      {
        id: 72,
        label: "Create Vendor",
        path: "/admin/create_vendor",
      },
      {
        id: 73,
        label: "Create Product",
        path: "/admin/create_product",
      },
      {
        id: 74,
        label: "Raise Bulk Raw Material PO",
        path: "/admin/raise_bulk_raw_material_po",
      },
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
    label: "Custom Order Team",
    iconKey: "custom",
    subItems: [
      {
        id: 81,
        label: "Create Custom Order",
        path: "/b2b/create_custom_order",
      },
      {
        id : 82,
        label : "View Custom Orders",
        path : "/b2b/view_custom_orders"
      },
      {
        id : 83,
        label : "Process Custom Orders",
        path : "/b2b/process_custom_orders"
      },
    ],
  },
  {
    id: 9,
    label: "RTO Team",
    iconKey: "rto",
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
