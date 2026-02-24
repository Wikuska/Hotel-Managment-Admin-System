export default function StatCard({ Icon, number, description }) {
  return (
    <div className="flex flex-col p-5 bg-white shadow-lg rounded-xl border border-gray-100">
      <Icon className="w-15 h-15 text-blue-600" />
      <p className="text-5xl self-end">{number}</p>
      <p className="self-end">{description}</p>
    </div>
  );
}
