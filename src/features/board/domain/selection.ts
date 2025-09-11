export type Selection = Set<string>;

export type SelectionModifier = 'replace' | 'add' | 'toggle';

export const selectNodes = (
  initialSelected: Selection,
  ids: string[],
  modif: SelectionModifier = 'replace'
): Selection => {
  if (modif === 'replace') {
    return new Set(ids);
  }

  if (modif === 'add') {
    return new Set([...initialSelected, ...ids]);
  }

  if (modif === 'toggle') {
    const currentIds = new Set(initialSelected);
    const newIds = new Set(ids);

    const base = Array.from(initialSelected).filter((id) => !newIds.has(id));
    const added = ids.filter((id) => !currentIds.has(id));

    return new Set([...base, ...added]);
  }

  return initialSelected;
};
