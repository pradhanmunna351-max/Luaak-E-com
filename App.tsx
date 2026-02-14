import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import Fulfillment from './components/Fulfillment';
import Returns from './components/Returns';
import Inventory from './components/Inventory';
import Integrations from './components/Integrations';
import ChannelAccess from './components/ChannelAccess';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import CommissionCharges from './components/CommissionCharges';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import GatePassManager from './components/GatePassManager';
import PurchaseOrderComponent from './components/PurchaseOrder';
import BankAccounts from './components/BankAccounts';
import Payments from './components/Payments';
import MobileTerminal from './components/MobileTerminal';
import { Login } from './components/Login';
import { INITIAL_ORDERS, INITIAL_RETURNS, MOCK_PRODUCTS, INITIAL_USERS, generateLiveMarketplaceOrder, INITIAL_SETTLEMENTS } from './constants';
import { Order, OrderStatus, Product, User, Notification, ReturnRequest, PrintSettings, BusinessScale, GatePass, PurchaseOrder, POStatus, POItem, Settlement, ReturnCondition, PrintTemplate, UnitLabel, PaymentStatus } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [returns, setReturns] = useState<ReturnRequest[]>(INITIAL_RETURNS);
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  
  const [allUnitLabels, setAllUnitLabels] = useState<UnitLabel[]>([]);

  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    templates: [],
    defaultInvoiceId: '',
    defaultLabelId: '',
    defaultBarcodeId: ''
  });

  const [businessScale, setBusinessScale] = useState<BusinessScale>({
    isUnlimited: false,
    businessType: 'Retail',
    region: 'India'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!currentUser) return;
    const syncInterval = setInterval(() => {
        const newOrder = generateLiveMarketplaceOrder();
        setOrders(prev => [newOrder, ...prev]);
        const newNotif: Notification = {
            id: `NT-${Date.now()}`,
            title: `Order Received: ${newOrder.channel}`,
            message: `${newOrder.id} for ₹${newOrder.totalAmount} is now in queue.`,
            timestamp: Date.now(),
            type: 'order',
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    }, 20000);
    return () => clearInterval(syncInterval);
  }, [currentUser]);

  const updateInventoryStock = useCallback((sku: string, qty: number, mode: 'add' | 'remove') => {
      setProducts(prev => prev.map(p => {
          if (p.sku === sku) {
              return { ...p, stock: mode === 'add' ? p.stock + qty : p.stock - qty };
          }
          return p;
      }));
  }, []);

  const handleUpdatePOStatus = useCallback((poId: string, status: POStatus, updates?: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, ...updates, status } : p));
  }, []);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  const updateOrderStatus = useCallback((orderIds: string[], status: OrderStatus, picklistId?: string) => {
    setOrders(prev => prev.map(o => {
        if (orderIds.includes(o.id)) {
            if (status === OrderStatus.FULFILLMENT && o.status === OrderStatus.NEW) {
                setProducts(currProducts => currProducts.map(p => {
                    const orderItem = o.items.find(oi => oi.sku === p.sku);
                    if (orderItem) return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
                    return p;
                }));
            }
            return { 
              ...o, 
              status, 
              picklistId: picklistId || o.picklistId 
            };
        }
        return o;
    }));
  }, []);

  const handleLogout = () => setCurrentUser(null);
  const handleLogin = (user: User) => setCurrentUser(user);

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden transition-colors duration-500">
        <Sidebar currentUser={currentUser} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <Header 
            title="Luaak Control" 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            orders={orders} 
            products={products} 
            notifications={notifications} 
            isDarkMode={isDarkMode} 
            onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
          />
          <main className="flex-1 overflow-auto custom-scrollbar relative z-10 px-4 pb-12 mt-1">
            <Routes>
              <Route path="/" element={<Dashboard orders={orders} products={products} returns={returns} />} />
              <Route path="/orders" element={<OrderList orders={orders} products={products} onMoveToFulfillment={(ids, type, pklId) => updateOrderStatus(ids, OrderStatus.FULFILLMENT, pklId)} />} />
              <Route path="/fulfillment" element={<Fulfillment orders={orders} updateOrderStatus={updateOrderStatus} onPrintDocument={()=>{}} />} />
              <Route path="/mobile" element={<MobileTerminal orders={orders} products={products} purchaseOrders={purchaseOrders} updateOrderStatus={updateOrderStatus} updateInventoryStock={updateInventoryStock} onUpdatePOStatus={handleUpdatePOStatus} />} />
              
              <Route path="/purchase-orders/po" element={<PurchaseOrderComponent key="po-workflow" workflowMode="PO" purchaseOrders={purchaseOrders} products={products} onCreatePO={(po)=>setPurchaseOrders([po, ...purchaseOrders])} onUpdatePOStatus={handleUpdatePOStatus} printSettings={printSettings} unitLabels={allUnitLabels} onUpdateUnitLabels={setAllUnitLabels} currentUserName={currentUser?.name || ''} />} />
              <Route path="/purchase-orders/grn" element={<PurchaseOrderComponent key="grn-workflow" workflowMode="GRN" purchaseOrders={purchaseOrders} products={products} onCreatePO={(po)=>setPurchaseOrders([po, ...purchaseOrders])} onUpdatePOStatus={handleUpdatePOStatus} printSettings={printSettings} unitLabels={allUnitLabels} onUpdateUnitLabels={setAllUnitLabels} currentUserName={currentUser?.name || ''} updateInventoryStock={updateInventoryStock} />} />
              <Route path="/purchase-orders/inward" element={<PurchaseOrderComponent key="inward-workflow" workflowMode="Inward" purchaseOrders={purchaseOrders} products={products} onCreatePO={(po)=>setPurchaseOrders([po, ...purchaseOrders])} onUpdatePOStatus={handleUpdatePOStatus} printSettings={printSettings} unitLabels={allUnitLabels} onUpdateUnitLabels={setAllUnitLabels} currentUserName={currentUser?.name || ''} updateInventoryStock={updateInventoryStock} />} />
              
              <Route path="/returns" element={<Returns returns={returns} onProcessReturn={()=>{}} onCreateReturn={()=>{}} />} />
              <Route path="/inventory/mapping" element={<Inventory products={products} vendors={[]} initialTab="Mapping" onAddProduct={(p)=>setProducts([p,...products])} onBulkAddProducts={(ps)=>setProducts([...ps,...products])} printSettings={printSettings}/>} />
              <Route path="/inventory/catalog" element={<Inventory products={products} vendors={[]} initialTab="Catalog" onAddProduct={(p)=>setProducts([p,...products])} onBulkAddProducts={(ps)=>setProducts([...ps,...products])} printSettings={printSettings}/>} />
              <Route path="/inventory/inventory" element={<Inventory products={products} vendors={[]} initialTab="Stock" onAddProduct={(p)=>setProducts([p,...products])} onBulkAddProducts={(ps)=>setProducts([...ps,...products])} printSettings={printSettings}/>} />
              <Route path="/inventory/vendor" element={<Inventory products={products} vendors={[]} initialTab="Vendor" onAddProduct={(p)=>setProducts([p,...products])} onBulkAddProducts={(ps)=>setProducts([...ps,...products])} printSettings={printSettings}/>} />
              <Route path="/gate-pass" element={<GatePassManager gatePasses={gatePasses} products={products} onAddGatePass={(gp)=>setGatePasses([gp, ...gatePasses])} currentUserName={currentUser?.name || ''} />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/channels" element={<ChannelAccess />} />
              <Route path="/analyze" element={<Analytics />} />
              <Route path="/payments" element={<Payments settlements={settlements} orders={orders} />} />
              <Route path="/bank-accounts" element={<BankAccounts />} />
              <Route path="/commissions" element={<CommissionCharges />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UserManagement currentUser={currentUser} users={users} onAddUser={(u)=>setUsers([...users, u])} onUpdateUser={handleUpdateUser} onDeleteUser={(id)=>setUsers(users.filter(us=>us.id!==id))} />} />
              <Route path="/settings" element={<Settings currentUser={currentUser} printSettings={printSettings} onUpdatePrintSettings={setPrintSettings} businessScale={businessScale} onUpdateBusinessScale={setBusinessScale} onUpdateUser={handleUpdateUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;