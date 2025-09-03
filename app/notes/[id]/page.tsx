import { fetchNotesById } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

interface NoteDetailProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: NoteDetailProps): Promise<Metadata> => {
  const { id } = await params;
  console.log('generateMetadata id:', id);
  const note = await fetchNotesById(id);
  console.log('generateMetadata note:', note);

  return {
    // title: note.title,
    title: note?.title || 'Нет заголовка',
    description: note.content.slice(0, 20),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 20),
      url: `https://08-zustand-teal-omega.vercel.app/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
};

const NoteDetails = async ({ params }: NoteDetailProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNotesById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
