// Import necessary components and utilities
import { Metadata } from 'next';
import { HOST_API, URL } from 'src/config-global'; // Ensure this is set correctly in your environment variables
import { PostDetailsHomeView } from 'src/sections/blog/view';

interface Params {
  title: string;
}

type Props = {
  params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headers: HeadersInit = {};

  if (process.env.SERVER_SIDE_SECRET_TOKEN) {
    headers['x-secret-token'] = process.env.SERVER_SIDE_SECRET_TOKEN;
  }

  const url = `${HOST_API}/api/blogView?title=${encodeURIComponent(params.title)}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errorText = await res.text(); // Get text to see detailed error message
      console.error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
    }

    const blog = await res.json();

    return {
      title: blog?.post?.title || 'No Title',
      description: blog?.post?.metaDescription || 'No Description',
      openGraph: {
        type: 'article', 
        url: `${URL}/blog/${encodeURIComponent(params.title)}`, 
        title: blog?.post?.title || 'No Title',
        description: blog?.post?.metaDescription || 'No Description',
        siteName: 'Solstudio', 
        images: [{
          url: blog?.post?.coverUrl || 'default-og-image.jpg' 
        }]
      },
      authors: blog?.post?.author ? [{
        name: blog.post.author.name,
        url: blog.post.author.avatarUrl,
      }] : [],
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return {
      title: "Blog not found",
      description: "The requested blog could not be found.",
    };
  }
}

export async function generateStaticParams() {
  try {
    const headers: HeadersInit = {};
    if (process.env.SERVER_SIDE_SECRET_TOKEN) {
      headers['x-secret-token'] = process.env.SERVER_SIDE_SECRET_TOKEN;
    }

    const res = await fetch(`${HOST_API}/api/blogList`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data?.posts.map((blog: { title: any; }) => ({
      params: { title: blog.title },
    }));
  } catch (error) {
    console.error("Failed to fetch tokens list:", error);
    return [];
  }
}

// Render the Post Details using the fetched blog data
export default function PostDetailsHomePage({ params }: { params: Params }) {
  const { title } = params;
  return <PostDetailsHomeView title={title} />;
}
