import React, { Fragment } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { classNames } from "../../util/classNames"
import { useDisconnect } from "wagmi"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

const userNavigation = [
  { name: "Your Profile", href: "/profile" }
]

interface UserNavigationProps {
  displaySize: "small" | "large";
}

export default function UserNavigation(props: UserNavigationProps) {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const { disconnect } = useDisconnect()
  const user  = session?.user

  if (!user) {
    return null
  }

  let result
  if (props.displaySize === "large") {
    result = (
      <div className="hidden md:block">
        <div className="ml-4 flex items-center md:ml-6">
          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative z-10">
            <div>
              <Menu.Button
                className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.imageUrl}
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
                <Menu.Item key={"logout"}>
                  {({ active }) => (
                    <a
                      onClick={() => {
                        disconnect()
                        signOut()
                      }}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                      )}
                    >
                      Sign Out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    )
  } else {
    result = (
      <>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={user.imageUrl}
                alt=""
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium leading-none text-white">
                {user.name}
              </div>
              <div className="text-sm font-medium leading-none text-gray-400">
                {user.email}
              </div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            {userNavigation.map((item) => (
              <Link href={item.href} key={item.name}>
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  {item.name}
                </Disclosure.Button>
              </Link>
            ))}
            <Disclosure.Button
              key={"logout"}
              as="a"
              onClick={() => {
                disconnect()
                signOut()
              }}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
            >
              Sign Out
            </Disclosure.Button>
          </div>
        </div>
      </>
    )
  }

  return result
}
