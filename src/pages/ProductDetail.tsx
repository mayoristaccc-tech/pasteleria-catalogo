import { useParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProductDetail = () => {
    const { id } = useParams();
    const { productos } = useProducts();

    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        return (
            <div className="p-6 text-center">
                <p>Producto no encontrado</p>
                <Link to="/">
                    <Button className="mt-4">Volver al catálogo</Button>
                </Link>
            </div>
        );
    }

    const consultarPorWhatsApp = () => {
        const TU_NUMERO = "541153790146";

        const enlaceProducto = `${window.location.origin}/producto/${producto.id}`;

        const mensajePlano = [
            "Hola! Quiero consultar por este producto:",
            "",
            `🧁 ${producto.nombre}`,
            "",
            "Ver producto:",
            enlaceProducto,
            "",
            "¿Podrían darme más información?"
        ].join("\n");

        const mensajeCodificado = encodeURIComponent(mensajePlano);

        const url = `https://api.whatsapp.com/send?phone=${TU_NUMERO}&text=${mensajeCodificado}`;

        window.open(url, "_blank");
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-xl mx-auto bg-card rounded-xl shadow p-6">
                <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full rounded-lg mb-4"
                />

                <h2 className="text-2xl font-semibold mb-2">
                    {producto.nombre}
                </h2>

                <p className="text-muted-foreground mb-6">
                    {producto.descripcion}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={consultarPorWhatsApp}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Consultar por WhatsApp
                    </Button>

                    <Link to="/" className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver al catálogo
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
