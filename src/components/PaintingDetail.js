import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext";

const PaintingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [painting, setPainting] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchPainting = async () => {
      const { data, error } = await supabase
        .from("gallery_paintings")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setPainting(data);
        setDescription(data.description || "");
      } else {
        console.error("Erreur:", error);
      }
    };

    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("painting_images")
        .select("*")
        .eq("painting_id", id)
        .order("created_at", { ascending: false });

      if (!error) setImages(data);
    };

    fetchPainting();
    fetchImages();
  }, [id]);

  const handleUpload = async () => {
    if (!file) return;

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1000,
    });

    const fileName = `extra/${uuidv4()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("user-photos")
      .upload(fileName, compressed);

    if (uploadError) {
      console.error("Erreur upload image:", uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("user-photos")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from("painting_images")
      .insert({ painting_id: id, image_url: urlData.publicUrl });

    if (!insertError) {
      setFile(null);
      // refresh les images
      const { data, error } = await supabase
        .from("painting_images")
        .select("*")
        .eq("painting_id", id)
        .order("created_at", { ascending: false });

      if (!error) setImages(data);
    }
  };

  const handleSaveDescription = async () => {
    const { error } = await supabase
      .from("gallery_paintings")
      .update({ description })
      .eq("id", id);

    if (!error) alert("Description mise à jour !");
  };

  if (!painting) return <div>Chargement...</div>;

  return (
    <div className="painting-detail">
      <h1 className="text-2xl font-bold mb-4">{painting.name}</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="font-semibold mb-2">Photos additionnelles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((img) => (
              <img key={img.id} src={img.image_url} alt="extra" className="w-full h-auto rounded" />
            ))}
          </div>

          {user && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-2"
              />
              <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded">
                Ajouter une image
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <h2 className="font-semibold mb-2">Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 h-40"
          />
          {user && (
            <button onClick={handleSaveDescription} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
              Sauvegarder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaintingDetail;
