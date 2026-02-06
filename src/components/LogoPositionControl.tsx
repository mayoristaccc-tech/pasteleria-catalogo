import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LogoPosition {
  x: number; // -100 a 100 (porcentaje)
  y: number; // -100 a 100 (porcentaje)
}

interface LogoPositionControlProps {
  position: LogoPosition;
  onPositionChange: (position: LogoPosition) => void;
  onReset: () => void;
}

const LogoPositionControl = ({
  position,
  onPositionChange,
  onReset,
}: LogoPositionControlProps) => {
  const step = 10;

  const moveUp = () => {
    onPositionChange({ ...position, y: Math.max(-100, position.y - step) });
  };

  const moveDown = () => {
    onPositionChange({ ...position, y: Math.min(100, position.y + step) });
  };

  const moveLeft = () => {
    onPositionChange({ ...position, x: Math.max(-100, position.x - step) });
  };

  const moveRight = () => {
    onPositionChange({ ...position, x: Math.min(100, position.x + step) });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-background/80 p-1 backdrop-blur-sm">
      <span className="px-2 text-xs font-medium text-muted-foreground">Centrar:</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={moveLeft}
        className="h-7 w-7"
        title="Mover izquierda"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
      </Button>
      <div className="flex flex-col">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={moveUp}
          className="h-7 w-7"
          title="Mover arriba"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={moveDown}
          className="h-7 w-7"
          title="Mover abajo"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={moveRight}
        className="h-7 w-7"
        title="Mover derecha"
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
        title="Restablecer posición"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default LogoPositionControl;
