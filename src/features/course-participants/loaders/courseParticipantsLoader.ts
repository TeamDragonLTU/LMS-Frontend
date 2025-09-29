import { LoaderFunctionArgs } from "react-router-dom";
import { ApplicationUserDto } from "../types";
import { fetchWithToken } from "../../shared/utilities";

export const courseParticipantsLoader = async ({
  request,
}: LoaderFunctionArgs) => {
  return await fetchWithToken<ApplicationUserDto[]>(
    "https://localhost:7213/api/course/participants/my"
  );
};
