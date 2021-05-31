import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../bootstrap';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// https://stackoverflow.com/questions/63243597/property-y-does-not-exist-on-type-defaultrootstate
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;