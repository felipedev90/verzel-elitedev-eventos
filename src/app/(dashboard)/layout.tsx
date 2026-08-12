import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken } from '@/server/auth/session'
import { DashboardNav } from '@/components/layout/DashboardNav'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav role={session.role} />
      <div className="flex-1 px-6 py-8">{children}</div>
    </div>
  )
}
