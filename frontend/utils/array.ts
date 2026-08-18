export function arrayIntersection<T extends any>(first: T[], second: T[]): T[] {
  return first.filter(it => {
    const index = second.indexOf(it);
    if (index !== -1) {
      second.splice(index, 1); // Remove matched item to prevent duplicate pairing
      return true;
    }
    return false;
  })
}