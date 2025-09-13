export default function StatsSectionBlock({ title, subtitle }) {
  return (
    <section className="bg-white py-16 text-center">
      <h3 className="text-4xl font-bold mb-2">{title}</h3>
      <p className="text-lg text-gray-600">{subtitle}</p>
      {/* Add stats grid here */}
    </section>
  );
}
