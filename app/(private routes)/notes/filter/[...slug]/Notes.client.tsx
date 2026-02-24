'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './page.module.css';

interface NotesFilterProps {
  tag?: NoteTag;
}

export default function NotesFilter({ tag }: NotesFilterProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, search: debouncedSearch, tag }],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch, tag }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page - 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
