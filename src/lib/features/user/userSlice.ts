// src/store/features/user/userSlice.ts
import { RoleEnums } from '@/enums/role';
import { User } from '@/types/user-types';
import { createSlice } from '@reduxjs/toolkit';

/* 
 roles: [
  {role: {roleName: 'ADMIN', id: '1'}, userId: '1', roleId: '1'},
  {role: {roleName: 'USER', id: '2'}, userId: '2', roleId: '2'},
 ]

*/

interface UserState {
  profile: User | null;
  roles: RoleEnums[] | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  profile: null,
  roles: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = !!action.payload;
      state.roles = action.payload?.userRoles || null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.roles = null;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer: userReducer } = userSlice;
export const { setUserProfile, clearUserProfile } = actions;
export default userReducer;

export const hasUserRole = (
  profile: User | null,
  roles?: RoleEnums | RoleEnums[]
): boolean => {
  // If no roles are provided, allow access
  if (!roles) return true;

  // If user is not authenticated, deny access
  if (!profile || !profile.userRoles || profile.userRoles.length === 0) {
    return false;
  }

  // Get the role names of the user
  const userRoleNames = profile.userRoles
    .filter((userRole) => userRole.role)
    .map((userRole) => userRole.role!.roleName);

  // Check if the user has any of the required roles
  if (Array.isArray(roles)) {
    return roles.some((role) => userRoleNames.includes(role));
  }

  return userRoleNames.includes(roles);
};

// Selectors
export const selectProfile = (state: { user: UserState }) => state.user.profile;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
