import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up', '/public'],
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Covers /api/chats, /api/chat/get, /api/chat/ai
  ],
};