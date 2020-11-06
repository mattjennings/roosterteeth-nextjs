import React from 'react'
import { Box, InputProps } from 'theme-ui'

export default function Switch({
  value,
  onChange,
  onBlur,
  onFocus,
  checked,
  disabled,
  name,
  ...props
}: InputProps) {
  return (
    <label>
      <Box
        sx={{
          height: 6,
          width: 10,
          bg: checked ? `green.4` : `gray.4`,
          borderRadius: `100px`,
          cursor: disabled ? `inherit` : `pointer`,
          p: 1,
          transition: `background 0.3s`,
          alignItems: `center`,
          '& input': {
            display: `none`,
          },
        }}
      >
        <input
          hidden
          type="checkbox"
          role="switch"
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          checked={checked}
          disabled={disabled}
        />
        <Box
          sx={{
            width: 4,
            height: 4,
            bg: `white`,
            borderRadius: `200px`,
            transition: `transform 0.3s`,
            transform: `translateX(${checked ? `16px` : `0`})`,
          }}
          {...(props as any)}
        />
      </Box>
    </label>
  )
}
