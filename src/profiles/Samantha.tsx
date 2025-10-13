import type { ProfileProps } from "../types";

export default function Samantha({ close }: ProfileProps) {
  return <div onClick={close}>Samantha</div>;
}
