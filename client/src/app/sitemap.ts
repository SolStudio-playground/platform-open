import { MetadataRoute } from 'next'
import { connectMongoose } from 'src/utils/connectMongose';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = await connectMongoose();
  const db = client.db('parachute');
  const data = await db.collection('blogs').find({}).toArray();

  const post = data.map((post: any) => {
    return {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.5,
    }
  }
  )

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...post
  ]
}