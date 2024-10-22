"use client";

import Image from "next/image";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  onProfile: (userId: string) => void;
}

export default function PostCard({ post, onProfile }: PostCardProps) {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 w-full max-w-md mx-auto my-4">
      <div
        className="flex items-center gap-4 mb-4"
        onClick={() => onProfile(post.userId)}
      >
        <Image
          src={post.avatar || ""}
          alt={post.user}
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
          priority
        />
        <div>
          <p className="text-sm font-semibold text-gray-400">{post.user}</p>
        </div>
      </div>
      <div className="mb-4">
        <Image
          alt="Post image"
          src={post.image || "/placeholder-image.png"}
          className="w-full h-auto rounded-lg object-cover"
          width={600}
          height={600}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-400">
          {post.likes && post.likes.toLocaleString()} likes
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold ">{post.user}</span> {post.content}
        </p>
      </div>

      <div>
        <button className="text-sm text-blue-500 hover:underline">
          View all {post.comments} comments
        </button>
        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Image
          src={post.avatar}
          alt="Current user"
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 p-2 text-sm border border-gray-800 rounded-lg focus:outline-none focus:border-gray-400"
        />
        <button className="text-blue-500 text-sm font-semibold">Post</button>
      </div>
    </div>
  );
}
