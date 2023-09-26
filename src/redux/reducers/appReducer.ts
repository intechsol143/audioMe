import {ActionType} from '../actions';
const initialState = {
  currentLocation: {},
  selectedTours: 'all',
  allCities: {
    dropdownCities: [],
    toursCities: [],
  },
  userCity: {
    id: null,
    name: '',
  },
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ActionType.SELECTED_TOUR: {
      return {
        ...state,
        selectedTours: payload,
      };
    }
    case ActionType.SET_CITIES: {
      return {
        ...state,
        allCities: {
          ...state.allCities,
          dropdownCities: payload.dropdownCities,
          toursCities: payload.toursCities,
        },
      };
    }
    case ActionType.SET_USER_CITY: {
      return {
        ...state,
        userCity: {
          ...state.userCity,
          id: payload.id,
          name: payload.name,
        },
      };
    }

    default:
      return state;
  }
};
