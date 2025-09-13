import { AnnouncementBarType } from "@/types/AnnouncementBar";
import { Link } from "@/components/elements/Link";

const AnnouncementBar = ({ data }: { data: AnnouncementBarType }) => {
  if (!data.active) return null;

  return (
    <div className="w-full bg-[#171717] text-white text-sm md:text-base py-2 px-4 text-center transition-colors duration-300 hover:bg-gray-900">
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
