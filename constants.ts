
import { Order, OrderStatus, Product, User, Vendor, ReturnRequest, Settlement } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { sku: 'TSH-BLK-M', name: 'Classic T-Shirt', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400', price: 999, cost: 450, stock: 124, badStock: 0, inwardStock: 0, location: 'A1-02-B', barcode: '8901234567890', size: 'M', color: 'Black', listings: { amazon: true, flipkart: true } },
  { sku: 'DNM-BLU-32', name: 'Slim Fit Denims', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', price: 2499, cost: 1100, stock: 85, badStock: 0, inwardStock: 0, location: 'B2-04-A', barcode: '8901234567891', size: '32', color: 'Blue', listings: { flipkart: true, ajio: true } }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-88291',
    channel: 'Amazon',
    date: new Date(Date.now() - 7200000).toISOString(),
    customerName: 'Sameer Khan',
    shippingAddress: 'Andheri West, Mumbai, MH, 400053',
    phone: '+91 98200 11223',
    totalAmount: 999,
    status: OrderStatus.NEW,
    paymentMethod: 'Prepaid',
    priority: 'Normal',
    items: [{
        itemId: 'ITEM-UNIT-44021',
        sku: 'TSH-BLK-M',
        productName: 'Classic T-Shirt',
        color: 'Black',
        size: 'M',
        quantity: 1,
        price: 999,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100',
        location: 'A1-02-B',
        scanStatus: 'Pending'
    }]
  }
];

export const generateLiveMarketplaceOrder = (): Order => {
  const channels: Array<'Amazon' | 'Flipkart' | 'Shopify' | 'Myntra' | 'AJIO'> = ['Amazon', 'Flipkart', 'Shopify', 'Myntra', 'AJIO'];
  const customers = ['Amit Sharma', 'Priya Das', 'Sandeep Vohra', 'Neha Kapoor', 'Vikram Singh', 'Anjali Iyer'];
  const items = [
    { sku: 'TSH-BLK-M', name: 'Classic Essential Tee', price: 1299, color: 'Black', size: 'M' },
    { sku: 'DNM-BLU-32', name: 'Streetwear Denim', price: 2999, color: 'Blue', size: '32' },
    { sku: 'JKT-OLV-L', name: 'Utility Field Jacket', price: 4500, color: 'Olive', size: 'L' },
    { sku: 'SNE-WHT-09', name: 'Core Low Sneakers', price: 3999, color: 'White', size: '9' }
  ];
  
  const randomChannel = channels[Math.floor(Math.random() * channels.length)];
  const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
  const randomItem = items[Math.floor(Math.random() * items.length)];
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const itemId = `UNIT-${Math.floor(50000 + Math.random() * 50000)}`;

  return {
    id: orderId,
    channel: randomChannel,
    date: new Date().toISOString(),
    customerName: randomCustomer,
    shippingAddress: 'Sector 44, Gurgaon, Haryana, 122003',
    phone: '+91 99887 76655',
    totalAmount: randomItem.price,
    status: OrderStatus.NEW,
    paymentMethod: Math.random() > 0.4 ? 'Prepaid' : 'Postpaid',
    priority: Math.random() > 0.8 ? 'Express' : 'Normal',
    items: [{
      itemId: itemId,
      sku: randomItem.sku,
      productName: randomItem.name,
      quantity: 1,
      price: randomItem.price,
      color: randomItem.color,
      size: randomItem.size,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
      location: `A${Math.floor(Math.random()*9)}-${Math.floor(Math.random()*99)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      scanStatus: 'Pending'
    }]
  };
};

export const INITIAL_USERS: User[] = [{ id: 'u1', name: 'Admin', role: 'Super Admin', avatar: 'AD', username: 'admin', password: '123' }];
export const MOCK_VENDORS: Vendor[] = [];
export const INITIAL_RETURNS: ReturnRequest[] = [];
export const INITIAL_SETTLEMENTS: Settlement[] = [];
