import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],

  afterAuth(auth, req) {
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";

      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }

      const selectedOrg = new URL(path, req.url);
      return NextResponse.redirect(selectedOrg);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const selectedOrg = new URL("/select-org", req.url);
      return NextResponse.redirect(selectedOrg);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
