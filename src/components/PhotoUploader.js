// src/components/PhotoUploader.js

import { useState } from 'react';
import { supabase } from '../supabaseClient'; // <-- Chemin relatif vers le fichier de configuration Supabase

function PhotoUploader() {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const filePath = `user-${userId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file);

    if (error) {
      alert("Upload failed!");
      console.error(error);
    } else {
      const { data: publicUrlData } = supabase
        .storage
        .from('user-photos')
        .getPublicUrl(filePath);

      setImageUrl(publicUrlData.publicUrl);
    }

    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />  
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />}
    </div>
  );
}

export default PhotoUploader;
