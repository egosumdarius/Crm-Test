import { Meeting } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; expires_in?: number }) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

// Scopes required for Calendar & Gmail integration
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

/**
 * Encodes a string to Base64URL (RFC 4648 §5)
 */
function base64UrlEncode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Fetches the user profile from Google
 */
export async function getGoogleUserProfile(accessToken: string): Promise<{ email: string; name?: string; picture?: string }> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) {
      throw new Error(`Error fetching userinfo: ${res.status}`);
    }
    const data = await res.json();
    return {
      email: data.email || 'consultor@empresa.com',
      name: data.name || data.email?.split('@')[0] || 'Consultor',
      picture: data.picture
    };
  } catch (error) {
    console.warn('Could not fetch user profile from oauth2 endpoint, trying gmail profile:', error);
    try {
      const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (gmailRes.ok) {
        const gData = await gmailRes.json();
        return {
          email: gData.emailAddress || 'consultor@empresa.com',
          name: gData.emailAddress ? gData.emailAddress.split('@')[0] : 'Consultor'
        };
      }
    } catch {
      // Fallback
    }
    return { email: 'dario.ramirez@gmail.com', name: 'Darío Ramírez' };
  }
}

/**
 * Creates an event in Google Calendar with Google Meet video link
 */
export async function createGoogleCalendarEvent(
  accessToken: string,
  meeting: {
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    attendeeEmail?: string;
    location?: string;
  }
): Promise<{ eventId: string; meetLink?: string; htmlLink?: string }> {
  const startDateTime = new Date(`${meeting.date}T${meeting.startTime}:00`).toISOString();
  const endDateTime = new Date(`${meeting.date}T${meeting.endTime}:00`).toISOString();

  const requestBody: Record<string, any> = {
    summary: meeting.title,
    description: meeting.description,
    location: meeting.location || 'Google Meet',
    start: {
      dateTime: startDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    },
    end: {
      dateTime: endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    },
    conferenceData: {
      createRequest: {
        requestId: `crm-meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  };

  if (meeting.attendeeEmail) {
    requestBody.attendees = [{ email: meeting.attendeeEmail }];
  }

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error al crear evento en Google Calendar: ${response.status}`);
  }

  const eventData = await response.json();
  const meetLink = eventData.conferenceData?.entryPoints?.find(
    (ep: any) => ep.entryPointType === 'video'
  )?.uri || eventData.hangoutLink;

  return {
    eventId: eventData.id,
    meetLink: meetLink || 'https://meet.google.com/new',
    htmlLink: eventData.htmlLink
  };
}

/**
 * Lists upcoming events from Google Calendar
 */
export async function listGoogleCalendarEvents(
  accessToken: string,
  daysBack: number = 7,
  daysForward: number = 30
): Promise<any[]> {
  const timeMin = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000).toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    timeMin
  )}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=50`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error al sincronizar Google Calendar: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Deletes an event in Google Calendar
 */
export async function deleteGoogleCalendarEvent(accessToken: string, eventId: string): Promise<boolean> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return response.ok || response.status === 404;
}

/**
 * Sends an email using the Gmail API (RFC 2822 MIME message)
 */
export async function sendGmailMessage(
  accessToken: string,
  params: {
    to: string;
    subject: string;
    body: string;
    senderName?: string;
    senderEmail?: string;
  }
): Promise<{ messageId: string; threadId: string }> {
  // Construct raw RFC 2822 message
  const fromHeader = params.senderName && params.senderEmail
    ? `From: =?utf-8?B?${btoa(unescape(encodeURIComponent(params.senderName)))}?= <${params.senderEmail}>\r\n`
    : '';

  const encodedSubject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`;

  const rawMessage = 
    `${fromHeader}` +
    `To: ${params.to}\r\n` +
    `Subject: ${encodedSubject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset="UTF-8"\r\n` +
    `Content-Transfer-Encoding: 8bit\r\n\r\n` +
    `${params.body}`;

  const encodedRaw = base64UrlEncode(rawMessage);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: encodedRaw
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al enviar correo con Gmail: ${response.status}`);
  }

  const data = await response.json();
  return {
    messageId: data.id,
    threadId: data.threadId
  };
}
