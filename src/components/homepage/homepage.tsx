import Link from "next/link"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Navbar from "../Navbar"

export default function Component() {
  return (
    <div className="flex flex-col items-center min-h-[100dvh]">
      <main className="flex-1 w-screen">
        <section className="w-fit mx-auto py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Mastering Web Development with Gamified Learning
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Unlock your full potential with our innovative online course
                    that combines the power of YouTube playlists and gamified
                    learning. Embark on an engaging journey to become a skilled
                    web developer.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Enroll Now
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Image
                  src="/images/hero.png"
                  width="800"
                  height="800"
                  alt="Hero"
                  className="rounded-xl w-full lg:order-last"
                />
                <span className="sr-only">
                  Vector image by VectorStock / catalyststuff
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unlock Your Potential with Gamified Learning
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our online course leverages the power of gamification to make
                  learning web development engaging and rewarding. Earn points,
                  climb leaderboards, and unlock achievements as you progress
                  through the curriculum.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Progress Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor your progress and see how you&apos;re advancing
                    through the course material.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Leaderboards</h3>
                  <p className="text-muted-foreground">
                    Compete with other students and climb the leaderboards to
                    showcase your skills.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Rewards</h3>
                  <p className="text-muted-foreground">
                    Earn badges, certificates, and other rewards as you complete
                    challenges and milestones.
                  </p>
                </div>
              </div>
              <Image
                src="/placeholder.svg"
                width="550"
                height="310"
                alt="Gamified Learning"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Course Curriculum
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Explore the Course Curriculum
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our online course is structured around engaging YouTube
                  playlists, allowing you to learn at your own pace and revisit
                  the content whenever you need.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Web Development Fundamentals
                  </h3>
                  <p className="text-muted-foreground">
                    Learn the essential HTML, CSS, and JavaScript skills to
                    build modern web applications.
                  </p>
                  <div className="flex items-center gap-2">
                    <PlayIcon className="h-5 w-5 text-primary" />
                    <span>12 videos</span>
                  </div>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">React.js Mastery</h3>
                  <p className="text-muted-foreground">
                    Dive deep into the React.js library and learn how to build
                    complex, interactive user interfaces.
                  </p>
                  <div className="flex items-center gap-2">
                    <PlayIcon className="h-5 w-5 text-primary" />
                    <span>18 videos</span>
                  </div>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">
                    Backend Development with Node.js
                  </h3>
                  <p className="text-muted-foreground">
                    Explore the world of server-side development using Node.js
                    and build robust, scalable APIs.
                  </p>
                  <div className="flex items-center gap-2">
                    <PlayIcon className="h-5 w-5 text-primary" />
                    <span>15 videos</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/videoseries?list=PLu8EoSxDXHP6CGK4YVJhL_VWetA865GOH"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Students Say
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from our satisfied students who have transformed their
                  careers through our gamified online course.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card className="bg-background p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-muted p-1 text-4xl">🙂</div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">Sarah Johnson</div>
                    <p className="text-muted-foreground">
                      &quot;The gamified learning experience kept me engaged\n
                      and motivated throughout the course. I was able to\n learn
                      web development at my own pace and have fun\n while doing
                      it.&quot;
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="bg-background p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-muted p-1 text-4xl">😊</div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">Michael Lee</div>
                    <p className="text-muted-foreground">
                      &quot;The YouTube playlists made the course content\n easy
                      to follow and understand. I was able to\n revisit the
                      videos whenever I needed a refresher,\n which was
                      incredibly helpful.&quot;
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Enroll Now
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Start Your Web Development Journey Today
                </h2>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Enroll Now
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Why Choose Us?
                </div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Our gamified online course is designed to help you become a
                  skilled web developer in a fun and engaging way. With progress
                  tracking, leaderboards, and rewards, you&quot;ll stay
                  motivated and excited to learn.
                </p>
                <Link
                  href="#"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Acme Online Courses. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}


function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}