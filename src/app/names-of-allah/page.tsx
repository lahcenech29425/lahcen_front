import fs from "fs";
import path from "path";
import NamesOfAllahClient from "./NamesOfAllahClient";

export const metadata = {
    title: "أسماء الله الحسنى | سراج",
    description: "تسعة وتسعون اسماً لله عز وجل مع معانيها وشرحها المبسط",
};

export default function NamesOfAllahPage() {
    // Correct path based on file location in public/data/
    const jsonPath = path.join(process.cwd(), "public/data/Names_Of_Allah.json");
    const fileContent = fs.readFileSync(jsonPath, "utf8");
    const names = JSON.parse(fileContent);

    return <NamesOfAllahClient names={names} />;
}
