import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog reverse proxy: events/assets go through our own domain so ad
  // blockers don't drop them (and the replay recorder script loads too).
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*"
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*"
      }
    ];
  },
  // Required so PostHog's trailing-slash endpoints aren't redirected.
  skipTrailingSlashRedirect: true
};

export default nextConfig;
