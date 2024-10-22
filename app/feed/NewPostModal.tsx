"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { Post } from "../types";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export default function NewPostModal({
  isOpen,
  onClose,
  onPostCreated,
}: NewPostModalProps) {
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      setErrorMessage("Please enter some content for the post.");
      return;
    }
    if (!imageFile) {
      setErrorMessage("Please select an image to upload.");
      return;
    }
    if (!user) return;

    try {
      setIsUploading(true);
      setErrorMessage("");
      const sanitizedFileName = imageFile.name.replace(/\s+/g, "_");
      const storageRef = ref(storage, `posts/${sanitizedFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error uploading file:", error);
          setIsUploading(false);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await createPostWithImage(imageUrl);
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
      setIsUploading(false);
    }
  };

  const createPostWithImage = async (imageUrl: string) => {
    const newPost: Post = {
      content: newPostContent,
      user: user?.displayName || "Anonymous",
      avatar: user?.photoURL || "",
      image: imageUrl,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp(),
      userId: user?.uid || "",
    };
    const docRef = await addDoc(collection(db, "posts"), newPost);
    onPostCreated({ id: docRef.id, ...newPost });
    setNewPostContent("");
    setImageFile(null);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded-md mb-4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
          className="mb-4"
        />
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePost}
            disabled={isUploading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isUploading ? "Uploading..." : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
