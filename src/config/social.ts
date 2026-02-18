import { Facebook, Instagram, Youtube } from "lucide-react";

// Assuming icon can be a Lucide component or a string path
export type SocialLink = {
    id: number;
    platform: string;
    url: string;
    icon: any;
};

export const SOCIAL_LINKS: SocialLink[] = [
    {
        id: 1,
        platform: "facebook",
        url: "https://www.facebook.com/lahcen29325",
        icon: Facebook
    },
    {
        id: 2,
        platform: "instagram",
        url: "https://www.instagram.com/lahcen29325",
        icon: Instagram
    },
    {
        id: 3,
        platform: "youtube",
        url: "https://www.youtube.com/@Lahcen-25",
        icon: Youtube
    },
    {
        id: 4,
        platform: "tiktok",
        url: "https://www.tiktok.com/@lahcen29325",
        icon: "/assets/icons/tiktok.svg"
    },
    {
        id: 5,
        platform: "x",
        url: "https://x.com/lahcen29325",
        icon: "/assets/icons/x.svg"
    },
    {
        id: 6,
        platform: "whatsapp",
        url: "https://whatsapp.com/channel/0029VbC1lyi2ER6lkE0e5j0s",
        icon: "/assets/icons/whatsapp.svg"
    },
];
