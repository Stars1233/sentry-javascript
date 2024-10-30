/* eslint-disable @sentry-internal/sdk/no-class-field-initializers */

import * as Sentry from '@sentry/browser';
import type { Client as SentryClient, Event, EventHint, IntegrationFn } from '@sentry/types';
import type { LDContext, LDEvaluationDetail, LDInspectionFlagUsedHandler } from 'launchdarkly-js-client-sdk';
import type { LaunchDarklyOptions } from './types';

/**
 * Sentry integration for capturing feature flags from LaunchDarkly.
 *
 * See the [feature flag documentation](TODO:) for more information.
 *
 * @example
 *
 * ```
 * TODO:
 * Sentry.init({
 *   dsn: '__DSN__',
 *   integrations: [Sentry.replayIntegration()],
 * });
 * ```
 */
export const launchDarklyIntegration = ((_options?: LaunchDarklyOptions) => {
  // const { _ldClient } = options;
  // const ldClient = _ldClient as LDClient; // for type hint

  return {
    name: 'launchdarkly',

    processEvent(event: Event, _hint: EventHint, _client: SentryClient): Event {
      const scope = Sentry.getCurrentScope(); // client doesn't have getCurrentScope
      const flagContext = { values: scope.getFlags() };
      if (event.contexts) {
        event.contexts.flags = flagContext;
      } else {
        event.contexts = { flags: flagContext };
      }
      return event;
    },
  };
}) satisfies IntegrationFn;

/**
 * https://launchdarkly.github.io/js-client-sdk/interfaces/LDInspectionFlagUsedHandler.html //TODO: rm this link
 * TODO: docstring
 */
export class SentryInspector implements LDInspectionFlagUsedHandler {
  public name = 'sentry-flag-used-handler';

  public synchronous = true; // TODO: T or F?

  public type = 'flag-used' as const;

  /**
   * TODO: docstring
   */
  public method(flagKey: string, flagDetail: LDEvaluationDetail, _context: LDContext): void {
    if (typeof flagDetail.value === 'boolean') {
      Sentry.getCurrentScope().insertFlag(flagKey, flagDetail.value);
    }
    return;
  }
}

/*

import SentryInspector from @sentry/ld

client = LDClient.init(..., SentryInspector)

sentry.init(integrations: [LDIntegration])

*/
