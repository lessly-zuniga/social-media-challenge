"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import NewPostModal from './NewPostModal';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import { Post } from '../types';


export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId || '',
        ...doc.data(),
      })) as Post[];
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNewPost = () => {
    setIsModalOpen(true);
  };

  const goToProfile = (userId: string) => {
    console.log(userId, 'userId');
    router.push(`/profile/${userId}`);
  };

  return (
    <div>
      <Navbar onNewPost={handleNewPost} onProfile={goToProfile} />
      <NewPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostCreated={handlePostCreated} />
      <div className="p-4">
        <h1 className="text-xl font-bold">Feed</h1>
        <div className="mt-4 flex flex-cols-3 gap-1 flex-wrap">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onProfile={goToProfile} />
        ))}
        </div>
      </div>
    </div>
  );
}
