export default function Topbar() {
  return (
    <div className="w-full bg-white p-4 shadow flex justify-between items-center">
      <h2 className="text-xl font-semibold">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <span className="font-medium">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
