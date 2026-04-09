import type { FC } from "react";

export const PhotoGallery: FC<{ photos: string[]; title: string }> = ({ photos, title }) => (
  <div className="flex snap-x gap-3 overflow-x-auto pb-2">
    {photos.map((photo, index) => (
      <img key={`${photo}-${index}`} src={photo} alt={title} className="aspect-[3/4] w-[85%] snap-center rounded-card object-cover shadow-card" />
    ))}
  </div>
);
