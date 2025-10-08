interface Props {
  name: string;
  details: string;
}

export default function Label({ name, details }: Props) {
  return (
    <div aria-label="Label" className="flex flex-col gap-1">
      <span>{name}</span>
      <span
        title={details.length > 40 ? details : undefined}
        className="text-tiny line-clamp-1 opacity-45"
      >
        {details}
      </span>
    </div>
  );
}
