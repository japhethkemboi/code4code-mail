import { Header } from "../components/header";
import { useGlobalContext } from "../GlobalContext";

export default function Dashboard() {
  const { organization } = useGlobalContext();

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header title="Dashboard" />
      <div className="flex gap-4">
        <div className="flex size-24 items-center justify-center text-5xl font-extralight p-4 rounded-xl bg-teal-400"></div>
        <div className="flex flex-col gap-2 justify-center">
          <h2 className="text-lg">{organization?.name}</h2>
          {organization?.domains.map((domain) => (
            <a
              key={domain.name}
              href={"https://" + domain.name}
              target="__blank"
              className="font-extralight opacity-70 text-sm hover:underline hover:text-[var(--hovered-link)]"
            >
              {domain.name}
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg">Users</h2>
        <div className="flex flex-col gap-2 justify-center">
          <p className="text-lg">2 Organization users</p>
        </div>
      </div>
    </div>
  );
}
