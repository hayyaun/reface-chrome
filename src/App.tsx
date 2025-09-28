import { useEffect, useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function App() {
  const [count, setCount] = useState(0);

  const onClick = () => {
    setCount((count) => count + 1);
    chrome.storage.local.set({ targetDomain: "wikipedia.org" });
  };

  const [items, setItems] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    chrome.storage.local.get(null, (items) => setItems(items));
  }, []);

  console.log(items);

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
      <p>
        {Object.keys(items).map((k, i) => (
          <p key={i}>
            {k}: {items[k]}
          </p>
        ))}
      </p>
    </>
  );
}
