
## Poll System Upgrade: Themed Buttons, Stats Tracking, and Unlockable Tests

### What Changes

1. **Yes/No Button Colors**
   - "Yes" button uses the theme accent color (from `--gold-h`/`--gold-s`/`--gold-l` CSS variables) as its background
   - "No" button uses the inverse of the current mode: in dark mode it uses a white/light color, in light mode it uses a dark/black color
   - Both buttons become large, prominent tap targets styled like action buttons (not just text options)

2. **Post-Answer Stats Section**
   - After answering a poll, a stats card appears below the result showing:
     - Total questions answered today (e.g., "4/11 answered today")
     - Daily cap of 11 questions enforced -- once reached, remaining polls are locked with a message
     - Progress towards unlocking personality/psychological tests with progress bars:
       - "Answer 25 more to unlock: Myers-Briggs Personality Type"
       - "Answer 50 more to unlock: Big Five Personality Profile"
       - "Answer 75 more to unlock: Emotional Intelligence Assessment"
       - "Answer 100 more to unlock: Shadow Self Analysis"
       - "Answer 150 more to unlock: Attachment Style Profile"
     - A "Coming Soon" label on locked tests

3. **Daily Cap System**
   - Track answers in localStorage with a date key (resets daily)
   - After 11 answers in a day, show "Daily limit reached -- come back tomorrow!" 
   - Remaining poll cards show a lock overlay

### Technical Details

**Modified: `src/components/PollCard.tsx`**
- Restyle the Yes/No option buttons:
  - "Yes": `background: hsl(var(--gold-h), var(--gold-s), var(--gold-l))` with white text
  - "No": `bg-foreground text-background` (automatically inverts with dark/light mode)
- Make buttons full-width, rounded, stacked vertically with clear labels
- After voting, show the result percentages, then render a `<PollStats />` component below

**New: `src/components/PollStats.tsx`**
- Displays:
  - Daily answer count with progress bar (X/11)
  - List of unlockable tests with their required answer thresholds
  - Each test shows a progress bar and lock/unlock icon
- Reads/writes answer count from localStorage (`poll-answers-{YYYY-MM-DD}` key for daily reset, `poll-answers-total` for cumulative)

**Modified: `src/components/PollSection.tsx`**
- Pass daily answer count state down to PollCards
- Enforce the 11-question daily cap: disable voting on cards beyond the limit
- Show a summary stats banner at the top showing daily progress

**Modified: `src/pages/TCMPage.tsx`**
- Minor: add a note about "Questions updated regularly" placeholder text

**Unlockable Tests (milestone thresholds):**
| Answers Required | Test Name |
|---|---|
| 25 | Myers-Briggs Personality Type |
| 50 | Big Five Personality Profile |
| 75 | Emotional Intelligence Assessment |
| 100 | Shadow Self Analysis |
| 150 | Attachment Style Profile |
| 200 | Cognitive Bias Mapping |

All stored client-side for now (localStorage). When questions are uploaded to the database later, this system will be ready to connect.
