import {TypedUseSelectorHook, useSelector} from 'react-redux';
import type {RootState} from '@src/utilis/types';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
