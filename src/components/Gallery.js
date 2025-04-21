import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext"; // Ajoute ça si pas déjà présent


const Gallery = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [paintings, setPaintings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPainting, setNewPainting] = useState({ name: "", description: "", price: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const { token } = useAuth(); // Accès au token via contexte


  // ✅ Charger les peintures sauvegardées dès le premier rendu
  useEffect(() => {
    const savedPaintings = localStorage.getItem("paintings");
    if (savedPaintings) {
      setPaintings(JSON.parse(savedPaintings));
    }
  }, []);

  // ✅ Sauvegarde immédiate après chaque changement
  useEffect(() => {
    if (paintings.length > 0) {
      localStorage.setItem("paintings", JSON.stringify(paintings));
    }
  }, [paintings]);

  const handleAddPainting = () => {
    if (!newPainting.name || !newPainting.description || !newPainting.price || !newPainting.image) {
      alert("Veuillez remplir tous les champs et ajouter une image !");
      return;
    }

    const newId = paintings.length ? paintings[paintings.length - 1].id + 1 : 1;
    const updatedPaintings = [...paintings, { ...newPainting, id: newId }];

    setPaintings(updatedPaintings);
    setNewPainting({ name: "", description: "", price: "", image: "" });
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewPainting({ ...newPainting, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePainting = (id) => {
    const updatedPaintings = paintings.filter((painting) => painting.id !== id);
    setPaintings(updatedPaintings);
    localStorage.setItem("paintings", JSON.stringify(updatedPaintings)); // ✅ Mise à jour immédiate du localStorage
  };

  return (
    <div id="gallery" className="galleryContainer">
      <h2 className="text-3xl font-bold text-center mb-6">{t("gallery.title")}</h2>
      {token && (
  <Button onClick={() => setIsModalOpen(true)} className="mb-4">
    {t("gallery.addPaint")}
  </Button>
)}
      {isModalOpen && (
      <div className=" modal absolute mt-2 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg p-4">
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

    <Button onClick={handleAddPainting} className="w-full">
      {t("gallery.add")}
    </Button>
  </div>
  </div>
)}
      <div className="gallery-grid">
        {paintings.map((painting) => (
          <motion.div key={painting.id} className="relative">
            <Card className="shadow-lg rounded-2xl overflow-hidden">
              <button className="delete-button" onClick={() => handleDeletePainting(painting.id)}>
                ✖
              </button>
              <img src={painting.image} alt={painting.name} className="gallery-image" />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{painting.name}</h2>
                <p className="text-gray-600 mt-2">{painting.description}</p>
                <p className="text-lg font-bold mt-2">{painting.price}</p>
                <Button
            onClick={() => addToCart(painting)} // Ajoute la peinture au panier
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
