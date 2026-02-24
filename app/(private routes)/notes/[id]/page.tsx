import type { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    return {
      title: `NoteHub - ${note.title}`,
      description: note.content || `View details of note: ${note.title}`,
      openGraph: {
        title: `NoteHub - ${note.title}`,
        description: note.content || `View details of note: ${note.title}`,
        url: `https://notehub.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          },
        ],
      },
    };
  } catch {
    return {
      title: 'NoteHub - Note',
      description: 'View note details',
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
