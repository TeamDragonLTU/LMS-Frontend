import { ApplicationUserDto } from "../types";

type Props = {
  participants: ApplicationUserDto[];
};

export default function ParticipantList({ participants }: Props) {
  if (participants.length === 0) {
    return <p>No participants found.</p>;
  }

  return (
    <ul className="participants-list">
      {participants.map((p) => (
        <li key={p.id} className="participant-item">
          <span className="participant-name">{p.userName}</span>
          <span className="participant-email">{p.email}</span>
        </li>
      ))}
    </ul>
  );
}
