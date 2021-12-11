/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defaultFetchConfig, expectResponseCode, getApiUrl } from '../utils'
import { AuthError, RegisterError } from './index'

/**
 * Requests to do a local login with a provided username and password.
 * @param username The username for which the login should be tried.
 * @param password The password which should be used to login.
 * @throws {AuthError.INVALID_CREDENTIALS} when the username or password is wrong.
 * @throws {AuthError.LOGIN_DISABLED} when the local login is disabled on the backend.
 */
export const doLocalLogin = async (username: string, password: string): Promise<void> => {
  const response = await fetch(getApiUrl() + 'auth/local/login', {
    ...defaultFetchConfig,
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })

  if (response.status === 400) {
    throw new Error(AuthError.LOGIN_DISABLED)
  }

  if (response.status === 401) {
    throw new Error(AuthError.INVALID_CREDENTIALS)
  }

  expectResponseCode(response, 201)
}

/**
 * Requests to register a new local user in the backend.
 * @param username The username of the new user.
 * @param displayName The display name of the new user.
 * @param password The password of the new user.
 * @throws {RegisterError.USERNAME_EXISTING} when there is already an existing user with the same user name.
 * @throws {RegisterError.REGISTRATION_DISABLED} when the registration of local users has been disabled on the backend.
 */
export const doLocalRegister = async (username: string, displayName: string, password: string): Promise<void> => {
  const response = await fetch(getApiUrl() + 'auth/local', {
    ...defaultFetchConfig,
    method: 'POST',
    body: JSON.stringify({
      username,
      displayName,
      password
    })
  })

  if (response.status === 409) {
    throw new Error(RegisterError.USERNAME_EXISTING)
  }

  if (response.status === 400) {
    throw new Error(RegisterError.REGISTRATION_DISABLED)
  }

  expectResponseCode(response)
}

/**
 * Requests to update the user's current password to a new one.
 * @param currentPassword The current password of the user for confirmation.
 * @param newPassword The new password of the user.
 * @throws {AuthError.INVALID_CREDENTIALS} when the current password is wrong.
 * @throws {AuthError.LOGIN_DISABLED} when local login is disabled on the backend.
 */
export const doLocalPasswordChange = async (currentPassword: string, newPassword: string): Promise<void> => {
  const response = await fetch(getApiUrl() + 'auth/local', {
    ...defaultFetchConfig,
    method: 'PUT',
    body: JSON.stringify({
      currentPassword,
      newPassword
    })
  })

  if (response.status === 401) {
    throw new Error(AuthError.INVALID_CREDENTIALS)
  }

  if (response.status === 400) {
    throw new Error(AuthError.LOGIN_DISABLED)
  }

  expectResponseCode(response)
}
