import { getAuthSession } from "@/app/actions/auth/isAuth";

import { ConvexHttpClient } from "convex/browser";
import { notFound, redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import ChatView from "@/components/chat/Chat";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const WorkspaceSection = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { userId } = await getAuthSession();

  if (!userId) {
    notFound();
  }

  const ownsWorkspace = await convexClient.query(
    api.workspace.doesWorkspaceExistForUser,
    {
      workspaceStringId: id,
      userKindeId: userId,
    }
  );

  if (!ownsWorkspace) {
    notFound();
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3">
      <Suspense
        fallback={
          <div className="flex justify-center items-center gap-10">
            <LoaderCircle className="spin-in" />
            <p>Loading Workspace</p>
          </div>
        }
      >
        <ChatView workspaceIdParam={id} userKindeId={userId} />
      </Suspense>
    </section>
  );
};

export default WorkspaceSection;
