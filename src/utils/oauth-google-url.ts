const redirect_uri = process.env.REACT_APP_GOOGLE_REDIRECT_URI || "";
const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

export const getOauthGoogleUrl = () => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  const query = {
    redirect_uri: redirect_uri,
    client_id: client_id,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(query);

  return `${url}?${qs.toString()}`;
};
