'use client'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle, NavigationMenuTrigger, NavigationMenuContent } from './ui/navigation-menu'
import { cn } from '@/lib/utils'

export default function Navbar() {
  return (
    <NavigationMenu className="mx-auto mb-8">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#accueil" className={navigationMenuTriggerStyle()}>Accueil</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#projets" className={navigationMenuTriggerStyle()}>Projets</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#services" className={navigationMenuTriggerStyle()}>Services</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#contact" className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
