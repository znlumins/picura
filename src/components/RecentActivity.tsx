"use client";

interface ActivityItem {
  id: string;
  title: string;
  client: string;
  time: string;
  value: string;
}

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    title: "Seleksi 20 Foto Diterima",
    client: "Wedding Radit & Vanya",
    time: "10 menit lalu",
    value: "20 Selected",
  },
  {
    id: "act-2",
    title: "Format WhatsApp Tergenerate",
    client: "Wisuda Sarah UI 2026",
    time: "42 menit lalu",
    value: "wa.me link",
  },
  {
    id: "act-3",
    title: "Sinkronisasi Google Drive",
    client: "Prewedding Studio Bromo",
    time: "2 jam lalu",
    value: "48 Photos",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eceff3]">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#272835]">
            Aktivitas Sesi Terkini
          </h3>
          <p className="text-xs text-[#666d80]">
            Log interaksi seleksi klien dan pemrosesan Google Drive
          </p>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[#eceff3]">
        {SAMPLE_ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="py-3 flex items-center justify-between hover:bg-[#f6f8fa] px-2 rounded-[6px] transition"
          >
            <div>
              <span className="text-xs font-medium text-[#272835] block">
                {act.title}
              </span>
              <span className="text-[11px] text-[#818898]">
                {act.client} • {act.time}
              </span>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs text-[#36394a] block font-medium">
                {act.value}
              </span>
              <span className="text-[10px] font-mono text-[#5e4cff]">
                Sinkron
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
