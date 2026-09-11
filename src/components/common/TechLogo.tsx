import React, { useState } from 'react';

interface TechLogoProps {
  id: string;
  size?: number;
  className?: string;
}

const FAVICON_MAP: Record<string, string> = {
  // Database / State
  'supabase-db': '/favicons/supabase.com.webp',
  'supabase-auth': '/favicons/supabase.com.webp',
  'supabase-storage': '/favicons/supabase.com.webp',
  neon: '/favicons/neon.tech.webp',
  turso: '/favicons/turso.tech.webp',
  mongodb: '/favicons/mongodb.com.webp',
  convex: '/favicons/convex.dev.png',
  cockroachdb: '/favicons/cockroachlabs.com.webp',
  tidb: '/favicons/pingcap.com.png',
  nhost: '/favicons/nhost.io.webp',
  aiven: '/favicons/aiven.io.webp',
  'upstash-redis': '/favicons/upstash.com.webp',
  'upstash-qstash': '/favicons/upstash.com.webp',

  // Auth
  clerk: '/favicons/clerk.com.webp',
  auth0: '/favicons/auth0.com.webp',
  kinde: '/favicons/kinde.com.webp',
  logto: '/favicons/logto.io.webp',
  workos: '/favicons/workos.com.webp',
  stytch: '/favicons/stytch.com.webp',
  descope: '/favicons/descope.com.webp',

  // Hosting / Edge / Storage
  vercel: '/favicons/vercel.com.webp',
  'cloudflare-pages': '/favicons/cloudflare.com.webp',
  'cloudflare-r2': '/favicons/cloudflare.com.webp',
  render: '/favicons/render.com.svg',
  netlify: '/favicons/netlify.com.webp',
  koyeb: '/favicons/koyeb.com.png',
  northflank: '/favicons/northflank.com.webp',
  'deno-deploy': '/favicons/deno.com.webp',
  backblaze: '/favicons/backblaze.com.png',
  uploadthing: '/favicons/uploadthing.com.png',
  cloudinary: '/favicons/cloudinary.com.webp',
  imagekit: '/favicons/imagekit.io.webp',
  uploadcare: '/favicons/uploadcare.com.webp',
  filestack: '/favicons/filestack.com.png',

  // Email
  resend: '/favicons/resend.com.webp',
  loops: '/favicons/loops.so.png',
  brevo: '/favicons/brevo.com.webp',
  mailjet: '/favicons/mailjet.com.webp',
  mailtrap: '/favicons/mailtrap.io.webp',
  plunk: '/favicons/useplunk.com.png',
  courier: '/favicons/courier.com.png',

  // Monitoring
  sentry: '/favicons/sentry.io.webp',
  betterstack: '/favicons/betterstack.com.webp',
  posthog: '/favicons/posthog.com.webp',
  umami: '/favicons/umami.is.webp',
  grafana: '/favicons/grafana.com.webp',
  axiom: '/favicons/axiom.co.webp',
  newrelic: '/favicons/newrelic.com.webp',
  glitchtip: '/favicons/glitchtip.com.png',
  cronitor: '/favicons/cronitor.io.png',
  checkly: '/favicons/checklyhq.com.webp',
  uptimerobot: '/favicons/uptimerobot.com.webp',
  healthchecks: '/favicons/healthchecks.io.webp',
  aptabase: '/favicons/aptabase.com.png',
  mixpanel: '/favicons/mixpanel.com.webp',
  amplitude: '/favicons/amplitude.com.webp',

  // CI/CD
  'github-actions': '/favicons/github.com.webp',
  'gitlab-ci': '/favicons/docs.gitlab.com.webp',
  circleci: '/favicons/circleci.com.webp',
  buildkite: '/favicons/buildkite.com.webp',

  // AI & Vector
  qdrant: '/favicons/qdrant.tech.png',
  groq: '/favicons/console.groq.com.webp',
  mistral: '/favicons/console.mistral.ai.webp',
  cerebras: '/favicons/cloud.cerebras.ai.webp',
  huggingface: '/favicons/huggingface.co.webp',
  openrouter: '/favicons/openrouter.ai.webp',
  langfuse: '/favicons/langfuse.com.webp',
  portkey: '/favicons/portkey.ai.webp',
  braintrust: '/favicons/braintrustdata.com.webp',
};

export const TechLogo: React.FC<TechLogoProps> = ({ id, size = 28, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const faviconUrl = FAVICON_MAP[id];

  if (faviconUrl && !hasError) {
    return (
      <img
        src={faviconUrl}
        alt={id}
        width={size}
        height={size}
        className={`tech-logo-img ${className}`}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `tech-logo-svg ${className}`,
  };

  switch (id) {
    case 'nextjs':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path d="M7 6V18M17 18L9 7.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 6V13" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'react-vite':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#141923" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#61DAFB" strokeWidth="1.6" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
        </svg>
      );

    case 'astro':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#0D1117" />
          <path d="M7 18L12 5L17 18M9.5 13H14.5" stroke="#FF5D01" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17C12.5 15.5 13.5 14.5 15 14" stroke="#BC52EE" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'sveltekit':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#FF3E00" />
          <path d="M15.5 8C14.5 6.5 12 6.5 10 7.5C8 8.5 7.5 10.5 8.5 12C9.5 13.5 12 13.5 14 14.5C16 15.5 15.5 17.5 14 18.5C12 19.5 9.5 19 8.5 17.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'remix':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#121212" />
          <path d="M6 7H13C15.2 7 17 8.8 17 11C17 13.2 15.2 15 13 15H6V7Z" stroke="#38BDF8" strokeWidth="2" />
          <path d="M12.5 15L17.5 20M6 7V20" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'nuxt':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#00DC82" />
          <path d="M4 18L9 9L14 18H4Z" fill="#041E15" />
          <path d="M11 18L15.5 10L20 18H11Z" fill="#041E15" opacity="0.8" />
        </svg>
      );

    case 'express':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#222222" />
          <text x="5" y="16" fill="#FFFFFF" fontFamily="monospace" fontSize="10" fontWeight="bold">ex</text>
        </svg>
      );

    case 'nestjs':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#E0234E" />
          <path d="M7 16L12 6L17 16L12 13L7 16Z" fill="#FFFFFF" />
        </svg>
      );

    case 'fastapi':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#059669" />
          <path d="M13 3L6 13H12L11 21L18 11H12L13 3Z" fill="#FFFFFF" />
        </svg>
      );

    case 'go-gin':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#00ADD8" />
          <text x="4.5" y="16" fill="#FFFFFF" fontFamily="monospace" fontSize="11" fontWeight="bold">GO</text>
        </svg>
      );

    case 'hono':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#E8590C" />
          <path d="M12 4C12 4 16 8 16 12C16 15 14 18 12 19C10 18 8 15 8 12C8 9 10 6 12 4Z" fill="#FFFFFF" />
        </svg>
      );

    case 'django':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#092E20" />
          <text x="6" y="16" fill="#44B78B" fontFamily="monospace" fontSize="12" fontWeight="bold">dj</text>
        </svg>
      );

    case 'supabase-db':
    case 'supabase-auth':
    case 'supabase-storage':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#1C1C1C" />
          <path d="M13.2 4L4.8 14.4H11.4L10.8 20L19.2 9.6H12.6L13.2 4Z" fill="#3ECF8E" />
        </svg>
      );

    case 'postgres':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#336791" />
          <path d="M6 10C6 7 8 5 12 5C16 5 18 7 18 10C18 14 16 18 12 18C10 18 8 17 6 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="9" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'neon':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#05191B" />
          <path d="M6 18V6L14 14V6M18 18V6" stroke="#00E599" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'planetscale':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#000000" />
          <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 3" />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
        </svg>
      );

    case 'turso':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#0E1D2D" />
          <path d="M6 16L12 8L18 16L12 14L6 16Z" fill="#4FF8D2" />
        </svg>
      );

    case 'mongodb':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#02341A" />
          <path d="M12 4C12 4 16 8 16 12C16 16 12 20 12 20C12 20 8 16 8 12C8 8 12 4 12 4Z" fill="#00ED64" />
        </svg>
      );

    case 'redis':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#1E0B0B" />
          <path d="M12 5L18 8.5L12 12L6 8.5L12 5Z" fill="#DC382D" />
          <path d="M6 11.5L12 15L18 11.5" stroke="#DC382D" strokeWidth="1.5" />
          <path d="M6 15.5L12 19L18 15.5" stroke="#DC382D" strokeWidth="1.5" />
        </svg>
      );

    case 'clerk':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#13151A" />
          <path d="M15 8.5C13.8 7.5 12 7.5 10.5 8.5C9 9.8 9 12 9 13.5C9 15 10.5 16.5 12 16.5C13.5 16.5 15 15.5 15.5 14.5" stroke="#6C47FF" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="16.5" cy="7.5" r="1.2" fill="#6C47FF" />
        </svg>
      );

    case 'auth0':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#1B1C20" />
          <path d="M12 4L18 7.5V13C18 16.5 15.5 19 12 20C8.5 19 6 16.5 6 13V7.5L12 4Z" stroke="#EB5424" strokeWidth="2" />
        </svg>
      );

    case 'better-auth':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#111827" />
          <path d="M7 6H13C15 6 16.5 7.2 16.5 9C16.5 10.5 15.5 11.5 14 11.8C15.8 12.2 17 13.5 17 15.2C17 17.2 15.2 18.5 13 18.5H7V6Z" fill="#F9FAFB" />
        </svg>
      );

    case 'authjs':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#18181B" />
          <path d="M12 5L18 8V13C18 16.5 15.5 19 12 20C8.5 19 6 16.5 6 13V8L12 5Z" stroke="#A855F7" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill="#A855F7" />
        </svg>
      );

    case 'cloudflare-r2':
    case 'cloudflare-pages':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#F38020" />
          <path d="M8 15H17C18.5 15 19.5 14 19.5 12.5C19.5 11 18.5 10 17 10C16.8 8 15 6.5 13 6.5C11.5 6.5 10 7.5 9.5 9C8 9 6.5 10 6.5 12C6.5 13.8 7.8 15 8 15Z" fill="#FFFFFF" />
        </svg>
      );

    case 'aws-s3':
    case 'aws-ses':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#232F3E" />
          <path d="M6 8L12 5L18 8V16L12 19L6 16V8Z" stroke="#FF9900" strokeWidth="2" />
          <path d="M12 5V19" stroke="#FF9900" strokeWidth="1.5" />
        </svg>
      );

    case 'uploadthing':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#EF4444" />
          <path d="M12 16V7M12 7L8 11M12 7L16 11M6 18H18" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'vercel':
    case 'vercel-ci':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path d="M12 5L20 19H4L12 5Z" fill="#FFFFFF" />
        </svg>
      );

    case 'railway':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#0B0D1B" />
          <rect x="6" y="8" width="12" height="8" rx="2" stroke="#D568FD" strokeWidth="2" />
          <line x1="9" y1="18" x2="15" y2="18" stroke="#D568FD" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'render':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#14181F" />
          <path d="M7 6H13C15.5 6 17 7.5 17 10C17 12 15.5 13.5 13.5 13.8L17.5 18H14.5L11 14H9V18H7V6ZM9 8V12H13C14 12 15 11.2 15 10C15 8.8 14 8 13 8H9Z" fill="#46E3B7" />
        </svg>
      );

    case 'flyio':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#24185B" />
          <circle cx="12" cy="11" r="5" fill="#8B5CF6" />
          <path d="M10 16L14 16L13 18L11 18Z" fill="#D8B4FE" />
        </svg>
      );

    case 'hetzner-vps':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#D50C2D" />
          <path d="M7 6V18M17 6V18M7 12H17" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'stripe':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#635BFF" />
          <path d="M14 9.5C13.5 9 12.8 8.8 12 8.8C10.8 8.8 10 9.4 10 10.4C10 11.8 14.5 11.8 14.5 14C14.5 15.5 13 16.2 11.8 16.2C10.5 16.2 9.5 15.6 9 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'lemonsqueezy':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#7047EB" />
          <ellipse cx="12" cy="12" rx="6" ry="4.5" fill="#FFC233" transform="rotate(-30 12 12)" />
        </svg>
      );

    case 'paddle':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#2E3338" />
          <path d="M7 6H13C15.5 6 17 7.5 17 10C17 12.5 15.5 14 13 14H10V18H7V6Z" fill="#38EF7D" />
        </svg>
      );

    case 'mercadopago':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#009EE3" />
          <path d="M6 13L9 10L14 15L18 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'resend':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path d="M6 6H12.5C14.8 6 16.5 7.5 16.5 9.8C16.5 11.5 15.2 12.8 13.5 13.2L17.5 18H14L10.5 13.5H8.5V18H6V6ZM8.5 8.2V11.3H12.2C13.3 11.3 14 10.6 14 9.8C14 8.9 13.3 8.2 12.2 8.2H8.5Z" fill="#FFFFFF" />
        </svg>
      );

    case 'postmark':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#FFDE00" />
          <path d="M5 8L12 13L19 8M5 7H19V17H5V7Z" stroke="#222222" strokeWidth="1.8" />
        </svg>
      );

    case 'sendgrid':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#009DD9" />
          <rect x="7" y="7" width="4" height="4" fill="#FFFFFF" />
          <rect x="13" y="7" width="4" height="4" fill="#FFFFFF" />
          <rect x="7" y="13" width="4" height="4" fill="#FFFFFF" />
          <rect x="13" y="13" width="4" height="4" fill="#FFFFFF" />
        </svg>
      );

    case 'sentry':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#362D59" />
          <path d="M12 4L19 18H5L12 4Z" stroke="#FB4455" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="1.5" fill="#FB4455" />
        </svg>
      );

    case 'posthog':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#F7A501" />
          <path d="M6 14C6 10 9 7 13 7C16 7 18 9 18 12C18 15 15 17 12 17H6V14Z" fill="#1D1F27" />
        </svg>
      );

    case 'betterstack':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#000000" />
          <text x="6" y="17" fill="#FFFFFF" fontFamily="monospace" fontSize="14" fontWeight="bold">B</text>
        </svg>
      );

    case 'datadog':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#632CA6" />
          <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );

    case 'github-actions':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#24292F" />
          <circle cx="12" cy="12" r="6" stroke="#2DA44E" strokeWidth="2" />
          <path d="M11 9L15 12L11 15V9Z" fill="#2DA44E" />
        </svg>
      );

    case 'gitlab-ci':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#FC6D26" />
          <path d="M12 18L6 10H18L12 18Z" fill="#E24329" />
        </svg>
      );

    case 'docker-hub':
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#0db7ed" />
          <path d="M6 13C6 15 9 17 14 17C18 17 19 14 19 13H6Z" fill="#FFFFFF" />
          <rect x="7" y="10" width="2" height="2" fill="#FFFFFF" />
          <rect x="10" y="10" width="2" height="2" fill="#FFFFFF" />
          <rect x="13" y="10" width="2" height="2" fill="#FFFFFF" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <rect width="24" height="24" rx="5" fill="#1E293B" />
          <text x="7" y="16" fill="#38BDF8" fontFamily="monospace" fontSize="10" fontWeight="bold">
            {id.slice(0, 2).toUpperCase()}
          </text>
        </svg>
      );
  }
};
