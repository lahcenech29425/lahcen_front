import fs from "fs";
import path from "path";
import DuaaClient from "./DuaaClient";

export const metadata = {
    title: "الأذكار والدعاء | سراج",
    description: "مجموعة شاملة من أذكار المسلم اليومية والأدعية المأثورة من حصن المسلم",
};

export default function DuaaPage() {
    const jsonPath = path.join(process.cwd(), "public/data/adhkar.json");
    const fileContent = fs.readFileSync(jsonPath, "utf8");
    const categories = JSON.parse(fileContent);

    return <DuaaClient categories={categories} />;
}
