
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="workspace-layout">
      <Sidebar />

      <div className="workspace-content">
        <Header />

        <main className="workspace-main">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
