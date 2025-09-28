import reactLogo from "./assets/react.svg";
import { useStore } from "./store";
import viteLogo from "/vite.svg";

export default function App() {
  const count = useStore((s) => s.count);
  const inc = useStore((s) => s.inc);
  const urls = useStore((s) => s.urls);
  const updateURL = useStore((s) => s.updateURL);

  const onClick = () => {
    inc();
    updateURL("wikipedia.org", { fixes: [] });
  };

  console.log(urls);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={onClick}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        {Object.keys(urls).map((url, i) => (
          <p key={i}>{url}</p>
        ))}
      </div>
    </>
  );
}
