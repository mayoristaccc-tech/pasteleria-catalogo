import { useState, useEffect } from "react";
import { X, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aboutText: string;
  onSave: (text: string) => void;
  modoCreador: boolean;
}

const AboutUsModal = ({
  isOpen,
  onClose,
  aboutText,
  onSave,
  modoCreador,
}: AboutUsModalProps) => {
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState(aboutText);

  useEffect(() => {
    setTextoEditado(aboutText);
  }, [aboutText]);

  if (!isOpen) return null;

  const handleGuardar = () => {
    onSave(textoEditado);
    setEditando(false);
  };

  const handleCancelar = () => {
    setTextoEditado(aboutText);
    setEditando(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-elegant animate-in fade-in zoom-in-95">
        {/* Encabezado */}
        <div className="border-b border-border bg-secondary/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Sobre Nosotros
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {editando ? (
            <Textarea
              value={textoEditado}
              onChange={(e) => setTextoEditado(e.target.value)}
              className="min-h-[200px] resize-none border-primary/30 focus:border-primary"
              placeholder="Escribe la historia de tu negocio..."
            />
          ) : (
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {aboutText}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="border-t border-border bg-secondary/30 px-6 py-4">
          {modoCreador && (
            <div className="flex justify-end gap-3">
              {editando ? (
                <>
                  <Button variant="outline" onClick={handleCancelar}>
                    Cancelar
                  </Button>
                  <Button onClick={handleGuardar} className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setEditando(true)}
                  className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar Historia
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;
