import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getTranscript } from 'youtube-transcript';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { youtubeUrl } = await req.json();
    console.log('Received YouTube URL:', youtubeUrl);

    // Extract video ID from the URL
    const videoId = new URL(youtubeUrl).searchParams.get('v');
    if (!videoId) {
      console.error('Invalid YouTube URL:', youtubeUrl);
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    console.log('Extracted Video ID:', videoId);

    // Get the transcript
    let transcript;
    try {
      console.log('Fetching transcript...');
      transcript = await getTranscript(videoId);
      console.log('Transcript fetched successfully');
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return NextResponse.json({ error: 'Failed to fetch video transcript' }, { status: 500 });
    }

    const fullTranscript = transcript.map(t => t.text).join(' ');
    console.log('Full transcript length:', fullTranscript.length);

    // Use OpenAI to summarize and create a blog post
    let completion;
    try {
      console.log('Calling OpenAI API...');
      completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates blog posts from YouTube video transcripts. Summarize the key points, mention resources, and include the source video at the end."
          },
          {
            role: "user",
            content: `Create a blog post from this YouTube video transcript:\n\n${fullTranscript}\n\nInclude a summary, key points, resources mentioned, and the source video URL (${youtubeUrl}) at the end.`
          }
        ],
      });
      console.log('OpenAI API call successful');
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return NextResponse.json({ error: 'Failed to generate blog post content' }, { status: 500 });
    }

    const blogPost = completion.choices[0].message.content;
    console.log('Blog post generated successfully');

    return NextResponse.json({ blogPost });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}