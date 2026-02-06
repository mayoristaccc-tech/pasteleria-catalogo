import { Cake } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-full bg-secondary p-6 shadow-soft">
        <Cake className="h-12 w-12 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">
        Aún no hay productos
      </h3>
      <p className="mt-2 max-w-xs text-muted-foreground">
        Los deliciosos productos de pastelería aparecerán aquí muy pronto.
      </p>
    </div>
  );
};

export default EmptyState;
