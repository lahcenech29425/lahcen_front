import { Link } from "@/components/elements/Link";

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar relative z-[9999] w-full bg-primary text-primary-foreground text-sm md:text-base py-2 px-4 text-center transition-colors duration-300 hover:bg-primary/90">
      <Link
        href="/about"
        className="inline-block font-medium hover:underline"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        نُؤْمِنُ بِأَنَّ الْكَلِمَةَ الطَّيِّبَةَ صَدَقَةٌ جَارِيَةٌ
      </Link>
    </div>
  );
};

export default AnnouncementBar;
