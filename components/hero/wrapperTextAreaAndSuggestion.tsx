import { isAuthenticated } from "@/app/actions/auth/isAuth";
import HeroTextareaAndBtn from "./HeroTextareaAndSuggestion";

const wrapperTextAreaAndSuggestion = async () => {
  const isAuth = await isAuthenticated();
  return <HeroTextareaAndBtn isAuthenticated={isAuth} />;
};

export default wrapperTextAreaAndSuggestion;
