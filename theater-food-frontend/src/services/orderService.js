import { collection, doc, setDoc, getDoc, getDocs, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { generateOrderId } from "../utils/idempotency";
import { fetchMenuItems } from "./menuService";

const ORDERS_STORAGE_KEY = "cinema_all_orders";
const CUSTOMERS_STORAGE_KEY = "cinema_all_customers";

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to store orders locally:", err);
  }
}

function getLocalCustomers() {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomers(customers) {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error("Failed to store customers locally:", err);
  }
}

function deriveCustomerSegment(totalOrders, totalSpent, items = []) {
  const hasPopcorn = items.some((i) => i.name?.toLowerCase().includes("popcorn"));
  if (totalSpent >= 1000 || totalOrders >= 4) {
    return "VIP Class";
  }
  if (hasPopcorn || totalOrders >= 2) {
    return "Popcorn Lover";
  }
  const hasFood = items.some((i) => i.name?.toLowerCase().includes("burger") || i.name?.toLowerCase().includes("nachos"));
  const hasDrink = items.some((i) => i.name?.toLowerCase().includes("coke") || i.name?.toLowerCase().includes("water"));
  if (hasFood && !hasDrink) {
    return "Beverage Upgrade";
  }
  return "New Concession Guest";
}

async function syncCustomerRecord(order) {
  if (!order.phone || order.phone === "N/A") return;
  if (!order.whatsappOptIn && !order.marketingOptIn) return;

  const phoneKey = order.phone.replace(/\D/g, "");
  if (!phoneKey) return;

  const customers = getLocalCustomers();
  const existingIdx = customers.findIndex((c) => c.phone === phoneKey);

  const prevOrders = existingIdx >= 0 ? customers[existingIdx].totalOrders : 0;
  const prevSpent = existingIdx >= 0 ? customers[existingIdx].totalSpent : 0;
  const totalOrders = prevOrders + 1;
  const totalSpent = prevSpent + (Number(order.total) || 0);

  const customerRecord = {
    customerId: `CUST-${phoneKey}`,
    name: order.customerName || (existingIdx >= 0 ? customers[existingIdx].name : "Cinema Guest"),
    phone: phoneKey,
    whatsappOptIn: order.whatsappOptIn !== false,
    marketingOptIn: order.marketingOptIn !== false,
    whatsappConsentAt: order.whatsappOptIn ? new Date().toISOString() : null,
    marketingConsentAt: order.marketingOptIn ? new Date().toISOString() : null,
    contactDetailsConfirmed: order.contactDetailsConfirmed === true,
    whatsappUpdatesConfirmed: order.whatsappUpdatesConfirmed === true,
    consentVersion: "2026-09",
    profileSource: "checkout",
    totalOrders,
    totalSpent,
    lastOrderAt: new Date().toISOString(),
    lastSeat: order.seat,
    lastScreen: order.screen,
    segment: deriveCustomerSegment(totalOrders, totalSpent, order.items),
    loyaltyPoints: Math.floor(totalSpent / 10), // 1 point per ₹10 spent
  };

  try {
    const custRef = doc(db, "customers", customerRecord.customerId);
    await setDoc(custRef, customerRecord, { merge: true });
  } catch (err) {
    console.warn("Firestore customer sync fallback:", err.message);
  }

  if (existingIdx >= 0) {
    customers[existingIdx] = { ...customers[existingIdx], ...customerRecord };
  } else {
    customers.unshift(customerRecord);
  }
  saveLocalCustomers(customers);
}

export async function createOrder(orderPayload) {
  const orderId = orderPayload.id || generateOrderId();
  const newOrder = {
    ...orderPayload,
    id: orderId,
    status: orderPayload.status || "RECEIVED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    whatsappOptIn: orderPayload.whatsappOptIn !== false,
    marketingOptIn: orderPayload.marketingOptIn !== false,
  };

  // Attempt Firestore save
  try {
    const orderRef = doc(db, "orders", orderId);
    await setDoc(orderRef, newOrder);
  } catch (error) {
    console.warn("Firestore order save fallback to local storage:", error.message);
  }

  // Save to local storage for instant reactivity
  const orders = getLocalOrders();
  orders.unshift(newOrder);
  saveLocalOrders(orders);

  // Sync to Customer Intelligence
  await syncCustomerRecord(newOrder);

  return newOrder;
}

export async function getOrderById(orderId) {
  try {
    const orderRef = doc(db, "orders", orderId);
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (error) {
    console.warn("Firestore getOrder fallback:", error.message);
  }

  const orders = getLocalOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export async function getAllOrders() {
  try {
    const snap = await getDocs(collection(db, "orders"));
    if (!snap.empty) {
      const orders = [];
      snap.forEach((d) => orders.push(d.data()));
      return orders;
    }
  } catch (err) {
    console.warn("Firestore getAllOrders fallback:", err.message);
  }
  return getLocalOrders();
}

export async function getCustomers() {
  try {
    const snap = await getDocs(collection(db, "customers"));
    if (!snap.empty) {
      const custs = [];
      snap.forEach((d) => custs.push(d.data()));
      return custs;
    }
  } catch (err) {
    console.warn("Firestore getCustomers fallback:", err.message);
  }

  const local = getLocalCustomers();
  if (local.length > 0) return local;

  // Initial seed data for testing
  const seedCustomers = [
    {
      customerId: "CUST-9876543210",
      name: "Rahul Sharma",
      phone: "9876543210",
      whatsappOptIn: true,
      marketingOptIn: true,
      totalOrders: 6,
      totalSpent: 1680,
      lastOrderAt: "Today, 10:32 AM",
      lastSeat: "A12",
      segment: "VIP Class",
      loyaltyPoints: 168,
    },
    {
      customerId: "CUST-9847012345",
      name: "Anjali Nair",
      phone: "9847012345",
      whatsappOptIn: true,
      marketingOptIn: true,
      totalOrders: 3,
      totalSpent: 920,
      lastOrderAt: "Today, 10:28 AM",
      lastSeat: "B08",
      segment: "Popcorn Lover",
      loyaltyPoints: 92,
    },
    {
      customerId: "CUST-9995123456",
      name: "Arjun Verma",
      phone: "9995123456",
      whatsappOptIn: false,
      marketingOptIn: false,
      totalOrders: 1,
      totalSpent: 350,
      lastOrderAt: "Yesterday",
      lastSeat: "C15",
      segment: "Beverage Upgrade",
      loyaltyPoints: 35,
    },
  ];
  saveLocalCustomers(seedCustomers);
  return seedCustomers;
}

export async function getReorderData(orderId) {
  const order = await getOrderById(orderId);
  if (!order || !Array.isArray(order.items)) return null;

  const currentMenu = await fetchMenuItems();

  // Validate each item with current price and availability
  const validatedItems = order.items.map((item) => {
    const liveItem = currentMenu.find((m) => m.id === item.id || m.name === item.name);
    return {
      id: liveItem ? liveItem.id : item.id,
      name: item.name,
      quantity: item.quantity,
      price: liveItem ? liveItem.price : item.price,
      available: liveItem ? liveItem.available !== false : true,
      image: liveItem?.image || item.image || "/images/popcorn.svg",
    };
  });

  return {
    sourceOrderId: order.id,
    seat: order.seat,
    screen: order.screen,
    customerName: order.customerName,
    items: validatedItems,
  };
}

export async function updateOrderStatus(orderId, status) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.warn("Firestore updateStatus fallback:", error.message);
  }

  const orders = getLocalOrders().map((o) =>
    o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
  );
  saveLocalOrders(orders);
}

export function subscribeToOrder(orderId, onUpdate) {
  let localInterval = null;

  const startLocalPolling = () => {
    if (localInterval) return;
    localInterval = setInterval(() => {
      const orders = getLocalOrders();
      const found = orders.find((o) => o.id === orderId);
      if (found) onUpdate(found);
    }, 3000);
  };

  let firestoreUnsub = null;
  try {
    const orderRef = doc(db, "orders", orderId);
    firestoreUnsub = onSnapshot(
      orderRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate({ id: snapshot.id, ...snapshot.data() });
        } else {
          // Doc not in Firestore — rely on local store
          startLocalPolling();
        }
      },
      (error) => {
        // permission-denied or network error with mock key — fall back silently
        console.warn("Firestore subscription unavailable, using local data:", error.code || error.message);
        startLocalPolling();
      }
    );
  } catch (error) {
    console.warn("Firestore onSnapshot not available, polling local orders:", error);
    startLocalPolling();
  }

  // Return unified cleanup
  return () => {
    if (firestoreUnsub) firestoreUnsub();
    if (localInterval) clearInterval(localInterval);
  };
}
