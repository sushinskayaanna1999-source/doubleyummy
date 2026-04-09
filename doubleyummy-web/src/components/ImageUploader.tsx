import type { FC } from "react";
import { fileToPreview } from "../utils/imageCompression";

export const ImageUploader: FC<{
  files: File[];
  previews?: string[];
  onChange: (files: File[]) => void;
}> = ({ files, previews = [], onChange }) => {
  const localPreviews = files.map(fileToPreview);
  const allPreviews = [...previews, ...localPreviews];

  return (
    <div className="space-y-3">
      <label className="flex min-h-32 cursor-pointer items-center justify-center rounded-card border border-dashed border-border bg-white p-4 text-center text-sm text-textLight">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => onChange(Array.from(event.target.files ?? []).slice(0, 5))}
        />
        Добавьте 1-5 фото из галереи или камеры
      </label>
      {allPreviews.length ? (
        <div className="grid grid-cols-3 gap-2">
          {allPreviews.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" className="aspect-square rounded-2xl object-cover" />
          ))}
        </div>
      ) : null}
    </div>
  );
};
