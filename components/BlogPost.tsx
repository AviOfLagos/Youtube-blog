import React from 'react';

interface BlogPostProps {
  content: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ content }) => {
  return (
    <div className="mt-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generated Blog Post</h2>
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
    </div>
  );
};

export default BlogPost;