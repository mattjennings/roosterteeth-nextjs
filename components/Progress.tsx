import clsx from 'clsx'
import { HTMLProps } from 'react'

export default function Progress({
  value,
  ...props
}: HTMLProps<HTMLDivElement> & { value: number }) {
  return (
    <div {...props} className={clsx(props.className, `relative`)}>
      <div className="overflow-hidden h-1 md:h-2 text-xs flex bg-white dark:bg-gray-400">
        <div
          style={{ width: `${Math.round(value * 100)}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
        ></div>
      </div>
    </div>
  )
}
