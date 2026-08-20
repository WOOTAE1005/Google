// Some relationship names already carry an honorific (e.g. "김상우 차장님");
// appending "님" unconditionally would double it up ("차장님님").
export function withHonorific(name: string): string {
  return name.endsWith('님') ? name : `${name}님`;
}
