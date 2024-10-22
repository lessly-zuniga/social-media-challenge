"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";
import PostCard from "../../components/PostCard";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  content: string;
  user: string;
  avatar: string;
  image: string;
  userId: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export default function UserProfile() {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileUserId, setProfileUserId] = useState<string | string[]>();
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    if (!userId && loggedInUser) {
      setProfileUserId(loggedInUser.uid);
    } else if (userId) {
      setProfileUserId(userId);
    }
  }, [userId, loggedInUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (profileUserId) {
        try {
          const q = query(
            collection(db, "posts"),
            where("userId", "==", profileUserId)
          );
          const querySnapshot = await getDocs(q);
          const fetchedPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          setPosts(fetchedPosts);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching posts:", error);
          setLoading(false);
        }
      }
    };

    fetchUserPosts();
  }, [profileUserId]);

  if (authLoading || loading) return <div>Loading...</div>;

  if (!profileUserId) return <div>No user available.</div>;

  const isOwnProfile = profileUserId === loggedInUser?.uid;

  const avatar = isOwnProfile ? loggedInUser?.photoURL : posts[0].avatar;

  return (
    <div className="h-screen mx-auto text-gray-900">
      <div className="relative h-40 bg-gradient-to-r from-pink-500 to-purple-500">
        <div className="absolute -bottom-16 left-4">
          <Image
            src={avatar || "/placeholder.svg?height=128&width=128"}
            alt="Profile picture"
            className="w-32 h-32 rounded-full border-4 border-gray-50"
            width={128}
            height={128}
          />
        </div>
      </div>

      <div className="mt-20 px-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">
            {isOwnProfile
              ? loggedInUser?.displayName || "Anonymous"
              : posts[0].user}
          </h1>
        </div>
        <div className="mt-2 text-sm">
          📸 Photography enthusiast | 🌿 Nature lover | ☕️ Coffee addict
        </div>

        <div className="flex justify-around mt-4 text-center">
          <div>
            <div className="font-bold">{posts.length}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div>
            <div className="font-bold">14.2k</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div>
            <div className="font-bold">1,500</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4">
        <button className="py-2 px-4 text-gray-900">Posts</button>
        <div className="mt-4 flex flex-cols-3 gap-1 flex-wrap">
          {posts.length === 0 ? (
            <div>No posts available.</div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onProfile={() => {}} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
