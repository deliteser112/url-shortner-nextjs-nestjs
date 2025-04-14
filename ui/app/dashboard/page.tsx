'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { deleteUrl, updateSlug } from '@/lib/api';
import Pagination from '../components/Pagination';
import URLTable from '../components/dashboard/URLTable';
import DashboardToast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

type Url = {
  id: number;
  slug: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
  deleting?: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editSlugId, setEditSlugId] = useState<number | null>(null);
  const [slugValue, setSlugValue] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const pageSize = 10;

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchUrls = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/urls?page=${page}&limit=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to load URLs');

        const { data, meta } = await res.json();
        setUrls(data || []);
        setTotalPages(meta?.totalPages || 1);
      } catch (err) {
        console.error(err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [page, router]);

  const handleSlugSave = async (id: number) => {
    try {
      const updated = await updateSlug(id, slugValue);
      setUrls((prev) =>
        prev.map((url) =>
          url.id === id ? { ...url, slug: updated.slug } : url
        )
      );
      setEditSlugId(null);
      showToast('Slug updated successfully!', 'success');
    } catch (err) {
      showToast((err as Error).message || 'Failed to update slug', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setUrls((prev) =>
        prev.map((url) =>
          url.id === id ? { ...url, deleting: true } : url
        )
      );
      await deleteUrl(id);
      setUrls((prev) => prev.filter((url) => url.id !== id));
      showToast('URL deleted successfully!', 'success');
    } catch (err) {
      showToast((err as Error).message || 'Failed to delete URL', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 relative">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Shorten Urls</h1>

      <DashboardToast toast={toast} />

      {loading && <LoadingSpinner />}

      {!loading && urls.length === 0 && (
        <p className="text-center text-gray-400">No URLs created yet.</p>
      )}

      {!loading && urls.length > 0 && (
        <>
          <URLTable
            urls={urls}
            editSlugId={editSlugId}
            slugValue={slugValue}
            setSlugValue={setSlugValue}
            setEditSlugId={setEditSlugId}
            handleSlugSave={handleSlugSave}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <button
        onClick={() => router.push('/slug')}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:bg-blue-700 transition duration-200"
      >
        ShortenURL
      </button>
    </div>
  );
}
