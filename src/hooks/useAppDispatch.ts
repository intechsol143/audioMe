import {useDispatch} from 'react-redux';
import type {AppDispatch} from '@src/utilis/types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
