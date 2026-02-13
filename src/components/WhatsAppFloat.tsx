import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const TU_NUMERO = "541153790146";

  const mensaje = encodeURIComponent(
    "Hola! Quiero hacer una consulta sobre sus productos 🧁"
  );

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${TU_NUMERO}&text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-white shadow-lg transition hover:bg-green-700"
    >
      <MessageCircle className="h-5 w-5" />
      Hacer pedido
    </a>
  );
};

export default WhatsAppFloat;
