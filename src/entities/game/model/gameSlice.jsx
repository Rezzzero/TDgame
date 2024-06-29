import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstEnemies: [],
  secondEnemies: [],
  firstWizards: [],
  secondWizards: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setGameState } = gameSlice.actions;
export default gameSlice.reducer;
