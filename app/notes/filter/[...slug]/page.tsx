import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import Section from '@/components/Section/Section';

import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({
  params,
}: NotesProps): Promise<Metadata> => {
  const { slug } = await params;
  const raw = slug[0] ? decodeURIComponent(slug[0]) : '';
  const tag = raw === 'All notes' ? undefined : raw;

  return {
    title: tag ? `${tag}` : `All notes`,
    description: tag ? `Notes filtered by tag: ${tag}` : 'Browse all notes',
    openGraph: {
      title: tag ? `${tag}` : `All notes`,
      description: tag ? `Notes filtered by tag: ${tag}` : 'Browse all notes',
      url: `https://08-zustand-teal-omega.vercel.app/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: tag ? `${tag}` : `All notes`,
        },
      ],
    },
  };
};

const Notes = async ({ params }: NotesProps) => {
  const { slug } = await params;

  const raw = slug[0] ? decodeURIComponent(slug[0]) : '';
  const tag = raw === 'All notes' ? undefined : raw;
  // const tag = slug[0] === 'All notes' ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', tag],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <Section>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </Section>
  );
};

export default Notes;
