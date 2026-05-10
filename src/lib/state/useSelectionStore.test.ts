import { beforeEach, describe, expect, test } from 'bun:test';
import { useSelectionStore } from './useSelectionStore';

function reset() {
  useSelectionStore.setState({
    selected: null,
    selectedProductId: null,
    hovered: null,
    editorial: false,
  });
}

describe('useSelectionStore.step', () => {
  beforeEach(reset);

  test('no-op when nothing is selected', () => {
    useSelectionStore.getState().step(1);
    expect(useSelectionStore.getState().selected).toBeNull();
  });

  test('moves forward and updates name + category', () => {
    useSelectionStore.getState().select({ category: 'picks', name: 'Picks' });
    useSelectionStore.getState().step(1);
    const sel = useSelectionStore.getState().selected;
    expect(sel).toEqual({ category: 'electronics', name: 'Electronics' });
  });

  test('wraps at the end', () => {
    useSelectionStore.getState().select({ category: 'artists', name: 'Artists' });
    useSelectionStore.getState().step(1);
    expect(useSelectionStore.getState().selected?.category).toBe('picks');
  });

  test('clears selectedProductId on step', () => {
    useSelectionStore.getState().select({ category: 'picks', name: 'Picks' });
    useSelectionStore.getState().selectProduct('some-id');
    useSelectionStore.getState().step(1);
    expect(useSelectionStore.getState().selectedProductId).toBeNull();
  });
});
