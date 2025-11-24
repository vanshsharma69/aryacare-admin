import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Patients" value="1200" />
        <Card title="Total Doctors" value="32" />
        <Card title="Appointments Today" value="58" />
      </div>
    </div>
  );
}
