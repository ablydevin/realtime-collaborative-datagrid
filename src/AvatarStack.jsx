"use client";

import { Avatar } from "flowbite-react";

function AvatarStack({ members }) {
  // Connect to Ably Space and enter set of connected clients
  const avatars = members.map((m) => (
    <Avatar
      key={m}
      rounded
      stacked
      color="purple"
      placeholderInitials={m.toUpperCase().substring(0, 1)}
    />
  ));

  return (
    <div id="avatar-stack" className={`example-container`}>
      <Avatar.Group>{avatars}</Avatar.Group>
    </div>
  );
}
export default AvatarStack;
