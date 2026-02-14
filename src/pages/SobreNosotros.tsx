import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/context/AuthContext";

interface AboutContent {
  title: string;
  subtitle: string;
  content: string;
}

const SobreNosotros = () => {
  const { isSuperAdmin, loading: authLoading } = useAuthContext();

  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", "about")
        .maybeSingle();

      if (error) {
        console.error("Error cargando contenido:", error);
      }

      if (data) {
        setData(data);
        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setContent(data.content || "");
      }

      setLoading(false);
    };

    fetchContent();
  }, []);

  const guardarCambios = async () => {
    const { error } = await supabase
      .from("site_content")
      .update({
        title,
        subtitle,
        content,
        updated_at: new Date(),
      })
      .eq("key", "about");

    if (error) {
      console.error("Error guardando cambios:", error);
      return;
    }

    setData({ title, subtitle, content });
    setEditando(false);
  };

  if (loading || authLoading) {
    return <div className="text-center py-24">Cargando...</div>;
  }

  if (!data) {
    return <div className="text-center py-24">Contenido no disponible</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">

      {!editando ? (
        <>
          {/* Título */}
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-6xl font-semibold tracking-wide mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {data.title}
            </h1>

            {/* Línea decorativa sutil */}
            <div className="w-24 h-[1px] bg-gray-300 mx-auto mb-8"></div>

            <p
              className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
            >
              {data.subtitle}
            </p>
          </div>

          {/* Contenido */}
          <div
            className="text-lg md:text-xl text-gray-700 leading-loose whitespace-pre-line max-w-3xl mx-auto text-center"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            {data.content}
          </div>

          {/* Botón editar solo superadmin */}
          {isSuperAdmin && (
            <div className="mt-16 text-center">
              <button
                onClick={() => setEditando(true)}
                className="border border-gray-400 px-8 py-3 rounded-full text-sm tracking-wide hover:bg-gray-100 transition"
              >
                Editar contenido
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Título"
          />

          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Subtítulo"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-4 rounded-lg h-56"
            placeholder="Contenido"
          />

          <div className="flex gap-4">
            <button
              onClick={guardarCambios}
              className="bg-primary text-white px-8 py-3 rounded-lg"
            >
              Guardar cambios
            </button>

            <button
              onClick={() => setEditando(false)}
              className="border px-8 py-3 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SobreNosotros;
