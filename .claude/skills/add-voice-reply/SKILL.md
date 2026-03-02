---
name: add-voice-reply
description: Add ElevenLabs voice replies so the bot responds to voice notes with voice notes.
---

# Add Voice Replies (ElevenLabs)

When someone sends a voice note, the bot replies with a voice note instead of text. Uses ElevenLabs TTS.

## Setup

### 1. ElevenLabs API key

Ask the user to:
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Go to Settings > API Keys
3. Copy the API key

Add to `.env`:
```
ELEVENLABS_API_KEY=<key>
```

### 2. Pick a voice

Ask: "Which voice should the bot use? You can browse voices at elevenlabs.io/voice-library, or use a custom/cloned voice."

If they have a specific voice, get the voice ID from the ElevenLabs dashboard. If not, suggest they browse the library and pick one that fits.

Add to `.env`:
```
ELEVENLABS_VOICE_ID=<voice_id>
```

If they skip this, the default voice will be used.

### 3. Rebuild and restart

```bash
npm run build
launchctl kickstart -k gui/$(id -u)/com.ghostclaw  # macOS
# systemctl --user restart ghostclaw                # Linux
```

### 4. Test

Tell the user to send a voice note to the bot. It should reply with a voice note using the selected voice. Text messages still get text replies.

## How it works

The bot detects when an incoming message is a voice note (tagged `[Voice: ...]` after transcription). When replying to a voice message, it converts the text response to audio via ElevenLabs TTS and sends it as a voice note. Text messages always get text replies.

## Disabling

Remove `ELEVENLABS_API_KEY` from `.env` and restart. The bot will fall back to text replies for everything.
