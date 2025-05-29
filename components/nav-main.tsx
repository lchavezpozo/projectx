"use client"

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link href="/dashboard/booking" className="w-full">
              <SidebarMenuButton
                tooltip="Quick Booking"
                className={`w-full min-w-8 duration-200 ease-linear ${"hover:bg-primary/90 hover:text-primary-foreground"}`}
              >
                <IconCirclePlusFilled />
                <span>Quick Booking</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className="w-full">
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className={`w-full ${
                    pathname === item.url
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/90 hover:text-primary-foreground"
                  }`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
