'use client'

import { Home, Map, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavigator = () => {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Map',
      href: '/map',
      icon: Map
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-blue-950">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] ${
                isActive ? 'text-blue-500' : 'text-white'
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${
                  isActive ? 'text-blue-500' : 'text-white'
                }`}
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigator
