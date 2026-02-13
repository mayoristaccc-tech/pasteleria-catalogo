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

  // Espera tanto el contenido como el auth
  if (loading || authLoading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  if (!data) {
    return <div className="text-center py-20">Contenido no disponible</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {!editando ? (
        <>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {data.title}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          <div className="space-y-6 text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {data.content}
          </div>

          {isSuperAdmin && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setEditando(true)}
                className="border px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Editar contenido
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
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
            className="w-full border p-3 rounded-lg h-48"
            placeholder="Contenido"
          />

          <div className="flex gap-3">
            <button
              onClick={guardarCambios}
              className="bg-primary text-white px-6 py-2 rounded-lg"
            >
              Guardar cambios
            </button>

            <button
              onClick={() => setEditando(false)}
              className="border px-6 py-2 rounded-lg"
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
