const YAML_RE = /\.ya?ml(?:\?.*)?$/i

export function isYamlFile(id: string): boolean {
  return YAML_RE.test(id)
}
