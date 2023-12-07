/*
 * Transition Animations
 */

export const fade = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
