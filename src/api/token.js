import Ably from "ably/promises";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

export const GET = async (req, res) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  }); // big_red_donkey

  const client = new Ably.Rest(import.meta.env.VITE_ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: randomName,
  });
  console.log(`Request: ${JSON.stringify(tokenRequestData)}`);
  return res.json(tokenRequestData);
};
