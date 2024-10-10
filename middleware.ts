import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  afterAuth(auth, req) {

    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";

      // Check if there is an organization ID and set it to the current org ID
      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }

      const selectedOrg = new URL(path, req.url);

      // Redirect user to the selected organization.
      return NextResponse.redirect(selectedOrg);
    }

    // Checks if user is authenticated. If not, the user is redirected to to sign in page. The user is redirected back to the previous page after signing in.
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Checks if user is authenticated, if there is no existing organization and the current route is not /select-org i.e page to create or select an organization. Send the user to the page to select or create an organization if true.
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const selectedOrg = new URL("/select-org", req.url);

      return NextResponse.redirect(selectedOrg);
    }

  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
