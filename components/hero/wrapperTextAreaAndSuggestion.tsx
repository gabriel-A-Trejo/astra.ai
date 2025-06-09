import { getAuthSession } from "@/app/actions/auth/isAuth";
import HeroTextareaAndBtn from "./HeroTextareaAndSuggestion";

const wrapperTextAreaAndSuggestion = async () => {
  const { isAuthenticated, userId } = await getAuthSession();

  return (
    <>
      <HeroTextareaAndBtn isAuthenticated={isAuthenticated} userId={userId} />
    </>
  );
};

export default wrapperTextAreaAndSuggestion;
