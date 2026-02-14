export enum OrderStatus {
  NEW = 'New',
  FULFILLMENT = 'Fulfillment', // Picklist Created
  PICKED = 'Picked',
  PACKED = 'Packed',
  READY_TO_SHIP = 'Ready to Ship',
  HANDED_OVER = 'Handed Over',
  MANIFESTED = 'Manifest Generated',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed',
  SHIPPED = 'Shipped'
}

export interface OrderItem {
  itemId: string;
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  barcode?: string;
  location: string; // Bin / Rack
  color?: string;
  size?: string;
  scanStatus: 'Pending' | 'Scanned';
}

export interface Order {
  id: string;
  channel: 'Amazon' | 'Flipkart' | 'Shopify' | 'Myntra' | 'AJIO' | 'Manual';
  date: string; // Date & Time
  customerName: string;
  shippingAddress: string;
  phone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'Prepaid' | 'Postpaid';
  priority: 'Normal' | 'Express';
  awb?: string;
  courier?: string;
  picklistId?: string;
  manifestId?: string;
  agingAlert?: boolean;
}

export interface Manifest {
  id: string;
  courier: string;
  date: string;
  orderIds: string[];
  totalOrders: number;
}

export interface Picklist {
  id: string;
  channel?: string;
  date: string;
  orderIds: string[];
  status: 'Pending' | 'In-Progress' | 'Completed';
}

export enum POStatus {
  PO_CREATED = 'PO_CREATED',
  GRN_OPEN = 'GRN_OPEN',
  VERIFIED_QTY = 'VERIFIED_QTY',
  PUTAWAY_CONFIRMED = 'PUTAWAY_CONFIRMED',
  PO_CLOSED = 'PO_CLOSED',
  INVENTORY_UPDATED = 'INVENTORY_UPDATED'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
  PAID = 'Paid'
}

export interface MarketplaceMapping {
  channel: string;
  marketplaceSku: string;
  syncEnabled: boolean;
  lastSyncedAt?: string;
  priceOverride?: number;
  status: 'Linked' | 'Error' | 'Syncing';
}

export interface Product {
  sku: string;
  name: string;
  image: string;
  price: number;
  cost: number;
  stock: number;
  badStock: number;
  inwardStock: number;
  location: string;
  barcode: string;
  listings: Record<string, boolean>;
  mappings?: MarketplaceMapping[];
  size?: string;
  color?: string;
  category?: string;
  vendorName?: string;
  hsnCode?: string;
}

export type UserRole = 'Super Admin' | 'Admin' | 'Warehouse Manager' | 'Inventory Executive' | 'Staff';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'order' | 'alert' | 'info' | 'success';
  read: boolean;
}

export interface BusinessScale {
  isUnlimited: boolean;
  businessType: string;
  region: string;
}

export type PrintType = 'Invoice' | 'Shipping Label' | 'Barcode Label';

export interface PrintField {
  id: string;
  label: string;
  enabled: boolean;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  bold: boolean;
  order: number;
}

export interface PrintTemplate {
  id: string;
  name: string;
  type: PrintType;
  isDefault: boolean;
  pageSize: 'A4' | 'A5' | 'A6' | '4x6' | 'Custom';
  orientation: 'Portrait' | 'Landscape';
  customWidth?: number;
  customHeight?: number;
  margins: { top: number; right: number; bottom: number; left: number };
  fontFamily: string;
  baseFontSize: number;
  fields: PrintField[];
  barcodeEnabled: boolean;
  qrCodeEnabled: boolean;
  staticContent: {
    companyName: string;
    companyAddress: string;
    gstin: string;
    terms: string;
    footerNote: string;
    senderName: string;
    senderPhone: string;
  };
}

export interface PrintSettings {
  templates: PrintTemplate[];
  defaultInvoiceId: string;
  defaultLabelId: string;
  defaultBarcodeId: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  status: 'Active' | 'Inactive';
  address: string;
  gstin?: string;
}

export interface POItem {
  sku: string;
  productName: string;
  barcode: string;
  size?: string;
  color?: string;
  expectedQty: number;
  receivedQty: number; 
  putawayQty: number;
  unit: 'PCS' | 'BOX' | 'KG' | 'SET';
  unitCost: number;
  discountPct: number;
  taxPct: number;
  totalValue: number;
  targetBin?: string;
  supplierSku?: string;
  supplierItemCode?: string;
  supplierItemName?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  date: string;
  status: POStatus;
  items: POItem[];
  subTotal: number;
  taxAmount: number;
  otherCharges: number;
  totalAmount: number;
  expectedDate?: string;
  createdBy: string;
}

export enum ReturnCondition {
  GOOD = 'Good (Resellable)',
  BAD = 'Bad / Damaged',
  USED = 'Used'
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  awb: string;
  sku: string;
  productName: string;
  reason: string;
  status: 'Pending' | 'In-Transit' | 'Received' | 'Partial' | 'Closed' | 'Processed';
  condition?: ReturnCondition;
  date: string;
  expectedQty: number;
  receivedQty: number;
  channel: string;
}

export interface Settlement {
  id: string;
  channel: string;
  date: string;
  totalAmount: number;
  status: 'Reconciled' | 'Mismatch' | 'Pending';
  ordersCount: number;
  fees: {
    commission: number;
    shipping: number;
    collection: number;
    gst: number;
  };
  netExpected: number;
  bankUTR?: string;
  bankCreditAmount?: number;
}

export interface GatePassItem {
  sku: string;
  productName: string;
  quantity: number;
  unit: string;
  isInventoryItem: boolean;
}

export interface GatePass {
  id: string;
  type: 'Outward' | 'Inward';
  isReturnable: boolean;
  personName: string;
  destination: string;
  date: string;
  purpose: string;
  vehicleNumber: string;
  remarks: string;
  items: GatePassItem[];
  issuedBy: string;
  referenceId?: string;
}

export interface UnitBarcode {
  barcode: string;
  sku: string;
  status: 'Inward' | 'Putaway' | 'Sellable';
  grnDate: string;
}

export type ListingStatus = 'Active' | 'Inactive' | 'Error' | 'Pending';

export interface UnitLabel {
    id: string; 
    sku: string;
    productName: string;
    price: number;
    printStatus: boolean;
    poId: string;
    receivedAt: string;
    barcodeNumber: string; // System generated unique barcode number
}