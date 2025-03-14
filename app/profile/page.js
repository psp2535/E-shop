import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  if (!session) return <p>Please log in to view your profile.</p>;

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
