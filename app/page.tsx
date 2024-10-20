import YouTubeConverter from '@/components/YouTubeConverter';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center pb-10">YouTube to Blog Converter</h1>
      <YouTubeConverter />
    </div>
  );
}