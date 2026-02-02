export const slideUp = {
  initial: {
    y: '4%',
  },
  open: (i: number) => ({
    y: '0%',
    transition: { duration: 0.5, delay: 0.1 * i },
  }),
  closed: {
    y: '4%',
    transition: { duration: 0.5 },
  },
}

export const opacity = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
}
