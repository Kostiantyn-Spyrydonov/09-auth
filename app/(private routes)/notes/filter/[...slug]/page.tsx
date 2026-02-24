import type { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import type { NoteTag } from '@/types/note';
import NotesFilter from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagValue = slug?.[0];
  const filterTag = tagValue === 'all' || !tagValue ? 'All' : tagValue;

  return {
    title: `NoteHub - ${filterTag} Notes`,
    description: `Browse notes filtered by ${filterTag} tag`,
    openGraph: {
      title: `NoteHub - ${filterTag} Notes`,
      description: `Browse notes filtered by ${filterTag} tag`,
      url: `https://notehub.vercel.app/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const tagValue = slug?.[0];
  const filterTag = tagValue === 'all' || !tagValue ? undefined : (tagValue as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '', tag: filterTag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag: filterTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesFilter tag={filterTag} />
    </HydrationBoundary>
  );
}
