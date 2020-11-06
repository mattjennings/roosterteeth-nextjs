import React from 'react'
import { Box, Input, InputProps } from 'theme-ui'
import { HiSearch as SearchIcon } from 'react-icons/hi'
import Flex from './Flex'

export default function SearchBar(props: InputProps) {
  return (
    <Flex
      wrap="nowrap"
      align="center"
      sx={{
        p: 2,
        color: `text`,
        width: `100%`,
        backgroundColor: `gray.2`,
        borderRadius: `lg`,
        boxShadow: `default`,
        transition: `0.1s ease box-shadow`,
        '&:focus-within': {
          boxShadow: `outline`,
        },
      }}
      aria-label="Search Bar"
    >
      <Box
        as={SearchIcon}
        sx={{
          color: `gray.7`,
          mr: 2,
          width: 6,
          height: 6,
        }}
      />
      <Input
        {...(props as any)}
        sx={{
          p: 0,
          width: `100%`,
          border: `none`,
          '&:focus': {
            outline: `none`,
          },
          '&::placeholder': {
            color: `gray.5`,
          },
        }}
      />
    </Flex>
  )
}
