import {
  Clock3,
  ChefHat,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

const statusConfig = {
  RECEIVED: {
    label: "Received",
    icon: Clock3,
    className: "received",
  },

  PREPARING: {
    label: "Preparing",
    icon: ChefHat,
    className: "preparing",
  },

  READY: {
    label: "Ready",
    icon: CheckCircle2,
    className: "ready",
  },

  DELIVERED: {
    label: "Delivered",
    icon: Truck,
    className: "delivered",
  },

  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "cancelled",
  },
};

export default function OrderStatusBadge({ status }) {
  const config =
    statusConfig[status] || statusConfig.RECEIVED;

  const Icon = config.icon;

  return (
    <span
      className={`order-status-badge ${config.className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
}