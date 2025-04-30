import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from 'uuid';

const Gallery = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [paintings, setPaintings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPainting, setNewPainting] = useState({ name: "", description: "", price: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImagePath, setUploadingImagePath] = useState(null); // stocke chemin d'image temporairement

  // ✅ Charger les peintures depuis Supabase Storage
  useEffect(() => {
    const fetchPaintings = async () => {
      const { data, error } = await supabase
        .storage
        .from('user-photos')
        .list('gallery', { limit: 100 });

      if (error) {
        console.error("Erreur de chargement des peintures :", error.message);
        return;
      }

      if (data) {
        const paintingList = data.map((file) => ({
          id: file.name,
          name: file.metadata?.name || "Unknown", // tu pourras améliorer ça plus tard
          description: file.metadata?.description || "",
          price: file.metadata?.price || "",
          image: supabase.storage.from('user-photos').getPublicUrl(`gallery/${file.name}`).data.publicUrl,
        }));
        setPaintings(paintingList);
      }
    };

    fetchPaintings();
  }, []);

  const handleAddPainting = async () => {
    if (!newPainting.name || !newPainting.description || !newPainting.price || !uploadingImagePath) {
      alert("Please fill all the fields and upload a photo!");
      return;
    }

    const newPaintingData = {
      id: uploadingImagePath, 
      name: newPainting.name,
      description: newPainting.description,
      price: newPainting.price,
      image: supabase.storage.from('user-photos').getPublicUrl(uploadingImagePath).data.publicUrl,
    };

    setPaintings((prev) => [...prev, newPaintingData]);
    setNewPainting({ name: "", description: "", price: "", image: "" });
    setImagePreview(null);
    setUploadingImagePath(null);
    setIsModalOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const uniqueName = `gallery/painting-${uuidv4()}.jpg`;

      const { error } = await supabase.storage
        .from('user-photos')
        .upload(uniqueName, file, { upsert: false });

      if (error) {
        console.error("Erreur d'upload Supabase:", error.message);
        alert("Error while uploading image!");
        return;
      }

      setUploadingImagePath(uniqueName); // stocker le chemin pour ajout plus tard

    } catch (err) {
      console.error("Erreur inattendue:", err);
    }
  };

  const handleDeletePainting = async (id) => {
    const { error } = await supabase
      .storage
      .from('user-photos')
      .remove([id]);

    if (error) {
      console.error("Erreur lors de la suppression :", error.message);
      return;
    }

    setPaintings((prev) => prev.filter((painting) => painting.id !== id));
  };

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
            <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-red-500 text-xl">
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
              onChange={handleFileChange}
              className="w-full p-2 border rounded mb-2"
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image mb-2" />}

            <Button onClick={handleAddPainting} className="w-full button">
              {t("gallery.add")}
            </Button>
          </div>
        </div>
      )}

      <div className="gallery-grid">
        {paintings.map((painting) => (
          <motion.div key={painting.id} className="relative">
            <Card className="shadow-lg rounded-2xl overflow-hidden">
              {user && (
                <button className="delete-button" onClick={() => handleDeletePainting(painting.id)}>
                  ✖
                </button>
              )}
              <img src={painting.image} alt={painting.name} className="gallery-image" />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{painting.name}</h2>
                <p className="text-gray-600 mt-2">{painting.description}</p>
                <p className="text-lg font-bold mt-2">{painting.price}</p>
                <Button
                  onClick={() => addToCart(painting)}
                  className="addButton mt-2 w-full bg-green-600 text-white hover:bg-green-700"
                >
                  {t("gallery.addToCart") || "Ajouter au panier"}
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