const SALESMEN_STORAGE_KEY = "cinema_salesmen_data";
const SALESMAN_SESSION_KEY = "cinema_salesman_session";
const REVIEWS_STORAGE_KEY = "cinema_reviews_data";

export const initialSalesmen = [
  {
    id: "SM-101",
    name: "Arun Kumar",
    email: "arun@cinema.com",
    password: "password123",
    phone: "+91 98765 43210",
    role: "Senior Concession Salesman",
    active: true,
    assignedScreens: ["Screen 1", "Screen 2", "IMAX Lounge"],
    totalSales: 842500,
    monthlySales: 184200,
    todaySales: 12450,
    totalOrders: 412,
    todayOrders: 24,
    pendingOrders: 6,
    completedOrders: 18,
    rating: 4.9,
    joinedDate: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "SM-102",
    name: "Priya Sundaram",
    email: "priya@cinema.com",
    password: "password123",
    phone: "+91 98451 23456",
    role: "Concession Specialist",
    active: true,
    assignedScreens: ["Screen 3", "Screen 4"],
    totalSales: 615000,
    monthlySales: 132000,
    todaySales: 9800,
    totalOrders: 298,
    todayOrders: 18,
    pendingOrders: 3,
    completedOrders: 15,
    rating: 4.8,
    joinedDate: "2024-03-10",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "SM-103",
    name: "Karthik Raja",
    email: "karthik@cinema.com",
    password: "password123",
    phone: "+91 99944 55667",
    role: "Food Runner & Sales",
    active: true,
    assignedScreens: ["Screen 5", "VIP Balcony"],
    totalSales: 498000,
    monthlySales: 98500,
    todaySales: 7200,
    totalOrders: 240,
    todayOrders: 14,
    pendingOrders: 2,
    completedOrders: 12,
    rating: 4.7,
    joinedDate: "2024-06-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "SM-104",
    name: "Divya Menon",
    email: "divya@cinema.com",
    password: "password123",
    phone: "+91 97890 12345",
    role: "Beverage Barista",
    active: false,
    assignedScreens: ["Cafeteria Bay"],
    totalSales: 210000,
    monthlySales: 0,
    todaySales: 0,
    totalOrders: 95,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    rating: 4.5,
    joinedDate: "2024-08-20",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  }
];

export const initialReviews = [
  {
    id: "REV-201",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    rating: 5,
    orderId: "ORD-1045",
    seat: "A12 (Screen 1)",
    comment: "Super fast delivery right to my seat before the movie started! Popcorn was steaming hot and buttery.",
    date: "2026-09-20 14:32",
    reply: "Thank you Rahul! Glad you enjoyed the popcorn at Screen 1!",
    hidden: false,
    salesman: "Arun Kumar"
  },
  {
    id: "REV-202",
    customerName: "Sneha Patel",
    customerPhone: "9820011223",
    rating: 5,
    orderId: "ORD-1042",
    seat: "C08 (Screen 2)",
    comment: "The Nacho Supreme combo was delicious! Loved the online QR ordering experience.",
    date: "2026-09-20 12:15",
    reply: null,
    hidden: false,
    salesman: "Arun Kumar"
  },
  {
    id: "REV-203",
    customerName: "Vikram Reddy",
    customerPhone: "9940022334",
    rating: 4,
    orderId: "ORD-1039",
    seat: "VIP-04",
    comment: "Good service and clean packaging. Coke could have been a little cooler.",
    date: "2026-09-19 20:45",
    reply: "Thanks for the feedback Vikram! We have shared this with our beverage team.",
    hidden: false,
    salesman: "Karthik Raja"
  },
  {
    id: "REV-204",
    customerName: "Meera Krishnan",
    customerPhone: "9710033445",
    rating: 5,
    orderId: "ORD-1035",
    seat: "B14 (Screen 3)",
    comment: "Very polite staff and received order within 7 minutes. Outstanding service!",
    date: "2026-09-19 18:20",
    reply: "Thank you Meera! Arun and Priya will be thrilled to hear this.",
    hidden: false,
    salesman: "Priya Sundaram"
  }
];

export function getSalesmen() {
  try {
    const raw = localStorage.getItem(SALESMEN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure every salesman has a password field
      let updated = false;
      const normalized = parsed.map((sm) => {
        if (!sm.password) {
          updated = true;
          return { ...sm, password: "password123" };
        }
        return sm;
      });
      if (updated) {
        localStorage.setItem(SALESMEN_STORAGE_KEY, JSON.stringify(normalized));
      }
      return normalized;
    }
  } catch (e) {
    console.warn("Failed reading salesmen from storage:", e);
  }
  localStorage.setItem(SALESMEN_STORAGE_KEY, JSON.stringify(initialSalesmen));
  return initialSalesmen;
}

export function saveSalesmen(list) {
  try {
    localStorage.setItem(SALESMEN_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed saving salesmen:", e);
  }
}

export function setSalesmanPassword(salesmanId, newPassword) {
  try {
    const list = getSalesmen();
    const updated = list.map((sm) => {
      if (sm.id === salesmanId) {
        return { ...sm, password: newPassword };
      }
      return sm;
    });
    saveSalesmen(updated);

    // If active session matches this salesman, update their session password too
    const session = getSalesmanSession();
    if (session && session.id === salesmanId) {
      saveSalesmanSession({ ...session, password: newPassword });
    }
    return updated;
  } catch (e) {
    console.error("Failed updating salesman password:", e);
    return null;
  }
}

export function getSalesmanSession() {
  try {
    const raw = localStorage.getItem(SALESMAN_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return null;
}

export function saveSalesmanSession(salesman) {
  try {
    localStorage.setItem(SALESMAN_SESSION_KEY, JSON.stringify(salesman));
  } catch (e) {
    console.error("Failed saving salesman session:", e);
  }
}

export function clearSalesmanSession() {
  try {
    localStorage.removeItem(SALESMAN_SESSION_KEY);
  } catch (e) {
    // ignore
  }
}

export function getReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed reading reviews:", e);
  }
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(initialReviews));
  return initialReviews;
}

export function saveReviews(list) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed saving reviews:", e);
  }
}
