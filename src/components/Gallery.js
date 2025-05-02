import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../supabaseClient";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { ChevronLeft, ChevronRight } from "lucide-react";


const Gallery = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [carouselIndices, setCarouselIndices] = useState({});
  const [paintings, setPaintings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPainting, setNewPainting] = useState({
    name: "",
    description: "",
    price: "",
    files: [],
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from("gallery_paintings")
      .select("*, painting_images(*)")
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Erreur chargement DB:", error.message);
      return;
    }
  
    setPaintings(data);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPainting({ ...newPainting, files });
  
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleAddPainting = async () => {
    const { name, description, price, files } = newPainting;
    if (!name || !description || !price || files.length === 0) {
      alert("Veuillez remplir tous les champs et ajouter au moins une image.");
      return;
    }

    try {
      const { data: inserted, error: insertError } = await supabase
        .from("gallery_paintings")
        .insert([{ name, description, price }])
        .select();
  
      if (insertError) throw insertError;
  
      const paintingId = inserted[0].id;
  
      for (const file of files) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
        });
  
        const fileName = `${uuidv4()}-${file.name}`;
        const storagePath = `gallery/${fileName}`;
  
        const { error: uploadError } = await supabase.storage
          .from("user-photos")
          .upload(storagePath, compressed);
  
        if (uploadError) continue;
  
        const { data: urlData } = supabase.storage
          .from("user-photos")
          .getPublicUrl(storagePath);
  
        await supabase.from("painting_images").insert({
          painting_id: paintingId,
          image_url: urlData.publicUrl,
          storage_path: storagePath,
        });
      }
  
      fetchGalleryImages();
      setNewPainting({ name: "", description: "", price: "", files: [] });
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleDeletePainting = async (id) => {
    // 1. Récupérer les chemins à supprimer
    const { data: images } = await supabase
      .from("painting_images")
      .select("storage_path")
      .eq("painting_id", id);
  
    const paths = images?.map((img) => img.storage_path) || [];
  
    if (paths.length > 0) {
      await supabase.storage.from("user-photos").remove(paths);
    }
  
    await supabase.from("gallery_paintings").delete().eq("id", id);
  
    setPaintings(paintings.filter((p) => p.id !== id));
  };

  const handlePrev = (id) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [id]: (prev[id] > 0 ? prev[id] - 1 : paintingMap[id].length - 1),
    }));
  };
  
  const handleNext = (id) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [id]: (prev[id] < paintingMap[id].length - 1 ? prev[id] + 1 : 0),
    }));
  };  

  const paintingMap = paintings.reduce((acc, p) => {
    acc[p.id] = p.painting_images || [];
    return acc;
  }, {});  

  return (
    <div id="gallery" className="galleryContainer">
      <h2 className="text-3xl font-bold text-center mb-6">{t("gallery.title")}</h2>
  
      {user && (
        <Button onClick={() => setIsModalOpen(true)} className="mb-4">
          {t("gallery.addPaint")}
        </Button>
      )}
  
      {isModalOpen && (
        <div className="modal absolute mt-2 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{t("gallery.addPaint")}</h2>
            <button onClick={() => setIsModalOpen(false)} className=" delete-button text-gray-600 hover:text-red-500 text-xl">
              ✖
            </button>
          </div>
          <div className="inputs">
            <input
              type="text"
              placeholder="Name"
              value={newPainting.name}
              onChange={(e) => setNewPainting({ ...newPainting, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newPainting.description}
              onChange={(e) => setNewPainting({ ...newPainting, description: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Price"
              value={newPainting.price}
              onChange={(e) => setNewPainting({ ...newPainting, price: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded mb-2"
            />
            {imagePreview && (
              <div className="preview flex gap-2 mb-2 overflow-x-auto">
                {imagePreview.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i}`} className="preview-image" />
                ))}
              </div>
            )}
            <Button onClick={handleAddPainting} className="addButton w-full">
              {t("gallery.add")}
            </Button>
          </div>
        </div>
      )}
  
      <div className="gallery-grid">
        {paintings.map((painting) => (
          <motion.div key={painting.id} className="relative">
            <Card className="card">
              {user && (
                <button className="delete-button" onClick={() => handleDeletePainting(painting.id)}>
                  ✖
                </button>
              )}
              <div className="relative w-full h-64 overflow-hidden">
              {painting.painting_images && painting.painting_images.length > 0 ? (
                <div className="carousel-wrapper">
                <button className="carousel-arrow left" onClick={() => handlePrev(painting.id)}>
                  <ChevronLeft size={24} />
                </button>
                <img
                  src={painting.painting_images[carouselIndices[painting.id] || 0]?.image_url}
                  alt={`Peinture ${painting.name}`}
                  className="gallery-image"
                />
                <button className="carousel-arrow right" onClick={() => handleNext(painting.id)}>
                  <ChevronRight size={24} />
                </button>
              </div>
              
              ) : (
                <p className="text-gray-400 italic">Pas d’image disponible</p>
              )}

              </div>
  
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{painting.name}</h2>
                <p className="text-gray-600 mt-2">{painting.description}</p>
                <p className="text-lg font-bold mt-2">{painting.price}</p>
                <Button
                  onClick={() => addToCart(painting)}
                  className="addButton mt-2 w-full bg-green-600 text-white hover:bg-green-700"
                >
                  {t("gallery.addToCart")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;