import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";

function profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    };
    verifyUser();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
      <h1 className="font-medium text-gray-500 my-2">
        Username: {user.username}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Email: {user.attributes.email}
      </p>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(profile);
