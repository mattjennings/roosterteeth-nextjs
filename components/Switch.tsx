import clsx from 'clsx'
import { HTMLProps, useCallback, useEffect, useState } from 'react'

export interface SwitchProps extends HTMLProps<HTMLButtonElement> {
  checked?: boolean
  onChecked?: (checked: boolean) => any
}

export default function Switch({
  className,
  checked,
  onChecked,
  onClick,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(checked ?? false)

  const handleClick = useCallback(
    (e) => {
      setInternalChecked((prev) => {
        onChecked?.(!prev)
        return !prev
      })
      onClick?.(e)
    },
    [onChecked, onClick]
  )

  useEffect(() => {
    setInternalChecked(checked ?? false)
  }, [checked])

  return (
    <button
      {...(props as any)}
      className={clsx(
        `relative inline-flex flex-shrink-0 h-6 w-10 p-0.5 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus`,
        internalChecked
          ? `bg-green-500 dark:bg-green-600`
          : `bg-gray-400 dark:bg-gray-500`,
        className
      )}
      aria-pressed={internalChecked}
      onClick={handleClick}
    >
      <span
        aria-hidden
        className={clsx(
          `pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`,
          internalChecked ? `translate-x-4` : `translate-x-0`
        )}
      />
    </button>
  )
}
