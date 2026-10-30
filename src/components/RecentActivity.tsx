"use client";

import { IconEye, IconPhoto } from "@/components/Icons";

export interface ActivityItem {
  id: string;
  galleryId: string;
  galleryTitle: string;
  gallerySlug: string;
  clientName: string;
  clientNotes?: string | null;
  totalSelected: number;
  submittedAt: string;
  selectedFiles: { file_id: string; filename: string }[];
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  onViewSelection?: (activity: ActivityItem) => void;
}

export default function RecentActivity({
  activities = [],
  onViewSelection,
}: RecentActivityProps) {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eceff3]">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#272835]">
            Aktivitas Seleksi Foto Klien Terkini
          </h3>
          <p className="text-xs text-[#666d80]">
            Daftar foto yang baru saja ditandai dan dikonfirmasi oleh klien Anda
          </p>
        </div>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="py-10 text-center text-[#818898] space-y-1">
          <IconPhoto className="w-8 h-8 mx-auto text-[#c1c7d0]" />
          <p className="text-xs font-medium text-[#666d80]">Belum ada aktivitas seleksi masuk</p>
          <p className="text-[11px] text-[#818898]">
            Ketika klien menandai foto dan mengirimkan pilihan, log akan otomatis tercatat di sini.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#eceff3]">
          {activities.map((act) => (
            <div
              key={act.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f6f8fa] px-2 rounded-[6px] transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#272835]">
                    {act.clientName} memilih {act.totalSelected} foto
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#ecfdf5] text-[#10b981] border border-[#a7f3d0]">
                    Terkonfirmasi
                  </span>
                </div>
                <div className="text-[11px] text-[#818898] mt-0.5">
                  Galeri: <strong className="text-[#36394a]">{act.galleryTitle}</strong> • {formatTime(act.submittedAt)}
                </div>
                {act.clientNotes && (
                  <p className="text-[11px] text-[#666d80] italic mt-1 bg-[#f6f8fa] p-1.5 rounded-[4px] border border-[#eceff3]">
                    &ldquo;{act.clientNotes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {onViewSelection && (
                  <button
                    onClick={() => onViewSelection(act)}
                    className="px-3 py-1.5 rounded-[8px] bg-[#dfdbff] text-[#5e4cff] hover:opacity-90 text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <IconEye className="w-3.5 h-3.5" />
                    <span>Lihat Daftar File</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
