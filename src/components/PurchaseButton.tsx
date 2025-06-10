"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { purchaseTicketAction } from "@/app/actions/ticketActions";

interface PurchaseButtonProps {
  eventId: string;
  isSoldOut: boolean;
}

export default function PurchaseButton({
  eventId,
  isSoldOut,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handlePurchase = async () => {
    setIsLoading(true);
    setMessage(null);
    setIsSuccess(null);

    const result = await purchaseTicketAction(eventId);

    setIsLoading(false);

    if (
      typeof result === "object" &&
      result !== null &&
      "success" in result &&
      "message" in result
    ) {
      setMessage(result.message);
      setIsSuccess(result.success);

      if (result.success) {
        setTimeout(() => {
          router.push("/dashboard/my-tickets");
        }, 2000);
      }
    } else {
      setMessage("Ocurrió una respuesta inesperada del servidor.");
      setIsSuccess(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <p className="text-xl font-bold text-green-600">{message}</p>
        <p className="mt-2 text-gray-600">
          Serás redirigido a "Mis Boletos" en un momento...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handlePurchase}
        disabled={isSoldOut || isLoading}
        className="w-full md:w-auto px-12 py-4 text-xl font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading
          ? "Procesando..."
          : isSoldOut
          ? "Boletos Agotados"
          : "Comprar Boleto Ahora"}
      </button>
      {message && !isSuccess && (
        <p className="mt-4 font-semibold text-red-600">{message}</p>
      )}
    </div>
  );
}
