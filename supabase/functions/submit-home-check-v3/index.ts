import { withSupabase } from 'npm:@supabase/server@^1'

// ============================================================
// MOOHAE HOME CHECK V3
// PUBLIC EDGE FUNCTION
//
// Purpose
// - Accept only canonical HOME CHECK V3 payloads.
// - Validate every customer-supplied value at the Edge.
// - Persist through the internal-only V3 RPC.
// - Reuse the existing booking-token system without modifying it.
//
// SECURITY
// - Browser never calls the internal RPC directly.
// - No service-role/secret values are exposed to the client.
// - Raw booking tokens are never logged.
// - PII payloads are never logged.
// ============================================================

const ALLOWED_ORIGINS = new Set([
  'https://moohae.me',
  'https://www.moohae.me',
  'https://moohae-home-concept-2026.kaverchi00.chatgpt.site',
  'https://moohae-care.kaverchi00.chatgpt.site',
])

const MAX_BODY_CHARS = 10_000

const HOUSEHOLD_CODES = new Set([
  'child',
  'pet',
  'adult_family',
  'solo_adult',
])

const PRIORITY_SPACE_CODES = new Set([
  'bedroom',
  'living_room',
  'child_space',
  'pet_space',
  'whole_home',
  'other',
])

const CHECK_REASON_CODES = new Set([
  'visible_dust_hair',
  'difficult_to_manage',
  'frequent_contact',
  'current_condition',
  'general_check',
])

const FOCUS_OBJECT_CODES = new Set([
  'mattress_bedding',
  'sofa_fabric',
  'rug_carpet',
  'floor',
  'other',
  'undecided',
])

const CURRENT_MANAGEMENT_CODES = new Set([
  'routine_homecare',
  'frequent_washing',
  'dedicated_equipment',
  'professional_care',
  'not_managed',
])

const CHECK_GOAL_CODES = new Set([
  'current_condition',
  'care_priority',
  'care_needed_now',
  'next_check_timing',
])

type Payload = {
  name?: unknown
  phone?: unknown
  privacy_consent?: unknown
  website?: unknown

  home_household_members?: unknown
  home_priority_spaces?: unknown
  home_priority_space_other?: unknown
  home_check_reason?: unknown
  home_focus_objects?: unknown
  home_focus_object_other?: unknown
  home_current_management?: unknown
  home_check_goal?: unknown
}

function isAllowedOrigin(origin: string | null) {
  if (!origin) {
    return false
  }

  if (ALLOWED_ORIGINS.has(origin)) {
    return true
  }

  // Local development only.
  return (
    /^http:\/\/localhost(?::\d+)?$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin)
  )
}

function json(
  body: Record<string, unknown>,
  status = 200,
) {
  return Response.json(
    body,
    {
      status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}

function strictText(
  value: unknown,
  min: number,
  max: number,
) {
  if (typeof value !== 'string') {
    return null
  }

  const cleaned = value.trim()

  if (
    cleaned.length < min ||
    cleaned.length > max
  ) {
    return null
  }

  return cleaned
}

function optionalText(
  value: unknown,
  max: number,
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  return strictText(
    value,
    1,
    max,
  )
}

function normalizePhone(
  value: unknown,
) {
  if (typeof value !== 'string') {
    return null
  }

  const digits =
    value.replace(/\D/g, '')

  if (
    digits.length < 9 ||
    digits.length > 12
  ) {
    return null
  }

  return digits
}

function validateCodeArray(
  value: unknown,
  allowed: Set<string>,
  min: number,
  max: number,
) {
  if (!Array.isArray(value)) {
    return null
  }

  if (
    value.length < min ||
    value.length > max
  ) {
    return null
  }

  if (
    !value.every(
      (item): item is string =>
        typeof item === 'string',
    )
  ) {
    return null
  }

  const cleaned =
    value.map(
      (item) => item.trim(),
    )

  if (
    cleaned.some(
      (item) =>
        !item ||
        !allowed.has(item),
    )
  ) {
    return null
  }

  if (
    new Set(cleaned).size !==
      cleaned.length
  ) {
    return null
  }

  return cleaned
}

function validateSingleCode(
  value: unknown,
  allowed: Set<string>,
) {
  if (typeof value !== 'string') {
    return null
  }

  const cleaned = value.trim()

  return allowed.has(cleaned)
    ? cleaned
    : null
}

function extractDiagnosisId(
  data: unknown,
) {
  const row =
    Array.isArray(data) &&
    data.length > 0
      ? data[0]
      : null

  if (
    !row ||
    typeof row !== 'object' ||
    !('diagnosis_id' in row) ||
    typeof row.diagnosis_id !== 'string'
  ) {
    return null
  }

  return row.diagnosis_id
}

export default {
  fetch: withSupabase(
    {
      auth: 'publishable',
    },

    async (
      req,
      ctx,
    ) => {
      // ========================================================
      // ORIGIN + METHOD
      // ========================================================

      const origin =
        req.headers.get('origin')

      if (!isAllowedOrigin(origin)) {
        return json(
          {
            ok: false,
            error: 'origin_not_allowed',
          },
          403,
        )
      }

      if (req.method !== 'POST') {
        return json(
          {
            ok: false,
            error: 'method_not_allowed',
          },
          405,
        )
      }

      // ========================================================
      // CONTENT TYPE + BODY SIZE + JSON
      // ========================================================

      const contentType =
        req.headers.get('content-type') || ''

      if (
        !contentType
          .toLowerCase()
          .includes('application/json')
      ) {
        return json(
          {
            ok: false,
            error: 'invalid_content_type',
          },
          415,
        )
      }

      let rawBody = ''

      try {
        rawBody = await req.text()
      } catch {
        return json(
          {
            ok: false,
            error: 'invalid_body',
          },
          400,
        )
      }

      if (
        !rawBody ||
        rawBody.length > MAX_BODY_CHARS
      ) {
        return json(
          {
            ok: false,
            error: 'invalid_body_size',
          },
          413,
        )
      }

      let body: Payload

      try {
        body = JSON.parse(rawBody)
      } catch {
        return json(
          {
            ok: false,
            error: 'invalid_json',
          },
          400,
        )
      }

      if (
        !body ||
        typeof body !== 'object' ||
        Array.isArray(body)
      ) {
        return json(
          {
            ok: false,
            error: 'invalid_json',
          },
          400,
        )
      }

      // ========================================================
      // HONEYPOT
      // ========================================================

      if (
        typeof body.website === 'string' &&
        body.website.trim()
      ) {
        return json({
          ok: true,
          customer_type: 'home',
          check_version: 3,
          booking_available: false,
        })
      }

      // ========================================================
      // CUSTOMER / PRIVACY
      // ========================================================

      const name =
        strictText(
          body.name,
          1,
          80,
        )

      const phone =
        normalizePhone(
          body.phone,
        )

      if (!name) {
        return json(
          {
            ok: false,
            error: 'invalid_name',
          },
          400,
        )
      }

      if (!phone) {
        return json(
          {
            ok: false,
            error: 'invalid_phone',
          },
          400,
        )
      }

      if (
        body.privacy_consent !== true
      ) {
        return json(
          {
            ok: false,
            error: 'consent_required',
          },
          400,
        )
      }

      // ========================================================
      // Q1 HOUSEHOLD
      // 1~3. solo_adult may coexist with pet only.
      // ========================================================

      const household =
        validateCodeArray(
          body.home_household_members,
          HOUSEHOLD_CODES,
          1,
          3,
        )

      if (!household) {
        return json(
          {
            ok: false,
            error:
              'invalid_home_household_members',
          },
          400,
        )
      }

      if (
        household.includes('solo_adult') &&
        (
          household.includes('child') ||
          household.includes('adult_family')
        )
      ) {
        return json(
          {
            ok: false,
            error:
              'conflicting_home_household_members',
          },
          400,
        )
      }

      // ========================================================
      // Q2 PRIORITY SPACES
      // 1~2. whole_home is exclusive.
      // ========================================================

      const prioritySpaces =
        validateCodeArray(
          body.home_priority_spaces,
          PRIORITY_SPACE_CODES,
          1,
          2,
        )

      if (!prioritySpaces) {
        return json(
          {
            ok: false,
            error:
              'invalid_home_priority_spaces',
          },
          400,
        )
      }

      if (
        prioritySpaces.includes(
          'whole_home',
        ) &&
        prioritySpaces.length !== 1
      ) {
        return json(
          {
            ok: false,
            error:
              'whole_home_must_be_exclusive',
          },
          400,
        )
      }

      const prioritySpaceOther =
        optionalText(
          body.home_priority_space_other,
          80,
        )

      if (
        prioritySpaces.includes('other')
      ) {
        if (!prioritySpaceOther) {
          return json(
            {
              ok: false,
              error:
                'invalid_home_priority_space_other',
            },
            400,
          )
        }
      } else if (
        prioritySpaceOther !== null
      ) {
        return json(
          {
            ok: false,
            error:
              'unexpected_home_priority_space_other',
          },
          400,
        )
      }

      // ========================================================
      // Q3 CHECK REASON
      // ========================================================

      const checkReason =
        validateSingleCode(
          body.home_check_reason,
          CHECK_REASON_CODES,
        )

      if (!checkReason) {
        return json(
          {
            ok: false,
            error:
              'invalid_home_check_reason',
          },
          400,
        )
      }

      // ========================================================
      // Q4 FOCUS OBJECTS
      // 1~2. undecided is exclusive.
      // ========================================================

      const focusObjects =
        validateCodeArray(
          body.home_focus_objects,
          FOCUS_OBJECT_CODES,
          1,
          2,
        )

      if (!focusObjects) {
        return json(
          {
            ok: false,
            error:
              'invalid_home_focus_objects',
          },
          400,
        )
      }

      if (
        focusObjects.includes(
          'undecided',
        ) &&
        focusObjects.length !== 1
      ) {
        return json(
          {
            ok: false,
            error:
              'undecided_must_be_exclusive',
          },
          400,
        )
      }

      const focusObjectOther =
        optionalText(
          body.home_focus_object_other,
          80,
        )

      if (
        focusObjects.includes('other')
      ) {
        if (!focusObjectOther) {
          return json(
            {
              ok: false,
              error:
                'invalid_home_focus_object_other',
            },
            400,
          )
        }
      } else if (
        focusObjectOther !== null
      ) {
        return json(
          {
            ok: false,
            error:
              'unexpected_home_focus_object_other',
          },
          400,
        )
      }

      // ========================================================
      // Q5 CURRENT MANAGEMENT
      // ========================================================

      const currentManagement =
        validateSingleCode(
          body.home_current_management,
          CURRENT_MANAGEMENT_CODES,
        )

      if (!currentManagement) {
        return json(
          {
            ok: false,
            error:
              'invalid_home_current_management',
          },
          400,
        )
      }

      // ========================================================
      // Q6 CHECK GOAL
      // ========================================================

      const checkGoal =
        validateSingleCode(
          body.home_check_goal,
          CHECK_GOAL_CODES,
        )

      if (!checkGoal) {
        return json(
          {
            ok: false,
            error:
              'invalid_home_check_goal',
          },
          400,
        )
      }

      // ========================================================
      // INTERNAL RPC
      // Edge validates first; DB/RPC validates again.
      // ========================================================

      const {
        data,
        error,
      } =
        await ctx
          .supabaseAdmin
          .rpc(
            'submit_public_home_check_v3_internal',
            {
              p_name:
                name,

              p_phone:
                phone,

              p_home_household_members:
                household,

              p_home_priority_spaces:
                prioritySpaces,

              p_home_priority_space_other:
                prioritySpaceOther,

              p_home_check_reason:
                checkReason,

              p_home_focus_objects:
                focusObjects,

              p_home_focus_object_other:
                focusObjectOther,

              p_home_current_management:
                currentManagement,

              p_home_check_goal:
                checkGoal,
            },
          )

      if (error) {
        // SECURITY:
        // Do not log customer payload or raw DB error details.
        console.error(
          'submit_public_home_check_v3_internal failed',
          {
            code: error.code,
          },
        )

        return json(
          {
            ok: false,
            error: 'storage_failed',
          },
          500,
        )
      }

      const diagnosisId =
        extractDiagnosisId(
          data,
        )

      if (!diagnosisId) {
        console.error(
          'submit_public_home_check_v3_internal returned no diagnosis_id',
        )

        return json(
          {
            ok: false,
            error: 'storage_failed',
          },
          500,
        )
      }

      // ========================================================
      // EXISTING BOOKING TOKEN — UNCHANGED SYSTEM
      //
      // Raw token:
      // - never logged
      // - never persisted by this Edge Function
      // - returned only in the HTTPS response for in-memory use
      // ========================================================

      let bookingToken:
        string | null =
          null

      let bookingTokenExpiresAt:
        string | null =
          null

      let bookingAvailable =
        false

      try {
        const {
          data:
            tokenData,
          error:
            tokenError,
        } =
          await ctx
            .supabaseAdmin
            .rpc(
              'issue_booking_access_token_internal',
              {
                p_diagnosis_id:
                  diagnosisId,
              },
            )

        if (tokenError) {
          console.error(
            'issue_booking_access_token_internal failed',
            {
              code:
                tokenError.code,
            },
          )
        } else {
          const tokenRow =
            Array.isArray(tokenData) &&
            tokenData.length > 0
              ? tokenData[0]
              : null

          const rawToken =
            typeof tokenRow
              ?.booking_token ===
              'string'
              ? tokenRow.booking_token
              : ''

          const rawExpiresAt =
            typeof tokenRow
              ?.expires_at ===
              'string'
              ? tokenRow.expires_at
              : ''

          if (
            /^[0-9a-f]{64}$/.test(
              rawToken,
            ) &&
            rawExpiresAt &&
            Number.isFinite(
              Date.parse(
                rawExpiresAt,
              ),
            )
          ) {
            bookingToken =
              rawToken

            bookingTokenExpiresAt =
              rawExpiresAt

            bookingAvailable =
              true
          }
        }
      } catch {
        // SECURITY:
        // Do not log an exception object that may contain request context.
        console.error(
          'booking token issuance unexpected failure',
        )
      }

      // ========================================================
      // SUCCESS
      // No automatic CARE PLAN decision in V3.
      // ========================================================

      return json({
        ok: true,

        customer_type:
          'home',

        check_version:
          3,

        submission_id:
          diagnosisId,

        recommended_plan:
          null,

        result_level:
          null,

        result_message:
          'HOME CHECK V3 응답이 정상적으로 저장되었습니다.',

        booking_available:
          bookingAvailable,

        booking_token:
          bookingToken,

        booking_token_expires_at:
          bookingTokenExpiresAt,
      })
    },
  ),
}
