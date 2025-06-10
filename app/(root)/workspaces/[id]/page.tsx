import { getAuthSession } from "@/app/actions/auth/isAuth";
import ChatView from "@/components/chat/Chat";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const WorkspaceSection = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { userId } = await getAuthSession();

  if (!userId) {
    redirect("/");
  }

  const ownsWorkspace = await convexClient.query(
    api.workspace.doesWorkspaceExistForUser,
    {
      workspaceStringId: id,
      userKindeId: userId,
    }
  );

  if (!ownsWorkspace) {
    redirect("/");
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-4">
      <ChatView userKindeId={userId} workspaceStringId={id} />
      <section className="col-span-3"></section>
    </section>
  );
};

export default WorkspaceSection;
