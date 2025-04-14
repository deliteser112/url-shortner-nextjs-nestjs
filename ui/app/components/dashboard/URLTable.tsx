'use client';

import { useEffect, useRef, useState } from 'react';

type Url = {
  id: number;
  slug: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};

interface Props {
  urls: Url[];
  editSlugId: number | null;
  slugValue: string;
  setSlugValue: (slug: string) => void;
  setEditSlugId: (id: number | null) => void;
  handleSlugSave: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function URLTable({
  urls,
  editSlugId,
  slugValue,
  setSlugValue,
  setEditSlugId,
  handleSlugSave,
  onDelete,
}: Props) {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const validateSlug = (slug: string): string | null => {
    if (!slug.trim()) return 'Slug is required.';
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return 'Only letters, numbers, "-", "_" allowed.';
    if (slug.length < 3 || slug.length > 30) return 'Slug must be 3–30 characters.';
    return null;
  };

  const handleSave = (id: number) => {
    const error = validateSlug(slugValue);
    if (error) {
      setSlugError(error);
      return;
    }
    setSlugError(null);
    handleSlugSave(id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded shadow relative">
      {confirmDeleteId !== null && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white text-sm px-6 py-3 shadow-lg rounded z-50 border border-gray-200 flex gap-4 items-center">
          <span>Are you sure you want to delete this URL?</span>
          <button
            onClick={() => {
              onDelete(confirmDeleteId);
              setConfirmDeleteId(null);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="text-gray-600 hover:text-black px-3 py-1"
          >
            Cancel
          </button>
        </div>
      )}

      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-3 font-semibold">Slug</th>
            <th className="px-4 py-3 font-semibold">Original URL</th>
            <th className="px-4 py-3 font-semibold text-center">Visits</th>
            <th className="px-4 py-3 font-semibold text-center">Created</th>
            <th className="px-4 py-3 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id} className="border-t relative">
              <td className="px-4 py-2">
                {editSlugId === url.id ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                      <input
                        value={slugValue}
                        onChange={(e) => {
                          setSlugValue(e.target.value);
                          setSlugError(null);
                        }}
                        className={`border rounded px-2 py-1 text-sm ${
                          slugError ? 'border-red-500' : ''
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(url.id)}
                        className="bg-blue-500 text-white text-sm px-2 py-1 rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditSlugId(null);
                          setSlugError(null);
                        }}
                        className="text-sm px-2 py-1 text-gray-500 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>
                    {slugError && (
                      <span className="text-xs text-red-500 ml-1">{slugError}</span>
                    )}
                  </div>
                ) : (
                  <a
                    href={`/${url.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      setEditSlugId(url.id);
                      setSlugValue(url.slug);
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {url.slug}
                  </a>
                )}
              </td>

              <td className="px-4 py-2">
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {url.originalUrl}
                </a>
              </td>

              <td className="px-4 py-2 text-center">{url.visitCount}</td>

              <td className="px-4 py-2 text-center">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-2 text-center relative">
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === url.id ? null : url.id)
                  }
                  className="text-gray-600 hover:text-black"
                >
                  ⋯
                </button>

                {menuOpenId === url.id && (
                  <div
                    ref={menuRef}
                    className="absolute z-10 right-0 mt-2 w-32 bg-white border rounded shadow-lg"
                  >
                    <button
                      onClick={() => {
                        setEditSlugId(url.id);
                        setSlugValue(url.slug);
                        setMenuOpenId(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setConfirmDeleteId(url.id);
                        setMenuOpenId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
