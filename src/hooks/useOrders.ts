import { useState } from "react";
import type { Order } from "@/models/order";
import type { InsuranceInsured } from "@/models/calculate-your-insurance/new-insurance";

interface FilterOrderResponse {
  data: Order[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface NewOrder {
  amount: number;
  currency: string;
  concept: string;
  email: string;
  passengerData: InsuranceInsured[];
  metadata: {
    startDate: string;
    endDate: string;
    pax: number;
    origin: string;
    destination: string;
  };
  createdAt: string;
}

interface CreateOrderResponse {
  sessionId: string;
}

const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createOrder = async (order: NewOrder) => {
    setIsLoading(true);
    setError(null);
    try {
      const createOrderUrl = new URL(
        `${import.meta.env.PUBLIC_STRAPI_URL}/api/orders`,
      );
      const response = await fetch(createOrderUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      const createdOrder = (await response.json()) as CreateOrderResponse;

      return createdOrder;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const getOrderUrl = new URL(
        `${import.meta.env.PUBLIC_STRAPI_URL}/api/orders?filters[stripeId][$eq]=${sessionId}`,
      );

      const response = await fetch(getOrderUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get order details");
      }
      const filterOrderResponse =
        (await response.json()) as FilterOrderResponse;

      const order =
        filterOrderResponse.data?.length && filterOrderResponse.data[0];

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createOrder,
    getOrder,
  };
};

export default useOrders;
