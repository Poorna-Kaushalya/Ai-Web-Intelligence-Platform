"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGridProps {
  images: string[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const closeModal = () => setSelectedImage(null);

  const googleLensUrl = selectedImage
    ? `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
        selectedImage
      )}`
    : "#";

  if (images.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-surface p-6 text-center text-sm text-slate-500">
        No images were extracted from this page.
      </div>
    );
  }

  return (
    <>
      {/* GRID (5 columns on large screens) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setSelectedImage(src)}
            className="overflow-hidden rounded-3xl border border-surface bg-surface shadow-inner shadow-black/10 transition hover:shadow-black/20"
          >
            {/* FIXED IMAGE FIT AREA */}
            <div className="relative aspect-4/3 w-full">
              <Image
                src={src}
                alt={`Extracted image ${index + 1}`}
                fill
                className="object-cover transition duration-300 hover:scale-[1.02]"
                unoptimized
              />
            </div>
          </button>
        ))}
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-4xl bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full border border-surface bg-surface px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-soft"
            >
              Close
            </button>

            {/* Large preview */}
            <div className="relative mx-auto h-[75vh] w-full overflow-hidden rounded-3xl bg-black/5">
              <Image
                src={selectedImage}
                alt="Selected image preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Preview and export the selected image or open it in Google Lens
                for deeper analysis.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={selectedImage}
                  download
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Download image
                </a>

                <a
                  href={googleLensUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-surface bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-soft"
                >
                  Open in Google Lens
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}