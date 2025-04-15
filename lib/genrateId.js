import { v4 } from "uuid";

export const genrateId = () => {
  const id = v4();
  return id;
};
