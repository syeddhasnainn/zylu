import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/((?!signin).*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // If the user is on the sign-in page AND is authenticated,
  // redirect them to a default authenticated page (e.g., dashboard or home).
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/"); // Redirect to home page
  }

  // If the request is for any other page (protected page)
  // AND the user is NOT authenticated, redirect them to the sign-in page.
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
