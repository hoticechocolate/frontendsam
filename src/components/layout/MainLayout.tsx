import type { ReactNode } from "react"
import Footer from "./Footer"
import Header from "./Header"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
        {children}
        <Footer />
      </main>
    </div>
  )
}
