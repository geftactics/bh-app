/**
 * TabBarBackground shim for web and Android platforms
 * where the tab bar is generally opaque and doesn't need blur effects
 */
export default undefined;

/**
 * Hook that returns bottom tab overflow value
 * Returns 0 for non-iOS platforms where no overflow is needed
 */
export function useBottomTabOverflow(): number {
  return 0;
}
