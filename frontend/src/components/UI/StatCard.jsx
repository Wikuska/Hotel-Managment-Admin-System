export default function StatCard({ Icon, number, description }) {
  return (
    <div className="flex flex-col p-5 bg-white shadow-lg rounded-xl border border-gray-100">
      <Icon className="w-16 h-16 text-blue-600" />
      <div className="h-12 mt-4 flex items-center justify-end">
        <div className="text-5xl text-zinc-800 font-medium">{number}</div>
      </div>
      <p className="self-end text-zinc-500 mt-2 font-medium">{description}</p>
    </div>
  );
}
