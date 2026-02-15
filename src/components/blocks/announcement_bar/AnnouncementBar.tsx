import { AnnouncementBarType } from "@/types/AnnouncementBar";
import { Link } from "@/components/elements/Link";

const AnnouncementBar = ({ data }: { data: AnnouncementBarType }) => {
  if (!data.active) return null;

  return (
    <div className="relative z-[10000] w-full bg-primary text-primary-foreground text-sm md:text-base py-2 px-4 text-center transition-colors duration-300 hover:bg-primary/90">
      <Link
        href={data.link || "#"}
        className="inline-block font-medium hover:underline"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {data.message}
      </Link>
    </div>
  );
};

export default AnnouncementBar;
