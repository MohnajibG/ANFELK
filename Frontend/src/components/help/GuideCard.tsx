import type { LucideIcon } from "lucide-react";

interface GuideCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tips?: string[];
}

const GuideCard = ({ icon: Icon, title, description, tips }: GuideCardProps) => (
  <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--black) text-(--champagne)">
        <Icon size={18} />
      </div>

      <h3 className="font-bold text-(--black)">{title}</h3>
    </div>

    <p className="mt-3 text-sm text-(--muted)">{description}</p>

    {tips && tips.length > 0 && (
      <ul className="mt-3 space-y-1.5">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2 text-sm text-(--muted)">
            <span className="text-(--brown)">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default GuideCard;
