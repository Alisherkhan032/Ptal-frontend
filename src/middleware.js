import { NextResponse } from "next/server";

export function middleware(request, response) {
  const url = request.nextUrl.clone();
  let token = request.cookies.get("x-access-token");
  if (!token) {
    if (
      //executive dashboard
      request.nextUrl.pathname.startsWith("/executive/dashboard") ||
      //Inventory Pages 
      request.nextUrl.pathname.startsWith("/inventory/inward_inventory_po") ||
      request.nextUrl.pathname.startsWith("/inventory/prouct_inventory_level") ||
      request.nextUrl.pathname.startsWith("/inventory/raise_inventory_po") ||
      request.nextUrl.pathname.startsWith("/inventory/inward_picklist") ||
      // Storage Pages 
      request.nextUrl.pathname.startsWith("/storage/inventory_level") ||
      request.nextUrl.pathname.startsWith("/storage/inward_procurement_po") ||
      request.nextUrl.pathname.startsWith("/storage/view_batches") ||
      request.nextUrl.pathname.startsWith("/storage/outward_assembly_po") ||
      request.nextUrl.pathname.startsWith("/storage/storage_qc_fail_inventory") ||
      // Procurement Pages 
      request.nextUrl.pathname.startsWith("/procurement/raise_po_form") ||
      request.nextUrl.pathname.startsWith("/procurement/raise_vendor_po") || 
      // Assembly Pages 
      request.nextUrl.pathname.startsWith("/assembly/create_po/raise_sfg_po") || 
      request.nextUrl.pathname.startsWith("/assembly/create_po/raise_fg_po") || 
      request.nextUrl.pathname.startsWith("/assembly/view_assembly_po") || 
      request.nextUrl.pathname.startsWith("/assembly/generate_qr") || 
      request.nextUrl.pathname.startsWith("/assembly/po_raised_by_inventory_team") || 
      // Dispatch Pages
      request.nextUrl.pathname.startsWith("/dispatch/inward_order_list") || 
      request.nextUrl.pathname.startsWith("/dispatch/create_pick_list") ||
      request.nextUrl.pathname.startsWith("/dispatch/process_order") ||
      // Report Pages 
      request.nextUrl.pathname.startsWith("/report/generate_report") ||
      request.nextUrl.pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/login"
    ) {
      return NextResponse.redirect(
        new URL("/storage/inventory_level", request.url)
      );
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/register")
  ) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
  //check
  //check 2
}
